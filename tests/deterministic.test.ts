import { describe, it, expect } from "vitest";
import { DeterministicParser } from "../src/deterministic/rule-parser";

describe("DeterministicParser", () => {
  const parser = new DeterministicParser();

  it("should parse simple SVO sentences", () => {
    const text = "Client sends request";
    const result = parser.parse(text);
    expect(result).toBe("graph LR; sub[Client] -->|sends| obj[request]");
  });

  it("should parse sentences with compound nouns", () => {
    const text = "User Database stores information";
    const result = parser.parse(text);
    expect(result).toBe(
      "graph LR; sub[User Database] -->|stores| obj[information]",
    );
  });

  it("should return null for incomplete sentences", () => {
    const text = "Server starts"; // Missing object
    const result = parser.parse(text);
    expect(result).toBeNull();
  });

  it("should return null for unclear structure", () => {
    const text = "Hello world";
    const result = parser.parse(text);
    expect(result).toBeNull();
  });

  it("should parse sentences with object phrases containing prepositions", () => {
    const text = "users likes apps about games";
    const result = parser.parse(text);
    expect(result).toBe(
      "graph LR; sub[users] -->|likes| obj[apps about games]",
    );
  });

  it("should parse complex scientific sentences with parentheticals and relative clauses", () => {
    const text =
      "The fast multipole method (FMM) is a numerical technique that was developed to speed up the calculation of long-ranged forces in the n-body problem";
    const result = parser.parse(text);
    expect(result).toBe(
      "graph LR; sub[The fast multipole method FMM] -->|is| obj[a numerical technique that was developed to speed up the calculation of long-ranged forces in the n-body problem]",
    );
  });
});
