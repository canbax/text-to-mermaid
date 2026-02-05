import { describe, it, expect, vi, beforeEach } from "vitest";
import { textToMermaid, ParseStrategy } from "../src/index";
import { genaiParse } from "../src/neural/genai";

// Mock genaiParse
vi.mock("../src/neural/genai", () => ({
  genaiParse: vi.fn(),
}));

describe("textToMermaid", () => {
  const mockGenaiParse = genaiParse as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should use DeterministicParser when strategy is Deterministic (default)", async () => {
    // "User clicks Button" is valid SVO
    const result = await textToMermaid("User clicks Button", {
      strategy: ParseStrategy.Deterministic,
    });

    const expected = [
      "graph TB",
      '    node_0(("User"))',
      '    node_1["Button"]',
      '    node_0 --> |"clicks"| node_1',
    ].join("\n");
    expect(result).toBe(expected);
    expect(mockGenaiParse).not.toHaveBeenCalled();
  });

  it("should use DeterministicParser when options are empty", async () => {
    const result = await textToMermaid("User clicks Button");

    const expected = [
      "graph TB",
      '    node_0(("User"))',
      '    node_1["Button"]',
      '    node_0 --> |"clicks"| node_1',
    ].join("\n");
    expect(result).toBe(expected);
    expect(mockGenaiParse).not.toHaveBeenCalled();
  });

  it("should use genaiParse when strategy is Gemini", async () => {
    mockGenaiParse.mockResolvedValue("graph TD; AI-->Generated");

    const result = await textToMermaid("Some complex input", {
      strategy: ParseStrategy.Gemini,
      aiConfig: { apiKey: "test-key" },
    });

    expect(result).toBe("graph TD; AI-->Generated");
    expect(mockGenaiParse).toHaveBeenCalledTimes(1);
    expect(mockGenaiParse).toHaveBeenCalledWith(
      "Some complex input",
      "test-key",
      undefined,
    );
  });

  it("should use genaiParse with baseUrl when strategy is Llm", async () => {
    mockGenaiParse.mockResolvedValue("graph TD; Local-->Generated");

    const result = await textToMermaid("Some complex input", {
      strategy: ParseStrategy.Llm,
      aiConfig: { baseUrl: "http://localhost:8080" },
    });

    expect(result).toBe("graph TD; Local-->Generated");
    expect(mockGenaiParse).toHaveBeenCalledTimes(1);
    expect(mockGenaiParse).toHaveBeenCalledWith(
      "Some complex input",
      undefined,
      "http://localhost:8080",
    );
  });
});
