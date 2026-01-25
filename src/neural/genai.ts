import { GoogleGenAI } from "@google/genai";
import { convertJsonToMermaid, flowchartSchema } from "./util";

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
  baseUrl?: string,
): Promise<string | undefined> {
  // 1. Local LLM Case (OpenAI Compatible)
  if (baseUrl) {
    const prompt = `Convert this text to a mermaid.js syntax: ${text}`;

    // Convert Google Schema to Standard JSON Schema
    const jsonSchema = {
      type: "object",
      properties: {
        orientation: {
          type: "string",
          enum: ["TB", "TD", "BT", "RL", "LR"],
          description: "The orientation of the flowchart.",
        },
        nodes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description: "Unique alphanumeric identifier.",
              },
              label: { type: "string", description: "Text label." },
              shape: {
                type: "string",
                description: "The shape of the node.",
                enum: (flowchartSchema.properties?.nodes as any)?.items
                  ?.properties?.shape?.enum,
              },
            },
            required: ["id", "label", "shape"],
          },
        },
        links: {
          type: "array",
          items: {
            type: "object",
            properties: {
              sourceId: { type: "string" },
              targetId: { type: "string" },
              style: {
                type: "string",
                enum: ["-->", "---", "-.->", "==>", "o--o", "x--x", "<-->"],
              },
              label: { type: "string" },
            },
            required: ["sourceId", "targetId", "style"],
          },
        },
      },
      required: ["orientation", "nodes", "links"],
    };

    try {
      const response = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey || "not-needed"}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that converts text to mermaid.js flowchart JSON structure. You must output VALID JSON only.",
            },
            { role: "user", content: prompt },
          ],
          response_format: {
            type: "json_object",
            schema: jsonSchema,
          },
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        throw new Error(`Local LLM error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) return undefined;

      return convertJsonToMermaid(JSON.parse(content));
    } catch (e) {
      console.error("Local LLM Parse Error:", e);
      return undefined;
    }
  }

  // 2. Google GenAI Case
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

  return convertJsonToMermaid(JSON.parse(response?.text || "{}"));
}
