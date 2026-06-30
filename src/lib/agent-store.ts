// Agent storage + templates (localStorage, client-only)
export * from "@/types";
import type { Agent, Template, ActionChip, WorkflowGraph, WorkflowNode } from "@/types";

export const TEMPLATES: Template[] = [
  {
    id: "support",
    name: "SaaS Customer Support",
    avatar: "/t1.webp",
    outcome: "Troubleshoot software issues and field billing inquiries for SaaS clients",
    persona:
      "You are a highly technical and empathetic SaaS support agent. Verify the user's workspace ID and email before discussing billing. Guide them step-by-step through technical troubleshooting.",
    knowledge:
      "Refund window: 14 days.\nSupported integrations: Salesforce, Slack, Zapier.\nCommon issues: SSO login failure, webhook delivery delays.\nEscalate: Security vulnerabilities or Enterprise SLA breaches.",
    suggestedActions: ["Look up workspace", "Reset SSO token", "Escalate to Tier 2"],
    integrations: 3,
    source: "Prodloop",
    industry: "SaaS",
    useCase: "Support",
    accent: "sky",
  },
  {
    id: "car-dealership",
    name: "Auto Dealership Sales",
    avatar: "/t2.webp",
    outcome: "Pre-qualifies car buyers, discusses inventory, and schedules test drives",
    persona:
      "You are a professional automotive sales assistant. Ask about the customer's preferred make, model, and budget. If they have a trade-in, ask for the year and mileage. Encourage them to book a test drive.",
    knowledge:
      "Current inventory: Sedans, SUVs, EVs.\nFinancing: Starting at 4.9% APR for qualified buyers.\nTrade-in policy: Accept vehicles under 100k miles.\nTest drive hours: Mon-Sat 9am-6pm.",
    suggestedActions: ["Check inventory", "Estimate trade-in value", "Schedule test drive"],
    integrations: 2,
    source: "Prodloop",
    industry: "Automotive",
    useCase: "Sales",
    accent: "orange",
  },
  {
    id: "logistics-dispatch",
    name: "Courier Dispatch Agent",
    avatar: "/t3.webp",
    outcome: "Coordinates parcel transfers with bike couriers and handles delivery status queries",
    persona:
      "You are a fast-paced logistics dispatcher. Speak clearly and concisely. Ask the rider for their Courier ID and current location. Provide them with the nearest parcel pickup hub and drop-off coordinates.",
    knowledge:
      "Zones: Downtown, Northside, West End.\nParcel limits: Max 15kg for bike couriers.\nRate: $5 base + $2/km.\nEmergency: If a rider is injured or bike breaks down, dispatch a backup van immediately.",
    suggestedActions: ["Assign parcel route", "Check rider location", "Dispatch backup van"],
    integrations: 2,
    source: "Prodloop",
    industry: "Logistics",
    useCase: "Operations",
    accent: "emerald",
  },
  {
    id: "taxi-booking",
    name: "Taxi Dispatch & Booking",
    avatar: "/t4.webp",
    outcome: "Books taxi rides, estimates fares, and updates customers on driver ETA",
    persona:
      "You are a polite and efficient taxi booking agent. Collect the pickup address, destination, and number of passengers. Provide a fare estimate and the driver's ETA.",
    knowledge:
      "Service areas: City limits and Airport.\nFares: $3 base + $1.50/mile. Airport flat rate: $45.\nVehicle types: Standard (4 pax), XL (6 pax), Luxury.\nWait time: Typically 5-10 minutes.",
    suggestedActions: ["Book a ride", "Estimate fare", "Check driver ETA"],
    integrations: 2,
    source: "Community",
    industry: "Transportation",
    useCase: "Booking",
    accent: "violet",
  },
  {
    id: "lead-qualifier",
    name: "B2B Lead Qualifier",
    avatar: "/t5.webp",
    outcome: "Qualifies inbound B2B leads from web forms, assesses budget and fit",
    persona:
      "You are a sharp inbound sales rep. Be curious, not pushy. Ask 2–3 qualifying questions (company size, current tool, timeline) before suggesting a demo. Book the demo with the right account executive.",
    knowledge:
      "Plans: Starter, Team, Enterprise.\nEnterprise threshold: 200+ seats or $10k+ ACV.\nDemo length: 30 minutes.\nAEs: Mia (SMB), Theo (Mid-market), Priya (Enterprise).",
    suggestedActions: ["Book a demo", "Transfer to an AE"],
    integrations: 2,
    source: "Prodloop",
    industry: "SaaS",
    useCase: "Sales",
    accent: "emerald",
  },
  {
    id: "renewal",
    name: "SaaS Renewal Agent",
    avatar: "/t6.webp",
    outcome: "Outbound CS agent that proactively drives renewals and surfaces expansion",
    persona:
      "You are a friendly customer success rep. Confirm health, ask about goals, surface relevant new features, and book a renewal review when the customer is open.",
    knowledge:
      "Renewal window: 60 days before contract end.\nExpansion plays: seats, premium plan, add-ons.\nEscalate price negotiations to the AE.",
    suggestedActions: ["Book renewal review", "Send a recap email"],
    integrations: 2,
    source: "Prodloop",
    industry: "SaaS",
    useCase: "Customer Success",
    accent: "violet",
  },
];

