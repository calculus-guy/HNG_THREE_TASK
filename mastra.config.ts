import { defineConfig } from "mastra";

export default defineConfig({
  project: {
    name: "debate-partner-agent",
    description: "AI Debate Agent integrated with Telex.im via Mastra",
  },
  agents: ["./src/agent/debateAgent.ts"],
});