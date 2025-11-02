import express from "express";
import dotenv from "dotenv";


dotenv.config();
import { runDebateAgent } from "./agent/debateAgent";

const app = express();
app.use(express.json());

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
