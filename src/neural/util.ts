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
            enum: ["square", "round", "rhombus"],
            description:
              "The shape of the node. square=[], round=(), rhombus={}",
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
            enum: ["-->", "---", "-.->", "==>"],
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

export function convertJsonToGrammar(data: any) {
  let output = `graph ${data.orientation}\n`;

  // Helper to format shapes based on your grammar: node_shape ::= ("[" label "]") | ("(" label ")") | ("{" label "}")
  const formatNode = (node: any) => {
    switch (node.shape) {
      case "round":
        return `${node.id}(${node.label})`;
      case "rhombus":
        return `${node.id}{${node.label}}`;
      case "square":
      default:
        return `${node.id}[${node.label}]`;
    }
  };

  // Generate node definitions
  data.nodes.forEach((node: any) => {
    output += `    ${formatNode(node)}\n`;
  });

  // Generate link definitions
  // Grammar: link_def ::= node_id space link_style space node_id (space "|" label "|")?
  data.links.forEach((link: any) => {
    let line = `    ${link.sourceId} ${link.style} ${link.targetId}`;
    if (link.label) {
      line += ` |${link.label}|`;
    }
    output += line + "\n";
  });

  return output;
}
