import { textToMermaid } from "./index.ts";

const input = "User clicks Button";

textToMermaid(input, { useAiFallback: true }).then((result) => {
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div>
      <h3>Input: "${input}"</h3>
      <h3>Output:</h3>
      <pre class="mermaid">${result}</pre>
    </div>
  `;
});
