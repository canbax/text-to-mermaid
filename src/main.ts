import { textToMermaid } from "./index.ts";

const inputText = document.getElementById("inputText") as HTMLTextAreaElement;
const useAiFallback = document.getElementById(
  "useAiFallback",
) as HTMLInputElement;
const baseUrlInput = document.getElementById("baseUrl") as HTMLInputElement;
const apiKeyInput = document.getElementById("apiKey") as HTMLInputElement;
const convertBtn = document.getElementById("convertBtn") as HTMLButtonElement;
const outputCode = document.getElementById("outputCode") as HTMLPreElement;
const mermaidPreview = document.getElementById(
  "mermaidPreview",
) as HTMLDivElement;

const presetSelect = document.getElementById(
  "presetSelect",
) as HTMLSelectElement;

// Helper to update UI state
function updateUiState() {
  const isAi = useAiFallback.checked;
  baseUrlInput.disabled = !isAi;
  apiKeyInput.disabled = !isAi;
  if (!isAi) {
    baseUrlInput.parentElement!.style.opacity = "0.5";
  } else {
    baseUrlInput.parentElement!.style.opacity = "1";
  }
}

useAiFallback.addEventListener("change", updateUiState);

// Presets
presetSelect.addEventListener("change", () => {
  const value = presetSelect.value;
  if (value === "local") {
    useAiFallback.checked = true;
    baseUrlInput.value = "http://localhost:8080";
    apiKeyInput.value = "";
  } else if (value === "cloud") {
    useAiFallback.checked = true;
    baseUrlInput.value = "";
    apiKeyInput.value = "";
  } else if (value === "rules") {
    useAiFallback.checked = false;
  }
  updateUiState();
});

// Convert
convertBtn.addEventListener("click", async () => {
  const text = inputText.value;
  if (!text.trim()) {
    alert("Please enter some text");
    return;
  }

  outputCode.textContent = "Generating...";
  mermaidPreview.innerHTML = "Generating...";

  try {
    const aiConfig = {
      baseUrl: baseUrlInput.value.trim() || undefined,
      apiKey: apiKeyInput.value.trim() || undefined,
    };

    const result = await textToMermaid(text, {
      useAI: useAiFallback.checked,
      aiConfig: useAiFallback.checked ? aiConfig : undefined,
    });

    if (result) {
      outputCode.textContent = result;
      // Render Mermaid
      // We use the window.mermaid object loaded in index.html
      const mermaid = (window as any).mermaid;
      if (mermaid) {
        try {
          const { svg } = await mermaid.render(
            "mermaid-graph-" + Date.now(),
            result,
          );
          mermaidPreview.innerHTML = svg;
        } catch (e) {
          mermaidPreview.innerHTML = `<span style="color:red">Mermaid Render Error: ${(e as Error).message}</span>`;
          console.error(e);
        }
      } else {
        mermaidPreview.innerHTML = "Mermaid library not loaded.";
      }
    } else {
      outputCode.textContent = "No result generated (null returned).";
      mermaidPreview.innerHTML = "No result.";
    }
  } catch (err) {
    console.error(err);
    outputCode.textContent = `Error: ${(err as Error).message}`;
    mermaidPreview.innerHTML = "Error occurred.";
  }
});

// Initialize UI
updateUiState();
