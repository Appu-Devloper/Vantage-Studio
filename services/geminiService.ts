
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateMarketingCopy(appDescription: string, count: number) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate ${count} compelling, short marketing headlines and subtitles for mobile app store screenshots based on this description: "${appDescription}". Each headline should be very brief (max 5-6 words) and the subtitle should be max 10 words. Return JSON only.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING }
            },
            required: ["title", "subtitle"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to generate copy:", error);
    return null;
  }
}
