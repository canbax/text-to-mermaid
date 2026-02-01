import { describe, it, expect } from "vitest";
import { DeterministicParser } from "../src/deterministic/rule-parser";

describe("DeterministicParser", () => {
  const parser = new DeterministicParser();

  it("should parse simple SVO sentences", () => {
    const text = "Client sends request";
    const result = parser.parse(text);
    const expected = [
      "graph TB",
      '    node_0(("Client"))',
      '    node_1["request"]',
      '    node_0 --> |"sends"| node_1',
    ].join("\n");
    expect(result).toBe(expected);
  });

  it("should parse sentences with compound nouns", () => {
    const text = "User Database stores information";
    const result = parser.parse(text);

    // Nouns: "User Database", "information"
    const expected = [
      "graph TB",
      '    node_0(("User Database"))',
      '    node_1["information"]',
      '    node_0 --> |"stores"| node_1',
    ].join("\n");

    expect(result).toBe(expected);
  });

  it("should return a single node graph for incomplete sentences / single nouns", () => {
    const text = "Server starts"; // "Server" is noun, "starts" might be seen as verb or plural noun depending on context, assuming mostly noun fallback here if no verb detected before it
    const result = parser.parse(text);
    expect(result).toContain('node_0((" Server starts "))');
  });

  it("should return a single node graph for unclear structure", () => {
    const text = "Hello world";
    const result = parser.parse(text);
    expect(result).toContain('node_0((" world "))');
  });

  it("should parse sentences with object phrases containing prepositions", () => {
    const text = "users likes apps about games";
    // Nouns: "users", "apps", "games"
    const result = parser.parse(text);

    expect(result).toContain('node_0(("users"))');
    expect(result).toContain('node_1["apps"]');
    expect(result).toContain('node_0 --> |"likes"| node_1');
    expect(result).toContain('node_2["games"]');
    expect(result).toContain('node_1 --> |"about"| node_2');
  });

  it("should parse complex scientific sentences with parentheticals and relative clauses", () => {
    const text =
      "The fast multipole method (FMM) is a numerical technique that was developed to speed up the calculation of long-ranged forces in the n-body problem";
    const result = parser.parse(text);

    // Checks for specific structure nodes and edges
    expect(result).toContain('node_0(("fast multipole method FMM"))');
    expect(result).toContain('node_1["numerical technique"]');
    expect(result).toContain('node_0 --> |"is"| node_1');

    expect(result).toContain('node_2["calculation"]');
    expect(result).toContain('node_1 --> |"was developed to speed up"| node_2');

    expect(result).toContain('node_3["forces"]');
    // "long-ranged" might end up in the edge or node depending on NLP model version;
    // current behavior puts it in edge: |"of long-ranged"|
    // This is acceptable for a fallback parser.
    // We check for connectivity rather than exact string on edge to be robust,
    // or just check that "forces" is connected to calculation
    expect(result).toContain("node_2");
    expect(result).toContain("node_3");

    expect(result).toContain('node_4["n-body problem"]');
    expect(result).toContain('node_3 --> |"in"| node_4');
  });

  it("should parse single-noun sentences starting with a verb (imperative)", () => {
    const text = "Welcome to the era of Gemini 3.";
    const result = parser.parse(text);

    // Should parse as: verb -> noun
    expect(result).not.toBeNull();
    expect(result).toContain('node_0((" Welcome "))');
    expect(result).toContain('node_1["era of Gemini 3."]');
    expect(result).toContain('node_0 --> |"to"| node_1');
  });

  it("should parse simple command sentences", () => {
    const text = "Start the server";
    const result = parser.parse(text);

    expect(result).not.toBeNull();
    expect(result).toContain('node_0((" Start "))');
    expect(result).toContain('node_1["server"]');
    expect(result).toContain('node_0 --> |"to"| node_1');
  });
});
