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
    expect(result).toContain('A("Start")');
    expect(result).toContain('B["End"]');
    expect(result).toContain("A --> | Go | B");
  });

  it("should use local LLM when baseUrl is provided", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                orientation: "TD",
                nodes: [{ id: "A", label: "Start", shape: "round" }],
                links: [],
              }),
            },
          },
        ],
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await genaiParse(
      "start",
      undefined,
      "http://localhost:8080",
    );

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8080/v1/chat/completions",
      expect.any(Object),
    );
    // Verify that the shared convertJsonToMermaid logic is applied (quoting labels)
    expect(result).toContain('A("Start")');

    vi.unstubAllGlobals();
  });
});