export const VOICES = [
  { id: "priya", name: "Priya", desc: "Warm, conversational, Indian English" },
  { id: "aarav", name: "Aarav", desc: "Clear, professional, Indian English / Hindi" },
  { id: "karan", name: "Karan", desc: "Smooth, natural, Indian English / Hinglish" },
  { id: "ava", name: "Ava", desc: "Warm, conversational, US English" },
  { id: "noor", name: "Noor", desc: "Calm, measured, neutral English" },
  { id: "sofia", name: "Sofia", desc: "Editorial, soft European English" },
];

export const LLMS = [
  { id: "gpt-5-fast", name: "GPT-5 Fast", desc: "Best for low-latency calls" },
  { id: "claude-sonnet", name: "Claude Sonnet", desc: "Strong reasoning, slightly slower" },
  { id: "gemini-flash", name: "Gemini Flash", desc: "Cheap, multilingual" },
];

export const STTS = [
  { id: "phone-tuned", name: "Phone-tuned", desc: "Best for telephony audio" },
  { id: "deepgram-nova", name: "Deepgram Nova", desc: "Fastest WER on noisy lines" },
  { id: "whisper-large", name: "Whisper Large", desc: "Best accuracy, higher latency" },
];

export const LANGUAGES = [
  "English",
  "Hindi",
  "Hinglish",
  "Bengali",
  "Marathi",
  "Telugu",
  "Tamil",
  "Gujarati",
  "Urdu",
  "Kannada",
  "Odia",
  "Malayalam",
  "Punjabi",
];

const STORAGE_KEY = "prodloop.agents.v2";

