"use server";

import { fetchAndExtractPdfText } from "@/lib/langChain";

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

  if(!pdfUrl){
    return {
        success: "False",
        message: "File upload failed",
        data: null,
      };
  }

  try{
   const pdfText = await fetchAndExtractPdfText(pdfUrl);
   console.log(pdfText)
  }catch(err){
    return {
        success: "False",
        message: "File upload failed",
        data: null,
      };
  }
}
