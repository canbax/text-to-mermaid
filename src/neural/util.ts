import { Type, type Schema } from "@google/genai";

// Schema to enforce returning a valid mermaid flowchart syntax
export const flowchartSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    orientation: {
      type: Type.STRING,
      enum: ["TB", "TD", "BT", "RL", "LR"],
      description:
        "The orientation of the flowchart (e.g., Top-Bottom, Left-Right).",
    },
    nodes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: {
            type: Type.STRING,
            description: "Unique alphanumeric identifier for the node.",
          },
          label: { type: Type.STRING, description: "Text label for the node." },
          shape: {
            type: Type.STRING,
            enum: [
              "square",
              "round",
              "rhombus", // Classic shapes
              // New shapes and aliases
              "bang",
              "notch-rect",
              "card",
              "notched-rectangle",
              "cloud",
              "hourglass",
              "collate",
              "bolt",
              "com-link",
              "lightning-bolt",
              "brace",
              "brace-l",
              "comment",
              "brace-r",
              "braces",
              "lean-r",
              "in-out",
              "lean-right",
              "lean-l",
              "lean-left",
              "out-in",
              "cyl",
              "cylinder",
              "database",
              "db",
              "diam",
              "decision",
              "diamond",
              "question",
              "delay",
              "half-rounded-rectangle",
              "h-cyl",
              "das",
              "horizontal-cylinder",
              "lin-cyl",
              "disk",
              "lined-cylinder",
              "curv-trap",
              "curved-trapezoid",
              "display",
              "div-rect",
              "div-proc",
              "divided-process",
              "divided-rectangle",
              "doc",
              "document",
              "rounded",
              "event",
              "tri",
              "extract",
              "triangle",
              "fork",
              "join",
              "win-pane",
              "internal-storage",
              "window-pane",
              "f-circ",
              "filled-circle",
              "junction",
              "lin-doc",
              "lined-document",
              "lin-rect",
              "lin-proc",
              "lined-process",
              "lined-rectangle",
              "shaded-process",
              "notch-pent",
              "loop-limit",
              "notched-pentagon",
              "flip-tri",
              "flipped-triangle",
              "manual-file",
              "sl-rect",
              "manual-input",
              "sloped-rectangle",
              "trap-t",
              "inv-trapezoid",
              "manual",
              "trapezoid-top",
              "docs",
              "documents",
              "st-doc",
              "stacked-document",
              "st-rect",
              "processes",
              "procs",
              "stacked-rectangle",
              "odd",
              "flag",
              "paper-tape",
              "hex",
              "hexagon",
              "prepare",
              "trap-b",
              "priority",
              "trapezoid",
              "trapezoid-bottom",
              "rect",
              "proc",
              "process",
              "rectangle",
              "circle",
              "circ",
              "sm-circ",
              "small-circle",
              "start",
              "dbl-circ",
              "double-circle",
              "fr-circ",
              "framed-circle",
              "stop",
              "bow-rect",
              "bow-tie-rectangle",
              "stored-data",
              "fr-rect",
              "framed-rectangle",
              "subproc",
              "subprocess",
              "subroutine",
              "cross-circ",
              "crossed-circle",
              "summary",
              "tag-doc",
              "tagged-document",
              "tag-rect",
              "tag-proc",
              "tagged-process",
              "tagged-rectangle",
              "stadium",
              "pill",
              "terminal",
              "text",
            ],
            description:
              "The shape of the node. square=[], round=(), rhombus={}. other shapes use @{ shape: name } syntax.",
          },
        },
        required: ["id", "label", "shape"],
      },
    },
    links: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sourceId: {
            type: Type.STRING,
            description: "ID of the starting node.",
          },
          targetId: {
            type: Type.STRING,
            description: "ID of the ending node.",
          },
          style: {
            type: Type.STRING,
            enum: ["-->", "---", "-.->", "==>", "o--o", "x--x", "<-->"],
            description: "The style of the arrow/link.",
          },
          label: {
            type: Type.STRING,
            description: "Optional text on the link.",
          },
        },
        required: ["sourceId", "targetId", "style"],
      },
    },
  },
  required: ["orientation", "nodes", "links"],
};

export function convertJsonToMermaid(data: any): string {
  let output = `graph ${data.orientation}\n`;

  // Helper to format shapes based on your grammar: node_shape ::= ("[" label "]") | ("(" label ")") | ("{" label "}")
  const formatNode = (node: any) => {
    switch (node.shape) {
      case "round":
        return `${node.id}(${node.label})`;
      case "rhombus":
        return `${node.id}{${node.label}}`;
      case "square":
        return `${node.id}[${node.label}]`;
      default:
        // New shapes syntax: id["label"]@{ shape: shapeName }
        return `${node.id}["${node.label}"]@{ shape: ${node.shape} }`;
    }
  };

  // Generate node definitions
  data.nodes.forEach((node: any) => {
    output += `    ${formatNode(node)}\n`;
  });

  // Generate link definitions
  // Grammar: link_def ::= node_id space link_style space node_id (space "|" label "|")?
  data.links.forEach((link: any) => {
    const linkLabel = `${link.label ? "| " + link.label + " |" : ""}`;
    const line = `${link.sourceId} ${link.style} ${linkLabel} ${link.targetId}\n`;
    output += line;
  });

  return output;
}
