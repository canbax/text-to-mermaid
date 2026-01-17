import { describe, it, expect, vi, beforeEach } from "vitest";
import { NeuralParser } from "../src/neural/ai-parser";
import * as transformers from "@huggingface/transformers";

// Mock pipeline
const mockGenerator = vi.fn();
vi.mock("@huggingface/transformers", () => ({
  pipeline: vi.fn(),
}));

describe("NeuralParser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (transformers.pipeline as any).mockResolvedValue(mockGenerator);
    mockGenerator.mockResolvedValue([{ generated_text: "graph TD; A-->B" }]);
  });

  it("should be a singleton", () => {
    const instance1 = NeuralParser.getInstance();
    const instance2 = NeuralParser.getInstance();
    expect(instance1).toBe(instance2);
  });

  it("should init pipeline and generate text", async () => {
    const parser = NeuralParser.getInstance();
    const result = await parser.parse("test input");

    expect(transformers.pipeline).toHaveBeenCalledWith("text2text-generation");
    expect(mockGenerator).toHaveBeenCalledWith(
      expect.stringContaining("mermaid.js"),
      expect.objectContaining({
        max_new_tokens: 512,
        grammar: expect.stringContaining("root ::="),
      }),
    );
    expect(result).toBe("graph TD; A-->B");
  });

  it("should strip markdown formatting", async () => {
    mockGenerator.mockResolvedValue([
      { generated_text: "```mermaid\ngraph LR; C-->D\n```" },
    ]);
    const parser = NeuralParser.getInstance();
    const result = await parser.parse("test input");

    expect(result).toBe("graph LR; C-->D");
  });

  it("should return safe error string on failure", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    mockGenerator.mockRejectedValue(new Error("Model error"));
    const parser = NeuralParser.getInstance();
    const result = await parser.parse("crash");

    expect(result).toContain("Error");
    expect(result).toContain("graph TD");
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
