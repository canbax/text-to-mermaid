import { textToMermaid, ParseStrategy } from "./index";

async function runDemo() {
  console.log("--- Demo Start ---");

  // Case 1: Simple SVO (Deterministic)
  const input1 = "User clicks button";
  console.log(`\nInput 1: "${input1}"`);
  const result1 = await textToMermaid(input1, {
    strategy: ParseStrategy.Deterministic,
  });
  console.log("Result 1:", result1);

  // Case 2: Complex (Neural)
  const input2 = "The system authorizes the payment and updates the ledger";
  console.log(`\nInput 2: "${input2}"`);
  const result2 = await textToMermaid(input2, {
    strategy: ParseStrategy.Gemini, // Defaulting to Gemini for "true" equivalent, or check if it needs config
    aiConfig: { apiKey: process.env.GEMINI_API_KEY },
  });
  console.log("Result 2:", result2);

  console.log("\n--- Demo End ---");
}

runDemo();
