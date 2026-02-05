import { DeterministicParser } from "./deterministic/rule-parser";
import { genaiParse } from "./neural/genai";

export const ParseStrategy = {
  Deterministic: "deterministic",
  Gemini: "gemini",
  Llm: "llm",
} as const;

export type ParseStrategy = (typeof ParseStrategy)[keyof typeof ParseStrategy];

export type TextToMermaidOptions = {
  strategy?: ParseStrategy;
  aiConfig?: {
    baseUrl?: string;
    apiKey?: string;
  };
};

export async function textToMermaid(
  text: string,
  options: TextToMermaidOptions = {},
): Promise<string | null> {
  const { strategy = ParseStrategy.Deterministic, aiConfig } = options;

  switch (strategy) {
    case ParseStrategy.Gemini:
      // Neural Only (Gemini)
      const geminiResult = await genaiParse(text, aiConfig?.apiKey, undefined);
      return geminiResult || null;

    case ParseStrategy.Llm:
      // Neural Only (Local/Generic LLM)
      const llmResult = await genaiParse(
        text,
        aiConfig?.apiKey,
        aiConfig?.baseUrl,
      );
      return llmResult || null;

    case ParseStrategy.Deterministic:
    default:
      // Deterministic Only
      const deterministicParser = new DeterministicParser();
      const ruleBasedResult = deterministicParser.parse(text);
      return ruleBasedResult || null;
  }
}
