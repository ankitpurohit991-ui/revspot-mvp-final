// Agent mock data — unified (voice + whatsapp)

export type AgentStatus = "active" | "draft" | "paused";
export type AgentChannel = "voice" | "whatsapp";
export type AgentTemplate = "qualifying" | "blank";

export interface AgentItem {
  id: string;
  name: string;
  channel: AgentChannel;
  template: AgentTemplate;
  languages: string[];
  status: AgentStatus;
  callsMade: number;
  qualificationRate: number;
  avgDuration: number;
  lastUsed: string;
  postCallSummary: string;
}

export const agentsList: AgentItem[] = [
  {
    id: "va-1",
    name: "Priya — Qualification Agent",
    channel: "voice",
    template: "qualifying",
    languages: ["English", "Hindi", "Kannada"],
    status: "active",
    callsMade: 1284,
    qualificationRate: 34.2,
    avgDuration: 3.1,
    lastUsed: "2 hours ago",
    postCallSummary: "Auto-push to CRM · 2 retries · Slack notifications",
  },
  {
    id: "va-2",
    name: "Arjun — Follow-up Agent",
    channel: "voice",
    template: "qualifying",
    languages: ["English", "Hindi"],
    status: "active",
    callsMade: 856,
    qualificationRate: 28.7,
    avgDuration: 2.4,
    lastUsed: "1 day ago",
    postCallSummary: "Auto-push to CRM · 3 retries · Email notifications",
  },
  {
    id: "va-3",
    name: "Neha — Survey Agent",
    channel: "voice",
    template: "blank",
    languages: ["English"],
    status: "draft",
    callsMade: 0,
    qualificationRate: 0,
    avgDuration: 0,
    lastUsed: "Never",
    postCallSummary: "No post-call actions configured",
  },
];

// Voices for Step 3
export const voiceOptions = [
  { id: "v-1", name: "Priya", gender: "Female", languages: ["EN", "HI", "KN"] },
  { id: "v-2", name: "Arjun", gender: "Male", languages: ["EN", "HI"] },
  { id: "v-3", name: "Meera", gender: "Female", languages: ["EN", "HI", "TA"] },
  { id: "v-4", name: "Raj", gender: "Male", languages: ["EN", "HI", "KN"] },
  { id: "v-5", name: "Ananya", gender: "Female", languages: ["EN", "HI", "MR"] },
  { id: "v-6", name: "Kiran", gender: "Male", languages: ["EN", "HI", "TE"] },
];

export const languageOptions = [
  "English", "Hindi", "Kannada", "Tamil", "Telugu", "Marathi", "Bengali",
];

export interface QualificationMetric {
  id: string;
  name: string;
  type: "yes_no" | "scale" | "text" | "number";
  condition: string;
  weight: "critical" | "high" | "medium" | "low";
}

export const defaultMetrics: QualificationMetric[] = [
  { id: "qm-1", name: "Budget fit", type: "yes_no", condition: "Budget ≥ ₹5 Cr", weight: "critical" },
  { id: "qm-2", name: "Timeline", type: "scale", condition: "Planning within 6 months (score 4+)", weight: "high" },
  { id: "qm-3", name: "Site visit intent", type: "yes_no", condition: "Willing to visit = Yes", weight: "high" },
  { id: "qm-4", name: "Decision maker", type: "yes_no", condition: "Is primary decision maker", weight: "medium" },
];

export const conversationSteps = [
  { id: "cs-1", step: 1, name: "Greeting", script: "Hello, this is [Agent Name] from Star Realtor. Am I speaking with [Lead Name]?" },
  { id: "cs-2", step: 2, name: "Interest confirmation", script: "I see you expressed interest in [Project]. Is this a good time for a quick chat?" },
  { id: "cs-3", step: 3, name: "Qualification questions", script: "Ask about: Budget range, Purchase timeline, Property type preference, Family size" },
  { id: "cs-4", step: 4, name: "Scoring", script: "Rate the lead based on qualification metrics" },
  { id: "cs-5", step: 5, name: "Next steps", script: "If qualified: offer site visit. If not qualified: thank them, note reason." },
  { id: "cs-6", step: 6, name: "Closing", script: "Summarize what was discussed, confirm next steps, thank them." },
];

export const defaultSystemPrompt = `You are a professional real estate qualification agent for Star Realtor. You call leads who have expressed interest in luxury properties in Bangalore. Be warm, professional, and consultative. Your goal is to understand the caller's budget, timeline, and property preferences. Never be pushy. If the lead is qualified, offer to schedule a site visit. If not, thank them politely and note the reason.`;

export const defaultFAQs = [
  { question: "What is the price range?", answer: "4 & 5 BHK villas starting from ₹6.5 Crore" },
  { question: "Is it RERA registered?", answer: "Yes, fully RERA registered with clear title" },
  { question: "Where is the project located?", answer: "IVC Road, near Kempegowda International Airport, North Bangalore" },
];

// Agent detail data
export const agentDetail = {
  ...agentsList[0],
  goal: "Qualify inbound leads for luxury real estate properties in Whitefield, Bangalore. Determine budget, timeline, configuration preference, and schedule site visits for qualified leads.",
  systemPrompt: defaultSystemPrompt,
  knowledgeBases: ["Prestige_Lakeside_Brochure.pdf", "Assetz_Mizumi_Pricing.pdf"],
  metrics: defaultMetrics,
  voice: voiceOptions[0],
  selectedLanguages: ["English", "Hindi", "Kannada"],
  tone: "conversational" as const,
  flow: conversationSteps,
  postCall: {
    pushToCRM: true,
    retryUnanswered: true,
    maxRetries: 2,
    retryAfter: "4 hours",
    sendFollowUpVoicemail: true,
    notifyOnQualified: true,
    notifyChannels: ["slack"],
    callingHoursStart: "10:00 AM",
    callingHoursEnd: "7:00 PM",
    activeDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
  stats: {
    totalCalls: 1284,
    connected: 1012,
    qualified: 346,
    notQualified: 520,
    callback: 146,
    avgDuration: 3.1,
    qualificationRate: 34.2,
    connectionRate: 78.8,
  },
  recentCalls: [
    { id: "rc-1", name: "V***** R*****", phone: "98XXX XX342", outcome: "qualified" as const, duration: 4.2, date: "2026-03-22T14:32:00", qualification: "Intent Qualified" },
    { id: "rc-2", name: "S***** M*****", phone: "90XXX XX891", outcome: "not_qualified" as const, duration: 2.1, date: "2026-03-22T14:18:00", qualification: "Not Qualified" },
    { id: "rc-3", name: "A***** K*****", phone: "87XXX XX156", outcome: "qualified" as const, duration: 3.5, date: "2026-03-22T13:55:00", qualification: "Intent Qualified" },
    { id: "rc-4", name: "P***** J*****", phone: "99XXX XX723", outcome: "callback" as const, duration: 0.8, date: "2026-03-22T13:40:00", qualification: "Pending" },
    { id: "rc-5", name: "R***** B*****", phone: "80XXX XX445", outcome: "no_answer" as const, duration: 0, date: "2026-03-22T13:22:00", qualification: "—" },
    { id: "rc-6", name: "N***** D*****", phone: "91XXX XX867", outcome: "voicemail" as const, duration: 0.5, date: "2026-03-22T12:50:00", qualification: "—" },
  ],
};
