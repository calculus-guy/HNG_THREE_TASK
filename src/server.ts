import express from "express";
import dotenv from "dotenv";

dotenv.config();

import { Mastra } from "@mastra/core/mastra";
import debateAgent from "./mastraAdapter";
import { runDebateAgent } from "./agent/debateAgent";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());

const mastra = new Mastra({
  agents: { debateAgent },
});

// for mastra tests
app.post("/api/mastra/debate", async (req, res) => {
  try {
    const { conversationId, topic, userMessage, message } = req.body;
    const userText = (userMessage ?? message?.content ?? message ?? req.body?.input ?? "").toString();

    const prompt = `Topic: "${topic ?? "general"}"

User's argument: ${userText}

You are a debate partner agent. Your job is to challenge the user's opinions constructively.

Rules:
- Always take the OPPOSITE stance to the user's statement.
- Provide 2–3 counterarguments with reasoning.
- Keep tone respectful and logical.
- After 3 rounds or when the user says "summarize" or "end", summarize both sides clearly.
- Use bullet points for arguments.
- Be engaging and concise.

Example:
User: "I think remote work is better than office work"
You: "Interesting view! But I disagree because:
1. In-person collaboration builds trust
2. Office environments foster clearer communication
3. Physical workspaces separate work and personal life"`;
    
    // Call Mastra agent with a string prompt
    const result: any = await debateAgent.generate(prompt);
    
    // Extract the response text
    let replyText: string | null = null;
    if (typeof result === "string") {
      replyText = result;
    } else if (result?.text) {
      replyText = result.text;
    } else if (result?.content) {
      replyText = result.content;
    } else if (Array.isArray(result?.output) && result.output.length) {
      const out0 = result.output[0];
      if (out0?.content && Array.isArray(out0.content) && out0.content.length) {
        replyText = out0.content[0]?.text ?? JSON.stringify(out0.content[0]);
      } else {
        replyText = JSON.stringify(out0);
      }
    } else {
      replyText = JSON.stringify(result).slice(0, 200);
    }
    
    const responsePayload = {
      conversationId: conversationId ?? uuidv4(),
      reply: replyText ?? "No reply generated",
      turn: 1,
      summary: null,
      raw: result,
    };
    
    return res.json(responsePayload);
  } catch (err: any) {
    console.error("Debate Agent Error:", err);
    return res.status(500).json({ error: "Agent error", details: err?.message ?? String(err) });
  }
});


// for my postman tests
app.post("/api/debate", async (req, res) => {
  try {
    const userMessage = req.body.message || req.body.input || req.body;
    const response = await runDebateAgent(typeof userMessage === "string" ? userMessage : String(userMessage));
    res.json(response);
  } catch (error: any) {
    console.error("Error handling debate:", error);
    res.status(500).json({ error: "Internal server error", details: error?.message ?? error });
  }
});

app.get("/", (_req, res) => res.send("🔥 Debate Partner Agent is live (Mastra + Express)"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));