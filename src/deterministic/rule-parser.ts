import nlp from "compromise";

export class DeterministicParser {
  parse(text: string): string | null {
    const doc = nlp(text);

    // Verb Pivot Strategy
    // 1. Find the first main verb
    // 2. Everything before is Subject
    // 3. Everything after is Object
    const firstVerb = doc.verbs().first();

    if (firstVerb.found) {
      const subject = doc
        .splitBefore(firstVerb)
        .first()
        .text()
        .trim()
        .replace("(", "")
        .replace(")", "")
        .replace("[", "")
        .replace("]", "");
      const object = doc
        .splitAfter(firstVerb)
        .last()
        .text()
        .trim()
        .replace("(", "")
        .replace(")", "")
        .replace("[", "")
        .replace("]", "");
      const verb = firstVerb.text().trim();

      if (subject && verb && object) {
        return `graph LR; sub[${subject}] -->|${verb}| obj[${object}]`;
      }
    }

    return null;
  }
}
