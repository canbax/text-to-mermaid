import nlp from "compromise";

export class DeterministicParser {
  parse(text: string): string | null {
    const doc = nlp(text);
    const nouns = doc.nouns().json();

    if (nouns.length < 2) {
      return null;
    }

    let graph = "graph TB\n";
    let previousNodeId: string | null = null;

    // Helper to clean text
    const cleanText = (str: string) => {
      return str
        .trim()
        .replace(/["[\]()]/g, "") // remove quotes and brackets
        .replace(/\s+/g, " "); // collapse whitespace
    };

    let remainingText = text;

    for (let i = 0; i < nouns.length; i++) {
      const nounObj = nouns[i];
      const nounText = nounObj.text; // The text of the noun phrase

      // Find this noun in the remaining text
      const nounIndex = remainingText.indexOf(nounText);
      if (nounIndex === -1) {
        // Should not happen if compromise found it, unless normalization mismatch.
        // Fallback: Skip this noun
        continue;
      }

      // Text BEFORE this noun is the incoming edge label (if we have a previous node)
      const preText = remainingText.substring(0, nounIndex).trim();

      // Current Node ID
      const nodeId = `node_${i}`;
      const nodeLabel = cleanText(nounText)
        .replace(/^(The|the|A|a|An|an)\s+/i, "") // Remove leading articles from label
        .trim();

      // Add Node Definition
      // Visual style: First node stadium, others rect (as per plan)
      const shapeStart = i === 0 ? "((" : "[";
      const shapeEnd = i === 0 ? "))" : "]";
      graph += `    ${nodeId}${shapeStart}"${nodeLabel}"${shapeEnd}\n`;

      // Add Edge from Previous Node
      if (previousNodeId) {
        // Clean edge label
        let edgeLabel = cleanText(preText);
        edgeLabel = edgeLabel.replace(/^(that|which|who)\s+/i, "");

        if (!edgeLabel) {
          edgeLabel = "related to"; // Fallback for implicit connection
        }

        // Limit edge label length?
        if (edgeLabel.length > 50) {
          edgeLabel = edgeLabel.substring(0, 47) + "…";
        }

        graph += `    ${previousNodeId} --> |"${edgeLabel}"| ${nodeId}\n`;
      }

      remainingText = remainingText.substring(nounIndex + nounText.length);
      previousNodeId = nodeId;
    }

    return graph.trim();
  }
}
