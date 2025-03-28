"use server";

import { getDbConnection } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteSummaryAction(summaryId: string) {
  try {
    const sql = await getDbConnection();
    const user = await currentUser();

    const userId = user?.id;
    if (!userId) {
      throw new Error("User not found");
    }

    const result = await sql`
      DELETE FROM pdf_summaries 
      WHERE id = ${summaryId} AND user_id = ${userId} 
      RETURNING id;
    `;

    if (result.length > 0) {
      revalidatePath("/dashboard");
      return {
        success: true,
      };
    }
    
    return {
      success: false,
      message: "Summary not found or already deleted.",
    };
  } catch (error: any) {
    console.error("Error deleting summary:", error);
    return {
      success: false,
      message: error.message || "An error occurred while deleting the summary.",
    };
  }
}

export async function getSummaryById(id: string) {
    try {
        const sql = await getDbConnection();
        const [summary] = await sql`
        SELECT 
        id, 
        user_id, 
        title, 
        original_file_url, 
        summary_text, 
        created_at, 
        updated_at, 
        status, 
        file_name,
        LENGTH(summary_text) - LENGTH(REPLACE(summary_text, ' ', '')) + 1 AS word_count
        FROM pdf_summaries 
        WHERE id=${id}`;

        return summary;
    } catch (error) {
    
        console.log('Error:' , error);
        return
    }
}