import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Missing Gemini API Key");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const generateSummaryFromGemini = async (pdfText: string) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-002",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1500,
      },
    });
    const prompt = {
      contents: [
        {
          role: "user",
          parts: [
            { text: SUMMARY_SYSTEM_PROMPT },
            {
              text: `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting: \n\n${pdfText}`,
            },
          ],
        },
      ],
    };

    const result = await model.generateContent(prompt);

    if(!result.response.text()){
        throw new Error('Empty response from Gemini API')
    }
    return result.response.text(); // Ensure this method is valid
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Gemini API error:", err);
      throw new Error(`Gemini API error: ${err.message}`);
    }
    throw new Error("An unknown error occurred");
  }
};
