import { describe, it, expect } from "vitest";
import { DeterministicParser } from "../src/deterministic/rule-parser";

describe("DeterministicParser", () => {
  const parser = new DeterministicParser();

  it("should parse simple SVO sentences", () => {
    const text = "Client sends request";
    const result = parser.parse(text);
    expect(result).toBe("graph LR; Client -->|sends| request");
  });

  it("should parse sentences with compound nouns", () => {
    const text = "User Database stores information";
    const result = parser.parse(text);
    expect(result).toBe("graph LR; User Database -->|stores| information");
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
});
