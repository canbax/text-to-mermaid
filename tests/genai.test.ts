import { describe, it, expect, vi, beforeEach } from "vitest";
import { genaiParse } from "../src/neural/genai";
import { GoogleGenAI } from "@google/genai";

const { mockGenerateContent } = vi.hoisted(() => {
  return { mockGenerateContent: vi.fn() };
});

vi.mock("@google/genai", () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: mockGenerateContent,
      },
    })),
    Type: {
      OBJECT: "OBJECT",
      STRING: "STRING",
      ARRAY: "ARRAY",
    },
  };
});

describe("genaiParse", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize GoogleGenAI and generate mermaid code", async () => {
    const mockResponse = {
      text: JSON.stringify({
        orientation: "TD",
        nodes: [
          { id: "A", label: "Start", shape: "round" },
          { id: "B", label: "End", shape: "square" },
        ],
        links: [{ sourceId: "A", targetId: "B", style: "-->", label: "Go" }],
      }),
    };

    mockGenerateContent.mockResolvedValue(mockResponse);

    const result = await genaiParse("start to end", "fake-api-key");

    expect(GoogleGenAI).toHaveBeenCalledWith({ apiKey: "fake-api-key" });
    expect(mockGenerateContent).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "gemini-2.5-flash",
        config: expect.objectContaining({
          responseMimeType: "application/json",
        }),
      }),
    );

    expect(result).toContain("graph TD");
    expect(result).toContain("A(Start)");
    expect(result).toContain("B[End]");
    expect(result).toContain("A --> | Go | B");
  });
});
