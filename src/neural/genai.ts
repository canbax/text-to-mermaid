import { GoogleGenAI } from "@google/genai";
import { convertJsonToGrammar, flowchartSchema } from "./util";

// 1. Define the Schema
// Instead of an EBNF string, we define a JSON schema that represents the *structure* of your grammar.
// This allows Gemini to use "Constrained Decoding" to guarantee the structure exists.

function getEnv(key: string): string | undefined {
  // Check for Vite's import.meta.env (Browser/Vite)
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env[`VITE_${key}`];
  }
  // Check for Node.js process.env (Node)
  if (typeof process !== "undefined" && process.env) {
    return process.env[key];
  }
  return undefined;
}

export async function genaiParse(
  text: string,
  apiKey?: string,
): Promise<string | undefined> {
  const key = apiKey || getEnv("GEMINI_API_KEY");
  if (!key) {
    console.warn("GEMINI_API_KEY not found in environment variables.");
  }
  const client = new GoogleGenAI({ apiKey: key || "" });

  const prompt = `Convert this text to a mermaid.js syntax: ${text}`;

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash", // Ensure you use a model that supports strict JSON mode
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: flowchartSchema,
    },
  });

  return convertJsonToGrammar(JSON.parse(response?.text));
}
