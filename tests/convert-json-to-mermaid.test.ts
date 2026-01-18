import { describe, it, expect } from "vitest";
import { convertJsonToMermaid } from "../src/neural/util";

describe("convertJsonToMermaid", () => {
  it("should be a singleton", () => {
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
    const expected = `graph TD
    A(Start)
    B[Process]
    C{Decision}
    D["Database"]@{ shape: cylinder }
    E["Cloud"]@{ shape: cloud }
    F["Manual Input"]@{ shape: manual-input }
    G["Multi Process"]@{ shape: multi-process }
    A --> B |Go|
    B ==> C |Check|
    C -.-> D |Save|
    C o--o E |Sync|
    E x--x F |Stop|
    F <--> G |Exchange|
`;
    expect(mermaidString).toBe(expected);
  });
});
