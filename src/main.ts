import { textToMermaid } from "./index.ts";

const input =
  "The fast multipole method (FMM) is a numerical technique that was developed to speed up the calculation of long-ranged forces in the n-body problem";

textToMermaid(input, { useAiFallback: true }).then((result) => {
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div>
      <h3>Input: "${input}"</h3>
      <h3>Output:</h3>
      <pre class="mermaid">${result}</pre>
    </div>
  `;
});
