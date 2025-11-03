import express from "express";
import dotenv from "dotenv";

dotenv.config();

import { Mastra } from "@mastra/core/mastra";
import debateAgent from "./mastraAdapter";
import { runDebateAgent } from "./agent/debateAgent";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());

const conversations = new Map<string, Array<{ role: string; content: string }>>();

const mastra = new Mastra({
  agents: { debateAgent },
});

// for mastra tests
app.post("/api/mastra/debate", async (req, res) => {
  try {
    const { conversationId, topic, userMessage, message } = req.body;
    const userText = (userMessage ?? message?.content ?? message ?? req.body?.input ?? "").toString();
    const convId = conversationId ?? uuidv4();
    
    // Get or create conversation history
    if (!conversations.has(convId)) {
      conversations.set(convId, []);
    }
    const history = conversations.get(convId)!;
    
    // Check if user wants to summarize
    const shouldSummarize = /\b(summarize|end|summary)\b/i.test(userText);
    const roundCount = Math.floor(history.filter(m => m.role === "user").length);
    
    // Add user message to history
    history.push({ role: "user", content: userText });
    
    // Build the prompt with full conversation context
    let prompt = `Topic: "${topic ?? "general"}"\n\n`;
    
    // Include conversation history
    if (history.length > 1) {
      prompt += "Conversation so far:\n";
      history.slice(0, -1).forEach((msg, idx) => {
        const label = msg.role === "user" ? "User" : "You (AI)";
        prompt += `${label}: ${msg.content}\n\n`;
      });
    }
    
    prompt += `Current user message: ${userText}\n\n`;
    
    // Add instructions based on context
    if (shouldSummarize || roundCount >= 3) {
      prompt += `The user has requested a summary or you've completed 3+ rounds. Please provide a clear, balanced summary of:
1. The user's main arguments and positions
2. Your counterarguments and positions
3. Key points of disagreement
4. Any common ground found

Format the summary with clear sections and bullet points.`;
    } else {
      prompt += `You are a debate partner agent. Your job is to challenge the user's opinions constructively.

Rules:
- Always take the OPPOSITE stance to the user's statement.
- Provide 2–3 counterarguments with reasoning.
- Keep tone respectful and logical.
- Use bullet points for arguments.
- Be engaging and concise.

Example format:
"Interesting view! But I disagree because:
1. [First counterargument with reasoning]
2. [Second counterargument with reasoning]
3. [Third counterargument with reasoning]

What are your thoughts on [follow-up question]?"`;
    }
    
    // Call Mastra agent
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
    
    // Add AI response to history
    history.push({ role: "assistant", content: replyText ?? "No reply generated" });
    
    // Clear conversation if summarized
    const isSummary = shouldSummarize || roundCount >= 3;
    if (isSummary) {
      conversations.delete(convId); // Clear history after summary
    }
    
    const responsePayload = {
      conversationId: convId,
      reply: replyText ?? "No reply generated",
      turn: roundCount + 1,
      summary: isSummary ? replyText : null,
      raw: result,
    };
    
    return res.json(responsePayload);
  } catch (err: any) {
    console.error("Debate Agent Error:", err);
    return res.status(500).json({ error: "Agent error", details: err?.message ?? String(err) });
  }
});

// Add this new endpoint specifically for Telex A2A protocol
app.post("/a2a/agent/debateAgent", async (req, res) => {
  try {
    console.log("=== TELEX A2A REQUEST ===");
    console.log(JSON.stringify(req.body, null, 2));
    
    const { message, conversationId, metadata } = req.body;
    const userText = message?.content || "";
    const convId = conversationId || uuidv4();
    
    if (!userText) {
      return res.status(400).json({
        error: "No message content provided"
      });
    }
    
    // Get or create conversation history
    if (!conversations.has(convId)) {
      conversations.set(convId, []);
    }
    const history = conversations.get(convId)!;
    
    // Check if user wants to summarize
    const shouldSummarize = /\b(summarize|end|summary)\b/i.test(userText);
    const roundCount = history.filter(m => m.role === "user").length;
    
    // Add user message to history
    history.push({ role: "user", content: userText });
    
    // Build the prompt
    let prompt = "";
    
    if (history.length > 1) {
      prompt += "Conversation so far:\n";
      history.slice(0, -1).forEach((msg) => {
        const label = msg.role === "user" ? "User" : "You";
        prompt += `${label}: ${msg.content}\n\n`;
      });
    }
    
    prompt += `Current user message: ${userText}\n\n`;
    
    if (shouldSummarize && roundCount >= 1) {
      prompt += `Provide a clear summary of the debate with:
1. User's main arguments
2. Your counterarguments
3. Key disagreements
4. Any common ground`;
    } else {
      prompt += `You are a debate partner. Take the OPPOSITE stance.

Rules:
- Disagree respectfully
- Provide 2-3 numbered counterarguments with reasoning
- Be logical and engaging
- End with a follow-up question`;
    }
    
    // Generate response
    const result: any = await debateAgent.generate(prompt);
    
    // Extract reply
    let replyText = "";
    if (typeof result === "string") {
      replyText = result;
    } else if (result?.text) {
      replyText = result.text;
    } else if (result?.content) {
      replyText = result.content;
    } else if (Array.isArray(result?.output) && result.output.length) {
      const out0 = result.output[0];
      if (out0?.content && Array.isArray(out0.content) && out0.content.length) {
        replyText = out0.content[0]?.text || "";
      }
    }
    
    // Add AI response to history
    history.push({ role: "assistant", content: replyText || "No reply generated" });
    
    // Clear conversation if summarized
    if (shouldSummarize && roundCount >= 1) {
      conversations.delete(convId);
    }
    
    // CRITICAL: Return ONLY message object (strict A2A format)
    const response = {
      message: {
        role: "assistant",
        content: replyText || "I'm ready to debate! Share your opinion."
      }
      // DO NOT include conversationId or metadata here
    };
    
    console.log("=== A2A RESPONSE ===");
    console.log(JSON.stringify(response, null, 2));
    
    // CRITICAL: Return status 200
    return res.status(200).json(response);
    
  } catch (err: any) {
    console.error("A2A Endpoint Error:", err);
    return res.status(500).json({ 
      error: "Internal server error",
      message: err?.message 
    });
  }
});

// endpoint to clear a conversation
app.delete("/api/mastra/debate/:conversationId", (req, res) => {
  const { conversationId } = req.params;
  conversations.delete(conversationId);
  res.json({ message: "Conversation cleared" });
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