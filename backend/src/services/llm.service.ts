import { GoogleGenerativeAI } from "@google/generative-ai";

console.log(
  "GEMINI KEY FOUND:",
  process.env.GEMINI_API_KEY ? "YES" : "NO"
);

console.log(
  "KEY PREFIX:",
  process.env.GEMINI_API_KEY?.substring(0, 15)
);

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ""
);

export const llmService = {
  async generateReply(prompt: string): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

      const result = await model.generateContent(prompt);

      return result.response.text();
    } catch (error: any) {
      console.log("\n========== FULL GEMINI ERROR ==========\n");

      console.dir(error, {
        depth: null,
      });

      console.log("\n=======================================\n");

      if (error?.status === 429) {
        return "Gemini rate limit reached. Please try again in a minute.";
      }

      if (error?.status === 401) {
        return "Invalid Gemini API key.";
      }

      if (error?.status === 403) {
        return "Gemini access forbidden.";
      }

      return "Sorry, I'm currently unable to respond.";
    }
  },
};