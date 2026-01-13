import { describe, it, expect, vi, beforeEach } from "vitest";
import { textToMermaid } from "../src/index";
import { NeuralParser } from "../src/neural/ai-parser";

// Mock NeuralParser
vi.mock("../src/neural/ai-parser", () => {
  const mockParse = vi.fn();
  return {
    NeuralParser: {
      getInstance: vi.fn(() => ({
        parse: mockParse,
      })),
    },
  };
});

describe("textToMermaid", () => {
  const mockNeuralParse = NeuralParser.getInstance().parse as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return deterministic result if found", async () => {
    // "User uses Tool" is a simple SVO that DeterministicParser handles (User = Subject, uses = Verb, Tool = Object)
    // Wait, "uses" might not be identified correctly by compromise as a verb depending on context, but let's try a very clear one.
    // "User processes File" -> Subject: User, Verb: processes, Object: File.
    // Let's use the one from the earlier test: "User clicks Button"

    // Actually, I can just rely on the real DeterministicParser.
    const result = await textToMermaid("User clicks Button");
    expect(result).toBe("graph LR; User -->|clicks| Button");
    expect(mockNeuralParse).not.toHaveBeenCalled();
  });

  it("should return null if deterministic fails and fallback is disabled", async () => {
    const result = await textToMermaid("Not a valid sentence structure");
    expect(result).toBeNull();
    expect(mockNeuralParse).not.toHaveBeenCalled();
  });

  it("should use neural fallback if deterministic fails and native fallback is enabled", async () => {
    mockNeuralParse.mockResolvedValue("graph TD; AI-->Generated");

    const result = await textToMermaid("Complex sentence that rules miss", {
      useAiFallback: true,
    });

    expect(result).toBe("graph TD; AI-->Generated");
    expect(mockNeuralParse).toHaveBeenCalledWith(
      "Complex sentence that rules miss",
    );
  });

  it("should NOT use neural fallback if deterministic succeeds, even if enabled", async () => {
    const result = await textToMermaid("User clicks Button", {
      useAiFallback: true,
    });
    expect(result).toBe("graph LR; User -->|clicks| Button");
    expect(mockNeuralParse).not.toHaveBeenCalled();
  });
});
