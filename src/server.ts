import express from "express";
import dotenv from "dotenv";

dotenv.config();

import { Mastra } from "@mastra/core";
import debateAgent from "./mastraAdapter";
import { runDebateAgent } from "./agent/debateAgent";



const app = express();
app.use(express.json());

// Register Mastra instance manually
const mastra = new Mastra({
  agents: [debateAgent],
});

// Manual route that proxies to the Mastra agent
app.post("/api/mastra/debate", async (req, res) => {
  try {
    const { message } = req.body;
    const result = await debateAgent.generate({
      input: message.content,
    });
    res.json({ text: result.text });
  } catch (err: any) {
    console.error("Mastra agent error:", err);
    res.status(500).json({ error: "Agent error", details: err.message });
  }
});

// Your existing /api/debate route still works
app.post("/api/debate", async (req, res) => {
  try {
    const userMessage = req.body.message || "";
    const response = await runDebateAgent(userMessage);
    res.json(response);
  } catch (error: any) {
    console.error("Error handling debate:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// Health check
app.get("/", (_req, res) => {
  res.send("🔥 Debate Partner Agent is live (Express + Mastra)");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
