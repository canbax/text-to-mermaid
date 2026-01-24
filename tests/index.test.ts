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

  it("should return deterministic result if found", async () => {
    // "User uses Tool" is a simple SVO that DeterministicParser handles (User = Subject, uses = Verb, Tool = Object)
    // "User clicks Button" -> Subject: User, Verb: clicks, Object: Button.

    const result = await textToMermaid("User clicks Button");
    expect(result).toBe("graph LR; User -->|clicks| Button");
    expect(mockGenaiParse).not.toHaveBeenCalled();
  });

  it("should return null if deterministic fails and fallback is disabled", async () => {
    const result = await textToMermaid("Not a valid sentence structure", {
      useAiFallback: false,
    });
    expect(result).toBeNull();
    expect(mockGenaiParse).not.toHaveBeenCalled();
  });

  it("should use neural fallback if deterministic fails and native fallback is enabled", async () => {
    mockGenaiParse.mockResolvedValue("graph TD; AI-->Generated");

    const result = await textToMermaid("Complex sentence that rules miss", {
      useAiFallback: true,
    });

    expect(result).toBe("graph TD; AI-->Generated");
  });

  it("should NOT use neural fallback if deterministic succeeds, even if enabled", async () => {
    const result = await textToMermaid("User clicks Button", {
      useAiFallback: true,
    });
    expect(result).toBe("graph LR; User -->|clicks| Button");
    expect(mockGenaiParse).not.toHaveBeenCalled();
  });
});
