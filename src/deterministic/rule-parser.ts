import nlp from "compromise";

export class DeterministicParser {
  parse(text: string): string | null {
    const doc = nlp(text);

    // Basic SVO detection
    // We look for a Noun phrase followed by a Verb phrase followed by a Noun phrase
    // [#Noun+] captures one or more nouns (compound nouns)
    // [#Verb] captures the verb
    // The second [#Noun+] captures the object
    const match = doc.match("[<subject>#Noun+] [<verb>#Verb] [<object>.+]");

    if (match.found) {
      const subject = (match.groups("subject") as any).text().trim();
      const verb = (match.groups("verb") as any).text().trim();
      const object = (match.groups("object") as any).text().trim();

      if (subject && verb && object) {
        // Construct Mermaid string
        return `graph LR; ${subject} -->|${verb}| ${object}`;
      }
    }

    return null;
  }
}
