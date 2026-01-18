import { GoogleGenAI, Type, type Schema } from "@google/genai";

// 1. Define the Schema
// Instead of an EBNF string, we define a JSON schema that represents the *structure* of your grammar.
// This allows Gemini to use "Constrained Decoding" to guarantee the structure exists.
const flowchartSchema: Schema = {
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

function convertJsonToGrammar(data: any) {
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

function getEnv(key: string): string | undefined {
  // Check for Vite's import.meta.env (Browser/Vite)
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env[`VITE_${key}`];
  }
  // Check for Node.js process.env (Node)
  if (typeof process !== "undefined" && process.env) {
    return process.env[key];
  }
  return undefined;
}

export async function genaiParse(
  text: string,
  apiKey?: string,
): Promise<string | undefined> {
  const key = apiKey || getEnv("GEMINI_API_KEY");
  if (!key) {
    console.warn("GEMINI_API_KEY not found in environment variables.");
  }
  const client = new GoogleGenAI({ apiKey: key || "" });

  const prompt = `Convert this text to a mermaid.js syntax: ${text}`;

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash", // Ensure you use a model that supports strict JSON mode
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: flowchartSchema,
    },
  });

  return convertJsonToGrammar(JSON.parse(response?.text));
}
