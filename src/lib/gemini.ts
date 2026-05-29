import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey =
  import.meta.env
    .VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "Missing Gemini API Key"
  );
}

const genAI =
  new GoogleGenerativeAI(
    apiKey
  );

export const model =
  genAI.getGenerativeModel({
    model:
      "gemini-2.5-flash",
  });

export async function askGemini(
  prompt: string
) {
  const result =
    await model.generateContent(
      prompt
    );

  return result.response.text();
}

export async function streamGemini(
  prompt: string,
  onChunk: (
    text: string
  ) => void
) {
  const result =
    await model.generateContentStream(
      prompt
    );

  let fullText = "";

  for await (const chunk of result.stream) {
    const text =
      chunk.text();

    fullText += text;

    onChunk(fullText);
  }

  return fullText;
}