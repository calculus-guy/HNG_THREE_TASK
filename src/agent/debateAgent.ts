import { Mastra } from "@mastra/core";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { DEBATE_SYSTEM_PROMPT } from "./prompts";
import { createInitialState, addMessageToHistory } from "../utils/conversation";
import { summarizeDebate } from "../utils/summarizer";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });
// Maintain state (memory)
const debateState = createInitialState();

// Define the Mastra agent
export const debateAgent = new Mastra({
  id: "debate_partner",
  name: "Debate Partner Agent",
  description: "AI Debate partner that argues the opposite side and summarizes discussions.",
});

// Attach onMessage manually (Mastra doesn't automatically attach custom methods)
debateAgent.onMessage = async (input: { message: { content: string } }) => {
  const userInput = input.message?.content ?? "";
  addMessageToHistory(debateState, "user", userInput);

  // Start topic if not active
  if (!debateState.active) {
    debateState.active = true;
    debateState.topic = userInput;
    debateState.userStance = userInput;
  }

  // End or summarize
  if (/summarize|end/i.test(userInput)) {
    const summary = summarizeDebate(debateState);
    debateState.active = false;
    debateState.round = 0;
    debateState.history = [];
    return { text: summary };
  }

  debateState.round++;

  const prompt = `
${DEBATE_SYSTEM_PROMPT}
User's message: ${userInput}
Round: ${debateState.round}
`;

  const result = await model.generateContent(prompt);
  const reply = result.response.text();

  addMessageToHistory(debateState, "agent", reply);

  return { text: reply };
};

export async function runDebateAgent(message: string) {
  return await debateAgent.onMessage({ message: { content: message } });
}