function read(): Agent[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function write(agents: Agent[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(agents));
  window.dispatchEvent(new Event("prodloop:agents"));
}

export function listAgents(): Agent[] {
  return read().sort((a, b) => b.createdAt - a.createdAt);
}

export function getAgent(id: string): Agent | undefined {
  return read().find((a) => a.id === id);
}

export function detectActions(text: string): ActionChip[] {
  const lib: Array<{ match: RegExp; label: string; needs: boolean }> = [
    { match: /\b(look ?up|check|order status)\b/i, label: "Look up an order", needs: true },
    { match: /\b(transfer|route|hand[- ]?off|escalat)/i, label: "Transfer to a department", needs: false },
    { match: /\b(book|schedul|appointment|demo|callback|reservation)/i, label: "Book an appointment", needs: true },
    { match: /\b(confirm(ation)? text|sms|text message|email)\b/i, label: "Send a confirmation", needs: true },
    { match: /\b(reset|password)\b/i, label: "Reset a password", needs: true },
    { match: /\b(refund|charge)\b/i, label: "Look up a refund", needs: true },
    { match: /\b(verify|identity|name and order|name and account)\b/i, label: "Verify caller identity", needs: false },
  ];
  const seen = new Set<string>();
  const out: ActionChip[] = [];
  for (const item of lib) {
    if (item.match.test(text) && !seen.has(item.label)) {
      seen.add(item.label);
      out.push({
        id: item.label.toLowerCase().replace(/\s+/g, "-"),
        label: item.label,
        needsIntegration: item.needs,
        enabled: true,
        connected: !item.needs,
      });
    }
  }
  return out;
}

export function draftGuardrails(persona: string, knowledge: string): string[] {
  const out: string[] = [
    "Never claim to be a human if asked directly.",
    "Never share personal data about other callers.",
  ];
  const blob = (persona + " " + knowledge).toLowerCase();
  if (/account|order|billing|refund/.test(blob)) {
    out.push("Verify the caller's identity before discussing account details.");
  }
  if (/medical|health|legal|financial/.test(blob)) {
    out.push("Do not give medical, legal, or financial advice — refer to a qualified human.");
  }
  if (/refund|cancel/.test(blob)) {
    out.push("Confirm policies from the knowledge base before promising a refund.");
  }
  if (/escalat|transfer|hand[- ]?off/.test(blob)) {
    out.push("Hand off to a human teammate when the caller asks or you are uncertain.");
  }
  return out;
}

export function createAgent(input: {
  name?: string;
  template?: string;
  persona: string;
  knowledge: string;
  voice: string;
  languages: string[];
  llm?: string;
  stt?: string;
  tts?: string;
  direction?: "inbound" | "outbound";
  files?: Array<{ name: string; size: number }>;
  actions?: ActionChip[];
}): Agent {
  const actions = input.actions ?? detectActions(input.persona + " " + input.knowledge);
  const guardrails = draftGuardrails(input.persona, input.knowledge);
  const agent: Agent = {
    id: typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    name: input.name?.trim() || "Untitled agent",
    avatar: input.template ? TEMPLATES.find((t) => t.id === input.template)?.avatar : undefined,
    template: input.template,
    persona: input.persona,
    knowledge: input.knowledge,
    actions,
    voice: input.voice,
    languages: input.languages,
    guardrails,
    llm: input.llm || "gpt-5-fast",
    stt: input.stt || "phone-tuned",
    tts: input.tts || input.voice,
    direction: input.direction ?? "inbound",
    files: input.files ?? [],
    status: "draft",
    createdAt: Date.now(),
    callsToday: 0,
    history: [],
    workflow: input.template
      ? TEMPLATES.find((t) => t.id === input.template)?.workflow ?? defaultWorkflow(input.persona)
      : defaultWorkflow(input.persona),
  };
  const all = read();
  all.push(agent);
  write(all);
  return agent;
}

export function defaultWorkflow(persona: string): WorkflowGraph {
  const hasBranch = /verify|account|billing|technical|troubleshoot|escalat/i.test(persona);
  if (hasBranch) {
    return {
      nodes: [
        { id: "start", label: "Start", description: "", col: 1, row: 0, kind: "start" },
        { id: "identify", label: "Identify Issue", description: "Open warmly. Ask what the caller needs.", col: 1, row: 1 },
        { id: "tech", label: "Troubleshoot", description: "Methodical troubleshooting. Propose ONE concrete first step.", col: 0, row: 2 },
        { id: "acct", label: "Account & Billing", description: "Verify identity BEFORE sharing any account detail.", col: 2, row: 2 },
        { id: "resolve", label: "Resolve or Escalate", description: "If resolved, confirm. Otherwise, hand off cleanly.", col: 1, row: 3, toolBadge: 2 },
        { id: "end", label: "End", description: "", col: 1, row: 4, kind: "end" },
      ],
      edges: [
        { from: "start", to: "identify" },
        { from: "identify", to: "tech", label: "The caller has a technical issue" },
        { from: "identify", to: "acct", label: "The caller has an account access need" },
        { from: "tech", to: "resolve" },
        { from: "acct", to: "resolve" },
        { from: "resolve", to: "end" },
      ],
    };
  }
  return {
    nodes: [
      { id: "start", label: "Start", description: "", col: 1, row: 0, kind: "start" },
      { id: "greet", label: "Greet & Listen", description: "Warm opening. Capture intent.", col: 1, row: 1 },
      { id: "act", label: "Take Action", description: "Use tools or knowledge to help.", col: 1, row: 2, toolBadge: 1 },
      { id: "wrap", label: "Wrap Up", description: "Recap and confirm next steps.", col: 1, row: 3 },
      { id: "end", label: "End", description: "", col: 1, row: 4, kind: "end" },
    ],
    edges: [
      { from: "start", to: "greet" },
      { from: "greet", to: "act" },
      { from: "act", to: "wrap" },
      { from: "wrap", to: "end" },
    ],
  };
}

export function updateAgent(id: string, patch: Partial<Agent>) {
  const all = read();
  const i = all.findIndex((a) => a.id === id);
  if (i === -1) return;
  all[i] = { ...all[i], ...patch };
  write(all);
}

export function appendToPersona(id: string, addition: string) {
  const a = getAgent(id);
  if (!a) return;
  updateAgent(id, { persona: (a.persona + "\n\n" + addition).trim() });
}

export function appendToKnowledge(id: string, addition: string) {
  const a = getAgent(id);
  if (!a) return;
  updateAgent(id, { knowledge: (a.knowledge + "\n" + addition).trim() });
}

export function deleteAgent(id: string) {
  write(read().filter((a) => a.id !== id));
}

export function applyPromptFix(
  id: string,
  fix: { summary: string; before: string; after: string; newGuardrail?: string },
) {
  const a = getAgent(id);
  if (!a) return;
  const guardrails = fix.newGuardrail
    ? [...a.guardrails, fix.newGuardrail]
    : a.guardrails;
  updateAgent(id, {
    guardrails,
    history: [{ ts: Date.now(), ...fix }, ...a.history],
  });
}

export function undoLastFix(id: string) {
  const a = getAgent(id);
  if (!a || a.history.length === 0) return;
  const [last, ...rest] = a.history;
  const guardrails = last.newGuardrail
    ? a.guardrails.filter((g) => g !== last.newGuardrail)
    : a.guardrails;
  updateAgent(id, { history: rest, guardrails });
}
