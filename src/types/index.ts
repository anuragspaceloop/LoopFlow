export type AgentStatus = "draft" | "testing" | "live";

export type ActionChip = {
  id: string;
  label: string;
  needsIntegration: boolean;
  enabled: boolean;
  connected?: boolean;
};

export type WorkflowNode = {
  id: string;
  label: string;
  description: string;
  // grid coords: col (0..n), row (0..n)
  col: number;
  row: number;
  kind?: "start" | "end" | "step";
  toolBadge?: number;
};
export type WorkflowEdge = { from: string; to: string; label?: string };
export type WorkflowGraph = { nodes: WorkflowNode[]; edges: WorkflowEdge[] };

export type Agent = {
  id: string;
  name: string;
  avatar?: string;
  template?: string;
  persona: string;
  knowledge: string;
  actions: ActionChip[];
  voice: string;
  languages: string[];
  guardrails: string[];
  llm: string;
  stt: string;
  direction: "inbound" | "outbound";
  files: Array<{ name: string; size: number }>;
  tts: string;
  status: AgentStatus;
  createdAt: number;
  lastTested?: number;
  callsToday?: number;
  history: Array<{ ts: number; summary: string; before: string; after: string; newGuardrail?: string }>;
  workflow?: WorkflowGraph;
};

export type Template = {
  id: string;
  name: string;
  avatar?: string;
  outcome: string;
  persona: string;
  knowledge: string;
  suggestedActions: string[];
  integrations: number;
  source?: "ElevenLabs" | "Prodloop" | "Community";
  industry?: string;
  useCase?: string;
  accent: string;
  workflow?: WorkflowGraph;
};
