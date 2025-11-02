// src/mastraAdapter.ts
import { Agent } from "@mastra/core/agent";
import { runDebateAgent } from "./agent/debateAgent";

export const debateAgent = new Agent({
  name: "debate_partner", // name (optional id will be derived)
  instructions: `You are a debate partner. Always take the opposing view. Provide 2-3 counter-arguments and ask a follow-up question. Summarize after 3 rounds.`,
  model: "google/gemini-2.0-flash",
});

export default debateAgent;