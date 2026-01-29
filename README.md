# text-to-mermaid: Natural Language to Mermaid.js Conversion Engine

> **Philosophy**: "What You See Is What You Code" (WYSIWYC)

## Executive Summary

This project implements a **Hybrid Architecture** designed to act as a strict "Conversion Engine". It solves the core challenge of translating natural language (NL) into structured [Mermaid.js](https://mermaid.js.org/) diagramming code.

Unlike purely generative approaches that might hallucinate nodes to "complete the thought", this engine focuses on strict translation of the input text.

## How It Works

The system offers two modes of operation, selectable via configuration:

### 1. Deterministic Core (Rule-Based)

_Default Mode_

For simple, linear flows, we use [Compromise](https://github.com/spencermountain/compromise), a lightweight NLP library.

- **Logic**: It identifies key entities (nouns) in the text and links them sequentially.
- **Mechanism**: `Input Text -> Extract Nouns -> Linear Graph (Node A -> Node B -> ...)`
- **Pros**:
  - Extremely fast (<15ms).
  - 100% Offline.
  - Zero hallucination (only visualizes what's explicitly named).

### 2. Neural Mode (generative AI)

_Enable with `useAI: true`_

For complex logic, decision trees, or non-linear relationships, the system utilizes Large Language Models (LLMs).

- **Supported Backends**:
  - **Google Gemini**: Via `@google/genai` SDK.
  - **Local LLMs**: Via `llama-server` (or any OpenAI-compatible endpoint).
- **Constrained Decoding**: Instead of free-text generation, we enforce a strict **JSON Schema**. The LLM MUST output a structured JSON object representing the node/edge constraints, which is then deterministically compiled to Mermaid syntax. This guarantees valid syntax.

## Usage

```typescript
import { textToMermaid } from "text-to-mermaid";

// 1. Deterministic (Fast, Linear)
const diagram = await textToMermaid("The server connects to the database.");
// Output: graph TB ... server --> database

// 2. Neural (Complex, AI-Powered)
const complexDiagram = await textToMermaid(
  "If user is admin, go to dashboard, else go to login.",
  {
    useAI: true,
    aiConfig: {
      apiKey: process.env.GEMINI_API_KEY, // or via env var
    },
  },
);
```

## Running Local LLMs (llama.cpp)

You can use a local LLM instead of cloud APIs for privacy and zero cost.

1. Install `llama.cpp`: https://github.com/ggml-org/llama.cpp
2. Download a model (e.g., `gemma-2-2b-it.Q4_K_M.gguf`).
3. Start the server:
   ```bash
   llama-server -hf ggml-org/gemma-3-1b-it-GGUF
   ```
4. Use in your code:
   ```typescript
   await textToMermaid("...", {
     useAI: true,
     aiConfig: {
       baseUrl: "http://localhost:8080", // Points to local server
     },
   });
   ```

## Development

# Install dependencies

`npm install`

# start development server

`npm run dev`

# Run tests

`npm test`

# Build library

`npm run build`
