import { textToMermaid } from "./index";

async function runDemo() {
  console.log("--- Demo Start ---");

  // Case 1: Simple SVO (Deterministic)
  const input1 = "User clicks button";
  console.log(`\nInput 1: "${input1}"`);
  const result1 = await textToMermaid(input1, { useAI: false });
  console.log("Result 1:", result1);

  // Case 2: Complex (Neural)
  const input2 = "The system authorizes the payment and updates the ledger";
  console.log(`\nInput 2: "${input2}"`);
  const result2 = await textToMermaid(input2, { useAI: true });
  console.log("Result 2:", result2);

  console.log("\n--- Demo End ---");
}

runDemo();
