import { DebateState } from "./conversation.js";

export const summarizeDebate = (state: DebateState) => {
  const userArgs = state.history
    .filter(h => h.role === "user")
    .map((h, i) => ` ${h.content}`)
    .join("\n");

  const agentArgs = state.history
    .filter(h => h.role === "agent")
    .map((h, i) => ` ${h.content}`)
    .join("\n");

  return `
 Debate Summary: ${state.topic}
Your Arguments (You):
${userArgs}

My Arguments (Agent):
${agentArgs}

Key Insight: Both positions have valid points. The truth often lies in balance. 
`;
};