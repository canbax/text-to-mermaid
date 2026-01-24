import { describe, it, expect } from "vitest";
import { convertJsonToMermaid } from "../src/neural/util";

describe("convertJsonToMermaid", () => {
  it("should convert json to mermaid grammer string", () => {
    const testData = {
      orientation: "TD",
      nodes: [
        { id: "A", label: "Start", shape: "round" },
        { id: "B", label: "Process", shape: "square" },
        { id: "C", label: "Decision", shape: "rhombus" },
        { id: "D", label: "Database", shape: "cylinder" },
        { id: "E", label: "Cloud", shape: "cloud" },
        { id: "F", label: "Manual Input", shape: "manual-input" },
        { id: "G", label: "Multi Process", shape: "multi-process" },
      ],
      links: [
        { sourceId: "A", targetId: "B", style: "-->", label: "Go" },
        { sourceId: "B", targetId: "C", style: "==>", label: "Check" },
        { sourceId: "C", targetId: "D", style: "-.->", label: "Save" },
        { sourceId: "C", targetId: "E", style: "o--o", label: "Sync" },
        { sourceId: "E", targetId: "F", style: "x--x", label: "Stop" },
        { sourceId: "F", targetId: "G", style: "<-->", label: "Exchange" },
      ],
    };

    const mermaidString = convertJsonToMermaid(testData);

    expect(mermaidString).toContain("graph TD");
    expect(mermaidString).toContain('A("Start")');
    expect(mermaidString).toContain('B["Process"]');
    expect(mermaidString).toContain('C{"Decision"}');
    expect(mermaidString).toContain('D["Database"]@{ shape: cylinder }');
    expect(mermaidString).toContain('E["Cloud"]@{ shape: cloud }');
    expect(mermaidString).toContain(
      'F["Manual Input"]@{ shape: manual-input }',
    );
    expect(mermaidString).toContain(
      'G["Multi Process"]@{ shape: multi-process }',
    );
    expect(mermaidString).toContain("A --> | Go | B");
    expect(mermaidString).toContain("B ==> | Check | C");
    expect(mermaidString).toContain("C -.-> | Save | D");
    expect(mermaidString).toContain("C o--o | Sync | E");
    expect(mermaidString).toContain("E x--x | Stop | F");
    expect(mermaidString).toContain("F <--> | Exchange | G");
  });

  it("should handle labels with parentheses and special characters", () => {
    const data = {
      orientation: "TB",
      nodes: [
        {
          id: "FMM",
          label: 'Fast "Multipole" Method (FMM)',
          shape: "round",
        },
      ],
      links: [],
    };

    const result = convertJsonToMermaid(data);
    // Should quote and escape internal quotes
    expect(result).toContain('FMM("Fast \\"Multipole\\" Method (FMM)")');
  });

  it("should sanitize reserved word IDs", () => {
    const data = {
      orientation: "TD",
      nodes: [
        { id: "end", label: "End Node", shape: "round" },
        { id: "start", label: "Start Node", shape: "round" },
      ],
      links: [
        { sourceId: "start", targetId: "end", style: "-->", label: "Finish" },
      ],
    };

    const result = convertJsonToMermaid(data);

    expect(result).toContain('id_end("End Node")'); // Node def
    expect(result).toContain("start --> | Finish | id_end"); // Link def
  });
});
