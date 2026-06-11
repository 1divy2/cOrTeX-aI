import { GoogleGenerativeAI } from "@google/generative-ai";
const ai = new GoogleGenerativeAI("YOUR_API_KEY");
async function test() {
  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });
    await model.generateContent("hello");
    console.log("gemini-1.5-pro works");
  } catch (e) {
    console.error("gemini-1.5-pro error:", e.message);
  }
}
test();
