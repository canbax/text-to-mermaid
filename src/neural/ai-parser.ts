import { pipeline } from "@xenova/transformers";

export class NeuralParser {
  private static instance: NeuralParser;
  private pipe: any = null;

  private constructor() {}

  static getInstance(): NeuralParser {
    if (!NeuralParser.instance) {
      NeuralParser.instance = new NeuralParser();
    }
    return NeuralParser.instance;
  }

  async parse(text: string): Promise<string> {
    try {
      if (!this.pipe) {
        this.pipe = await pipeline(
          "text2text-generation",
          "Xenova/LaMini-Flan-T5-78M",
        );
      }

      const prompt = `Convert this text to a mermaid.js flowchart: ${text}`;
      const result = await this.pipe(prompt, { max_new_tokens: 512 });

      let output = result[0].generated_text || "";

      // Cleanup markdown code blocks if present
      output = output
        .replace(/```mermaid/g, "")
        .replace(/```/g, "")
        .trim();

      return output;
    } catch (error) {
      console.error("NeuralParser Error:", error);
      return "graph TD; Error[AI Generation Failed];";
    }
  }
}
