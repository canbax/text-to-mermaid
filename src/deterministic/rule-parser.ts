import nlp from "compromise";

export class DeterministicParser {
  private cleanText(str: string): string {
    return str
      .trim()
      .replace(/["[\]()]/g, "") // remove quotes and brackets
      .replace(/\s+/g, " "); // collapse whitespace
  }

  private processSingleNoun(text: string, doc: any, nouns: any[]): string {
    let graph = "graph TB\n";
    const verbs = doc.verbs().json();
    const nounObj = nouns[0];
    const nounText = nounObj.text;

    // If we have a verb before the noun, treat verb as start node
    if (verbs.length > 0) {
      // Find the first verb that appears before the noun
      // Note: compromise output order usually matches text order, but checking indices is safer if available.
      // For simplicity, we'll take the first verb found.
      const verbObj = verbs[0];

      // Simple heuristic: if verb is before noun in the text
      const nounIndex = text.indexOf(nounText);
      const verbIndex = text.indexOf(verbObj.text);

      if (verbIndex !== -1 && nounIndex !== -1 && verbIndex < nounIndex) {
        const verbLabel = this.cleanText(verbObj.text);
        const nounLabel = this.cleanText(nounText)
          .replace(/^(The|the|A|a|An|an)\s+/i, "")
          .trim();

        // Extract text between verb and noun for edge label
        let edgeLabel = text
          .substring(verbIndex + verbObj.text.length, nounIndex)
          .trim();
        if (!edgeLabel) edgeLabel = "to"; // fallback

        graph += `    node_0((" ${verbLabel} "))\n`;
        graph += `    node_1["${nounLabel}"]\n`;
        graph += `    node_0 --> |"${edgeLabel}"| node_1\n`;
        return graph.trim();
      }
    }

    // Fallback: Just the noun node
    const nounLabel = this.cleanText(nounText)
      .replace(/^(The|the|A|a|An|an)\s+/i, "")
      .trim();
    graph += `    node_0((" ${nounLabel} "))\n`;
    return graph.trim();
  }

  private processMultipleNouns(text: string, nouns: any[]): string {
    let graph = "graph TB\n";
    let remainingText = text;
    let previousNodeId: string | null = null;

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
      const nodeLabel = this.cleanText(nounText)
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
        let edgeLabel = this.cleanText(preText);
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

  parse(text: string): string | null {
    const doc = nlp(text);
    const nouns = doc.nouns().json();

    if (nouns.length === 0) {
      return null;
    }

    // Handle single noun case (e.g. "Welcome to the era of Gemini 3.")
    if (nouns.length === 1) {
      return this.processSingleNoun(text, doc, nouns);
    }

    return this.processMultipleNouns(text, nouns);
  }
}
