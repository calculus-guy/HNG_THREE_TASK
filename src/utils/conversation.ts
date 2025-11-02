export interface DebateState {
  active: boolean;
  topic: string;
  userStance: string;
  agentStance: string;
  round: number;
  history: { role: "user" | "agent"; content: string }[];
}

export const createInitialState = (): DebateState => ({
  active: false,
  topic: "",
  userStance: "",
  agentStance: "",
  round: 0,
  history: []
});

export const addMessageToHistory = (
  state: DebateState,
  role: "user" | "agent",
  content: string
) => {
  state.history.push({ role, content });
};
