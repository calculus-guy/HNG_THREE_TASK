import { Agent } from "@mastra/core/agent";
import { runDebateAgent } from "./agent/debateAgent";

export const debateAgent = new Agent({
  id: "debate_partner",
  name: "Debate Partner Agent",
  description: "AI Debate partner that argues the opposite side and summarizes discussions.",
  model: "google/gemini-2.0-flash",

  instructions: `You are a debate partner. Always take the opposing view. Provide 2-3 counter-arguments and ask a follow-up question. Summarize after 3 user+agent rounds.`,

  async run({ input }) {
    const incoming = (typeof input === "string") ? input : input?.message?.content ?? String(input);
    const result = await runDebateAgent(incoming);
    return { text: result.text };
  },
});

export default debateAgent;