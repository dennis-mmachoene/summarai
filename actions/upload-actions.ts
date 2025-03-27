"use server";

import { getDbConnection } from "@/lib/db";
import { generateSummaryFromGemini } from "@/lib/geminiai";
import { fetchAndExtractPdfText } from "@/lib/langChain";
import { generateSummaryFromOpenAI } from "@/lib/openai";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface pdfSummaryType {
  userId?: string;
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
}
export async function generatePdfSummary(
  uploadResponse: [
    {
      serverData: {
        userId: String;
        file: {
          url: string;
          name: string;
        };
      };
    }
  ]
) {
  if (!uploadResponse) {
    return {
      success: "False",
      message: "File upload failed",
      data: null,
    };
  }

  const {
    serverData: {
      userId,
      file: { url: pdfUrl, name: fileName },
    },
  } = uploadResponse[0];

  if (!pdfUrl) {
    return {
      success: "False",
      message: "File upload failed",
      data: null,
    };
  }

  try {
    const pdfText = await fetchAndExtractPdfText(pdfUrl);
    console.log(pdfText);

    let summary;
    try {
      summary = await generateSummaryFromOpenAI(pdfText); // First try OpenAI
      console.log("OpenAI summary:", summary);
    } catch (error) {
      console.log("OpenAI error:", error);

      if (error instanceof Error && error.message === "RATE_LIMIT_EXCEEDED") {
        try {
          summary = await generateSummaryFromGemini(pdfText); // Fallback to Gemini
          console.log("Gemini summary:", summary);
        } catch (geminiError) {
          console.error("Gemini API failed:", geminiError);
          throw new Error(
            "Failed to generate summary with available AI providers"
          );
        }
      } else {
        throw error; // Rethrow the error if it's not a rate limit issue
      }
    }

    if (!summary) {
      return {
        success: "False",
        message: "Failed to generate summary",
        data: null,
      };
    }

    const title = formatFileNameAsTitle(fileName);
    return {
      success: true,
      message: "Summary generated successfully",
      data: {
        title: title,
        summary: summary,
      },
    };
  } catch (err) {
    return {
      success: "False",
      message: "File upload failed",
      data: null,
    };
  }
}

async function savePdfSummary({
  userId,
  fileUrl,
  summary,
  title,
  fileName,
}: pdfSummaryType) {
  try {
    const sql = await getDbConnection();

    // Insert and return the ID of the newly created row
    const [insertedRow] = await sql`
      INSERT INTO pdf_summaries (
        user_id,
        original_file_url,
        summary_text,
        title,
        file_name
      )
      VALUES (${userId}, ${fileUrl}, ${summary}, ${title}, ${fileName})
      RETURNING id;
    `;

    console.log("Inserted row:", insertedRow); // Log inserted row
    return insertedRow; // Ensure we return the inserted record
  } catch (error: any) {
    console.error("Error saving PDF summary:", error.message || error);
    throw error;
  }
}



export async function storePdfSummaryAction({
  fileUrl,
  summary,
  title,
  fileName,
}: pdfSummaryType) {

  let savedSummary: any
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Ensure savePdfSummary returns the inserted record
     savedSummary = await savePdfSummary({
      userId,
      fileUrl,
      summary,
      title,
      fileName,
    });

    if (!savedSummary || !savedSummary.id) {
      return {
        success: false,
        message: "Failed to save PDF summary, please try again...",
      };
    }

    // Ensure revalidation only happens with a valid ID
    revalidatePath(`/summaries/${savedSummary.id}`);

    return {
      success: true,
      message: "PDF summary saved successfully",
      data: {
        id: savedSummary.id,
      },
    };
  } catch (error) {
    return {
      success: false, // Fixed typo
      message: error instanceof Error ? error.message : "Error saving PDF summary",
    };
  }
}
