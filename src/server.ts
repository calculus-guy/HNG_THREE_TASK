import express from "express";
import dotenv from "dotenv";

dotenv.config();

import { Mastra } from "@mastra/core/mastra";
import debateAgent from "./mastraAdapter";
import { runDebateAgent } from "./agent/debateAgent";

const app = express();
app.use(express.json());

const mastra = new Mastra({
  agents: { debateAgent },
});

app.post("/api/mastra/debate", async (req, res) => {
  try {
    const { message } = req.body;
    const input = message?.content ?? req.body?.input ?? req.body?.text ?? req.body;
    const response = await debateAgent.generate(typeof input === "string" ? input : input);
    return res.json({ text: response.text, raw: response });
  } catch (err: any) {
    console.error("Mastra agent error:", err);
    return res.status(500).json({ error: "Agent error", details: err?.message ?? err });
  }
});

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