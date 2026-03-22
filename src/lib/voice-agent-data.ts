// Voice agent mock data

export type AgentStatus = "active" | "inactive" | "training";

export interface VoiceAgentItem {
  id: string;
  name: string;
  industry: string;
  languages: string[];
  status: AgentStatus;
  callsMade: number;
  qualificationRate: number;
  avgDuration: number;
  lastUsed: string;
  template: string;
}

export const voiceAgentsList: VoiceAgentItem[] = [
  {
    id: "va-1",
    name: "Priya — Qualification Agent",
    industry: "Real Estate",
    languages: ["English", "Hindi"],
    status: "active",
    callsMade: 1284,
    qualificationRate: 34.2,
    avgDuration: 3.1,
    lastUsed: "2 hours ago",
    template: "Qualifying Agent",
  },
  {
    id: "va-2",
    name: "Arjun — Follow-up Agent",
    industry: "Real Estate",
    languages: ["English", "Kannada"],
    status: "active",
    callsMade: 856,
    qualificationRate: 28.7,
    avgDuration: 2.4,
    lastUsed: "1 day ago",
    template: "Qualifying Agent",
  },
  {
    id: "va-3",
    name: "Neha — Survey Agent",
    industry: "Real Estate",
    languages: ["English"],
    status: "inactive",
    callsMade: 312,
    qualificationRate: 0,
    avgDuration: 4.2,
    lastUsed: "2 weeks ago",
    template: "Blank Agent",
  },
];

// Industries for Step 3
export const industries = [
  { id: "real-estate", name: "Real Estate", icon: "Building2" },
  { id: "healthcare", name: "Healthcare", icon: "Heart" },
  { id: "finance", name: "Finance", icon: "Landmark" },
  { id: "education", name: "Education", icon: "GraduationCap" },
  { id: "hospitality", name: "Hospitality", icon: "Hotel" },
  { id: "automotive", name: "Automotive", icon: "Car" },
  { id: "technology", name: "Technology", icon: "Cpu" },
  { id: "professional", name: "Professional Services", icon: "Briefcase" },
  { id: "food", name: "Food & Beverage", icon: "UtensilsCrossed" },
  { id: "manufacturing", name: "Manufacturing", icon: "Factory" },
  { id: "fitness", name: "Fitness", icon: "Dumbbell" },
  { id: "legal", name: "Legal", icon: "Scale" },
  { id: "nonprofit", name: "Non-Profit", icon: "HandHeart" },
  { id: "media", name: "Media", icon: "Tv" },
  { id: "retail", name: "Retail", icon: "ShoppingBag" },
  { id: "government", name: "Government", icon: "Building" },
  { id: "other", name: "Other", icon: "MoreHorizontal" },
];

// Voices for Step 4
export const voiceOptions = [
  { id: "v-1", name: "Priya", gender: "Female", accent: "Indian English" },
  { id: "v-2", name: "Arjun", gender: "Male", accent: "Indian English" },
  { id: "v-3", name: "Neha", gender: "Female", accent: "Hindi" },
  { id: "v-4", name: "Raj", gender: "Male", accent: "Hindi" },
  { id: "v-5", name: "Ananya", gender: "Female", accent: "Neutral English" },
  { id: "v-6", name: "Vikram", gender: "Male", accent: "Neutral English" },
];

export const languageOptions = [
  "English", "Hindi", "Kannada", "Tamil", "Telugu", "Marathi", "Bengali", "Gujarati",
];

// Default qualification metrics for Real Estate
export interface QualificationMetric {
  id: string;
  name: string;
  type: "yes_no" | "scale" | "text" | "number";
  condition: string;
  weight: number;
}

export const defaultMetrics: QualificationMetric[] = [
  { id: "qm-1", name: "Budget in range", type: "yes_no", condition: "Yes", weight: 30 },
  { id: "qm-2", name: "Purchase timeline", type: "scale", condition: "≤ 6 months", weight: 25 },
  { id: "qm-3", name: "Decision maker", type: "yes_no", condition: "Yes", weight: 25 },
  { id: "qm-4", name: "Location preference match", type: "yes_no", condition: "Yes", weight: 20 },
];

// Conversation flow steps
export const conversationFlow = [
  { step: 1, name: "Greeting", description: "Introduce yourself and confirm identity" },
  { step: 2, name: "Qualification", description: "Ask qualifying questions about budget, timeline, preferences" },
  { step: 3, name: "Scoring", description: "Evaluate responses against qualification metrics" },
  { step: 4, name: "Next Steps", description: "Propose site visit or follow-up based on score" },
  { step: 5, name: "Closing", description: "Confirm next steps, thank and disconnect" },
];

// Default system prompt
export const defaultSystemPrompt = `You are Priya, an AI real estate assistant for Star Realtor. Your goal is to qualify leads for luxury properties in Bangalore.

GUIDELINES:
- Be warm, professional, and conversational
- Confirm the lead's identity before proceeding
- Ask about budget, timeline, configuration preference, and location
- Determine if they are the decision maker
- If qualified, propose a site visit and confirm a time slot
- If not qualified, thank them politely and end the call
- Never be pushy or aggressive
- Keep the conversation under 4 minutes

QUALIFICATION CRITERIA:
- Budget: ₹1Cr or above
- Timeline: Within 12 months
- Must be decision maker or spouse of decision maker
- Location: Bangalore or willing to relocate`;

// Agent detail data
export const agentDetail = {
  ...voiceAgentsList[0],
  goal: "Qualify inbound leads for luxury real estate properties in Whitefield, Bangalore. Determine budget, timeline, configuration preference, and schedule site visits for qualified leads.",
  systemPrompt: defaultSystemPrompt,
  knowledgeBases: ["Prestige_Lakeside_Brochure.pdf", "Assetz_Mizumi_Pricing.pdf"],
  metrics: defaultMetrics,
  voice: voiceOptions[0],
  selectedLanguages: ["English", "Hindi"],
  flow: conversationFlow,
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
    { id: "rc-1", name: "V***** R*****", phone: "98XXX XX342", outcome: "qualified", duration: 4.2, date: "2026-03-22T14:32:00" },
    { id: "rc-2", name: "S***** M*****", phone: "90XXX XX891", outcome: "not_qualified", duration: 2.1, date: "2026-03-22T14:18:00" },
    { id: "rc-3", name: "A***** K*****", phone: "87XXX XX156", outcome: "qualified", duration: 3.5, date: "2026-03-22T13:55:00" },
    { id: "rc-4", name: "P***** J*****", phone: "99XXX XX723", outcome: "callback", duration: 0.8, date: "2026-03-22T13:40:00" },
    { id: "rc-5", name: "R***** B*****", phone: "80XXX XX445", outcome: "no_answer", duration: 0, date: "2026-03-22T13:22:00" },
    { id: "rc-6", name: "N***** D*****", phone: "91XXX XX867", outcome: "qualified", duration: 5.1, date: "2026-03-22T12:50:00" },
  ],
};
