import { puterAI, puterAIJSON } from "./puter";

/**
 * Streaming AI call — calls onStream(text) incrementally
 * Now powered directly by Puter.js!
 */
export async function callAI(systemPrompt, userPrompt, onStream) {
  try {
    return await puterAI(systemPrompt, userPrompt, onStream);
  } catch (e) {
    console.error("AI Generation Error", e);
    throw new Error("Generation failed via Puter.js. Please try again.");
  }
}

/**
 * Non-streaming AI call that returns parsed JSON
 * Now powered directly by Puter.js!
 */
export async function callAIJSON(systemPrompt, userPrompt) {
  try {
    return await puterAIJSON(systemPrompt, userPrompt);
  } catch (e) {
    console.error("AI JSON Generation Error", e);
    throw new Error("JSON Generation failed via Puter.js. Please try again.");
  }
}
