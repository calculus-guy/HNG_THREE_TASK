import { Mastra } from "@mastra/core";
import { runDebateCore } from "./debateCore";

export const debateAgent = new Mastra({
  id: "debate_partner",
  name: "Debate Partner Agent",
  description: "AI Debate partner that argues the opposite side and summarizes discussions.",
});

debateAgent.onMessage = async (input: { message: { content: string } }) => {
  const userInput = input.message?.content ?? "";
  // delegate to the core function
  const result = await runDebateCore(userInput);
  return result;
};

export async function runDebateAgent(message: string) {
  return await debateAgent.onMessage({ message: { content: message } });
}