import { DeterministicParser } from "./deterministic/rule-parser";
import { genaiParse } from "./neural/genai";

export async function textToMermaid(
  text: string,
  options: {
    useAI?: boolean;
    aiConfig?: {
      baseUrl?: string;
      apiKey?: string;
    };
  } = {},
): Promise<string | null> {
  const { useAI = false, aiConfig } = options;

  if (useAI) {
    // Neural Only
    const result = await genaiParse(text, aiConfig?.apiKey, aiConfig?.baseUrl);
    return result || null;
  } else {
    // Deterministic Only
    const deterministicParser = new DeterministicParser();
    const ruleBasedResult = deterministicParser.parse(text);
    return ruleBasedResult || null;
  }
}
