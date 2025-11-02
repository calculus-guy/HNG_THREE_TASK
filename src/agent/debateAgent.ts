import { GoogleGenerativeAI } from "@google/generative-ai";
import { DEBATE_SYSTEM_PROMPT } from "./prompts";
import { createInitialState, addMessageToHistory } from "../utils/conversation";
import { summarizeDebate } from "../utils/summarizer";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

const debateState = createInitialState();

export async function runDebateCore(userInput: string) {
  addMessageToHistory(debateState, "user", userInput);

  if (!debateState.active) {
    debateState.active = true;
    debateState.topic = userInput;
    debateState.userStance = userInput;
  }

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
}

export async function runDebateAgent(message: string) {
  return await runDebateCore(message);
}