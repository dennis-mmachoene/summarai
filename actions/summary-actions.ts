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
