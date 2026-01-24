import { DeterministicParser } from "./deterministic/rule-parser";
import { genaiParse } from "./neural/genai";

export async function textToMermaid(
  text: string,
  options: { useAiFallback?: boolean } = {},
): Promise<string | null> {
  const { useAiFallback = false } = options;

  // Step 1: Deterministic Parsing
  const deterministicParser = new DeterministicParser();
  const ruleBasedResult = deterministicParser.parse(text);

  if (ruleBasedResult) {
    // Step 2: Return result immediately
    // Generated via Rules
    return ruleBasedResult;
  }

  // Step 3: Neural Fallback
  if (useAiFallback) {
    const result = await genaiParse(text);
    return result || null;
  }

  return null;
}
