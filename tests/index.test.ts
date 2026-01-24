import { describe, it, expect, vi, beforeEach } from "vitest";
import { textToMermaid } from "../src/index";
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

  it("should use DeterministicParser when useAI is false (default)", async () => {
    // "User clicks Button" is valid SVO
    const result = await textToMermaid("User clicks Button", { useAI: false });

    expect(result).toBe("graph LR; sub[User] -->|clicks| obj[Button]");
    expect(mockGenaiParse).not.toHaveBeenCalled();
  });

  it("should use DeterministicParser when useAI is undefined", async () => {
    const result = await textToMermaid("User clicks Button");

    expect(result).toBe("graph LR; sub[User] -->|clicks| obj[Button]");
    expect(mockGenaiParse).not.toHaveBeenCalled();
  });

  it("should use genaiParse when useAI is true", async () => {
    mockGenaiParse.mockResolvedValue("graph TD; AI-->Generated");

    const result = await textToMermaid("Some complex input", { useAI: true });

    expect(result).toBe("graph TD; AI-->Generated");
    expect(mockGenaiParse).toHaveBeenCalledTimes(1);
    expect(mockGenaiParse).toHaveBeenCalledWith(
      "Some complex input",
      undefined,
      undefined,
    );
  });

  it("should NOT use DeterministicParser when useAI is true, even if input is simple", async () => {
    mockGenaiParse.mockResolvedValue("graph TD; AI-->Generated");

    // "User clicks Button" is simple SVO, but with useAI=true it should go to AI
    const result = await textToMermaid("User clicks Button", { useAI: true });

    expect(result).toBe("graph TD; AI-->Generated");
    expect(mockGenaiParse).toHaveBeenCalled();
  });
});
