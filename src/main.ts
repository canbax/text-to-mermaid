import { textToMermaid } from "./index.ts";

const app = document.querySelector<HTMLDivElement>("#app")!;

async function renderMermaid(input: string) {
  const result = await textToMermaid(input, {
    useAiFallback: true,
    aiConfig: { baseUrl: "http://localhost:8080" },
  });
  const div = document.createElement("div");
  div.innerHTML = `
    <div>
      <h3>Input: "${input}"</h3>
      <h3>Output:</h3>
      <pre class="mermaid">${result}</pre>
    </div>
    <hr/>
  `;
  app.appendChild(div);
}

await renderMermaid("User clicks Button");
await renderMermaid(
  "The fast multipole method (FMM) is a numerical technique that was developed to speed up the calculation of long-ranged forces in the n-body problem",
);
