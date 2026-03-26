// Campaign mock data — realistic Bangalore luxury real estate

// ── Campaign List ───────────────────────────────────────────

export type CampaignStatus = "active" | "paused" | "completed";
export type CampaignType = "Performance" | "Brand";
export type CampaignHealth = "on-track" | "needs-attention" | "underperforming";

export interface CampaignListItem {
  id: string;
  name: string;
  type: CampaignType;
  client: string; // internal — maps to project name in UI
  projectId: string | null; // null = unassigned
  status: CampaignStatus;
  spend: number;
  leads: number;
  verifiedLeads: number;
  qualifiedLeads: number;
  cpl: number;
  health: CampaignHealth;
  createdAt: string;
}

export const campaignsList: CampaignListItem[] = [
  {
    id: "camp-1", name: "Prestige Lakeside Habitat — Lead Gen", type: "Performance",
    client: "Whitefield Luxury Villas", projectId: "proj-1",
    status: "active", spend: 185000, leads: 214, verifiedLeads: 38, qualifiedLeads: 18, cpl: 864, health: "on-track", createdAt: "2025-12-15",
  },
  {
    id: "camp-2", name: "Brigade Utopia — Retargeting", type: "Performance",
    client: "Brigade Utopia Pre-launch", projectId: "proj-3",
    status: "active", spend: 142000, leads: 156, verifiedLeads: 22, qualifiedLeads: 11, cpl: 910, health: "needs-attention", createdAt: "2026-01-08",
  },
  {
    id: "camp-3", name: "Sobha Windsor — Lookalike", type: "Performance",
    client: "Sobha Windsor", projectId: null,
    status: "active", spend: 95000, leads: 128, verifiedLeads: 24, qualifiedLeads: 14, cpl: 742, health: "on-track", createdAt: "2026-01-22",
  },
  {
    id: "camp-4", name: "Godrej Splendour — Lead Gen", type: "Performance",
    client: "Godrej Splendour", projectId: null,
    status: "active", spend: 110000, leads: 142, verifiedLeads: 18, qualifiedLeads: 8, cpl: 775, health: "underperforming", createdAt: "2026-02-03",
  },
  {
    id: "camp-5", name: "Embassy Lake Terraces — HNI", type: "Performance",
    client: "Embassy Lake Terraces", projectId: null,
    status: "active", spend: 88000, leads: 98, verifiedLeads: 16, qualifiedLeads: 10, cpl: 898, health: "on-track", createdAt: "2026-02-14",
  },
  {
    id: "camp-6", name: "Total Environment — Carousel", type: "Brand",
    client: "Total Environment", projectId: null,
    status: "paused", spend: 60000, leads: 107, verifiedLeads: 9, qualifiedLeads: 7, cpl: 561, health: "on-track", createdAt: "2026-01-05",
  },
  {
    id: "camp-7", name: "Assetz Mizumi PM R3 — Lead Gen", type: "Performance",
    client: "Assetz Mizumi Phase 3", projectId: "proj-2",
    status: "active", spend: 220000, leads: 186, verifiedLeads: 42, qualifiedLeads: 22, cpl: 1183, health: "on-track", createdAt: "2025-11-20",
  },
  {
    id: "camp-8", name: "Purva Atmosphere — Brand Awareness", type: "Brand",
    client: "Purva Atmosphere", projectId: null,
    status: "active", spend: 75000, leads: 92, verifiedLeads: 11, qualifiedLeads: 5, cpl: 815, health: "needs-attention", createdAt: "2026-02-28",
  },
  {
    id: "camp-9", name: "Birla Tisya — Lead Gen", type: "Performance",
    client: "Birla Tisya Full Funnel", projectId: "proj-4",
    status: "completed", spend: 310000, leads: 340, verifiedLeads: 58, qualifiedLeads: 29, cpl: 912, health: "on-track", createdAt: "2025-09-10",
  },
  {
    id: "camp-10", name: "Prestige City — Retargeting", type: "Performance",
    client: "Whitefield Luxury Villas", projectId: "proj-1",
    status: "paused", spend: 48000, leads: 64, verifiedLeads: 8, qualifiedLeads: 4, cpl: 750, health: "needs-attention", createdAt: "2026-01-30",
  },
];

// ── Campaign Detail (Assetz Mizumi PM R3) ───────────────────

export interface CampaignDetail {
  id: string;
  name: string;
  status: CampaignStatus;
  type: CampaignType;
  client: string;
  owner: string;
  platform: string;
  platformPageId: string;
  platformCampaignId: string;
  targetCPL: number;
  dailyBudget: number;
  createdAt: string;
}

export const campaignDetail: CampaignDetail = {
  id: "camp-7",
  name: "Assetz Mizumi PM R3",
  status: "active",
  type: "Performance",
  client: "Assetz Property",
  owner: "ankit@starealtor.in",
  platform: "Meta",
  platformPageId: "109284756301",
  platformCampaignId: "23851029384710",
  targetCPL: 1200,
  dailyBudget: 8000,
  createdAt: "2025-11-20",
};

// ── Leads Tab Data ──────────────────────────────────────────

export type LeadTemperature = "hot" | "warm" | "lukewarm" | "cold";
export type LeadQualification = "qualified" | "not_qualified" | "pending";
export type LeadStatusValue =
  | "intent_qualified"
  | "not_qualified"
  | "interested_not_ready"
  | "duplicate"
  | "invalid";
export type LeadStage =
  | "new"
  | "contacted"
  | "site_visit_scheduled"
  | "site_visit_done"
  | "negotiation"
  | "won"
  | "lost";
// Alias for backward compat with enquiries-data
export type LeadStatus = LeadStatusValue;
export type EnrichmentStatus = "enriched" | "not_enriched" | "failed";
export type CRMSyncStatus = "pushed" | "pending" | "failed" | "not_synced" | "na";

export interface CRMSyncInfo {
  status: CRMSyncStatus;
  pushedAt?: string;
  crmRecordId?: string;
  failReason?: string;
  syncHistory?: { date: string; action: string }[];
}

export interface CampaignLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  enrichmentStatus: EnrichmentStatus;
  aiQualification: LeadQualification;
  temperature: LeadTemperature;
  leadStatus: LeadStatusValue;
  leadStage: LeadStage;
  verified: boolean;
  sql: boolean;
  crmSync: CRMSyncInfo;
  campaign: string;
  adset: string;
  adName: string;
  formResponses: { question: string; answer: string }[];
}

export const campaignLeads: CampaignLead[] = [
  {
    id: "lead-101", name: "V***** R*****", phone: "98XXX XX342", email: "v*****@gmail.com",
    createdAt: "2026-03-20T14:32:00", updatedAt: "2026-03-20T15:10:00",
    enrichmentStatus: "enriched", aiQualification: "qualified",
    temperature: "warm", leadStatus: "intent_qualified", leadStage: "site_visit_done",
    verified: true, sql: true,
    crmSync: { status: "pushed", pushedAt: "2026-03-20T15:12:00", crmRecordId: "Contact #4521",
      syncHistory: [
        { date: "Mar 20, 3:12 PM", action: "Pushed to CRM (auto-sync)" },
        { date: "Mar 21, 10:34 AM", action: "Stage updated: Contacted → Site Visit Done (synced from CRM)" },
      ] },
    campaign: "Assetz Mizumi PM R3", adset: "Whitefield HNI — 30-45", adName: "Mizumi 3BHK Carousel v2",
    formResponses: [
      { question: "Budget range?", answer: "₹1.5Cr - ₹2Cr" },
      { question: "Configuration preference?", answer: "3 BHK" },
      { question: "Timeline to purchase?", answer: "Within 3 months" },
      { question: "Current location?", answer: "Whitefield" },
    ],
  },
  {
    id: "lead-102", name: "S***** M*****", phone: "90XXX XX891", email: "s*****@yahoo.com",
    createdAt: "2026-03-20T11:15:00", updatedAt: "2026-03-20T14:45:00",
    enrichmentStatus: "enriched", aiQualification: "pending",
    temperature: "lukewarm", leadStatus: "interested_not_ready", leadStage: "contacted",
    verified: false, sql: false,
    crmSync: { status: "pending" },
    campaign: "Assetz Mizumi PM R3", adset: "Sarjapur IT Corridor", adName: "Mizumi Lifestyle Video",
    formResponses: [
      { question: "Budget range?", answer: "₹1Cr - ₹1.5Cr" },
      { question: "Configuration preference?", answer: "2 BHK" },
      { question: "Timeline to purchase?", answer: "6-12 months" },
    ],
  },
  {
    id: "lead-103", name: "A***** K*****", phone: "87XXX XX156", email: "a*****@outlook.com",
    createdAt: "2026-03-19T18:22:00", updatedAt: "2026-03-20T09:30:00",
    enrichmentStatus: "enriched", aiQualification: "qualified",
    temperature: "warm", leadStatus: "intent_qualified", leadStage: "site_visit_scheduled",
    verified: true, sql: true,
    crmSync: { status: "pushed", pushedAt: "2026-03-19T18:30:00", crmRecordId: "Contact #4518",
      syncHistory: [
        { date: "Mar 19, 6:30 PM", action: "Pushed to CRM (auto-sync)" },
        { date: "Mar 20, 9:30 AM", action: "Stage updated: New → Site Visit Scheduled (synced from CRM)" },
      ] },
    campaign: "Assetz Mizumi PM R3", adset: "Whitefield HNI — 30-45", adName: "Mizumi Floor Plan Static",
    formResponses: [
      { question: "Budget range?", answer: "₹2Cr - ₹2.5Cr" },
      { question: "Configuration preference?", answer: "3 BHK Premium" },
      { question: "Timeline to purchase?", answer: "Immediate" },
      { question: "Current location?", answer: "Indiranagar" },
    ],
  },
  {
    id: "lead-104", name: "P***** J*****", phone: "99XXX XX723", email: "p*****@gmail.com",
    createdAt: "2026-03-19T16:05:00", updatedAt: "2026-03-19T16:05:00",
    enrichmentStatus: "not_enriched", aiQualification: "not_qualified",
    temperature: "cold", leadStatus: "not_qualified", leadStage: "new",
    verified: false, sql: false,
    crmSync: { status: "not_synced" },
    campaign: "Assetz Mizumi PM R3", adset: "Broad Bangalore — 25-55", adName: "Mizumi 3BHK Carousel v2",
    formResponses: [
      { question: "Budget range?", answer: "Below ₹80L" },
      { question: "Configuration preference?", answer: "2 BHK" },
      { question: "Timeline to purchase?", answer: "Not sure" },
    ],
  },
  {
    id: "lead-105", name: "R***** B*****", phone: "80XXX XX445", email: "r*****@gmail.com",
    createdAt: "2026-03-19T10:48:00", updatedAt: "2026-03-20T11:20:00",
    enrichmentStatus: "enriched", aiQualification: "qualified",
    temperature: "warm", leadStatus: "intent_qualified", leadStage: "contacted",
    verified: true, sql: false,
    crmSync: { status: "pushed", pushedAt: "2026-03-19T11:00:00", crmRecordId: "Contact #4515",
      syncHistory: [{ date: "Mar 19, 11:00 AM", action: "Pushed to CRM (auto-sync)" }] },
    campaign: "Assetz Mizumi PM R3", adset: "Sarjapur IT Corridor", adName: "Mizumi Lifestyle Video",
    formResponses: [
      { question: "Budget range?", answer: "₹1.5Cr - ₹2Cr" },
      { question: "Configuration preference?", answer: "3 BHK" },
      { question: "Timeline to purchase?", answer: "3-6 months" },
      { question: "Current location?", answer: "Sarjapur Road" },
    ],
  },
  {
    id: "lead-106", name: "N***** D*****", phone: "91XXX XX867", email: "n*****@hotmail.com",
    createdAt: "2026-03-18T21:30:00", updatedAt: "2026-03-19T10:15:00",
    enrichmentStatus: "enriched", aiQualification: "not_qualified",
    temperature: "lukewarm", leadStatus: "not_qualified", leadStage: "contacted",
    verified: false, sql: false,
    crmSync: { status: "not_synced" },
    campaign: "Assetz Mizumi PM R3", adset: "Whitefield HNI — 30-45", adName: "Mizumi Amenities Carousel",
    formResponses: [
      { question: "Budget range?", answer: "₹1Cr - ₹1.5Cr" },
      { question: "Configuration preference?", answer: "2 BHK" },
      { question: "Timeline to purchase?", answer: ">12 months" },
    ],
  },
  {
    id: "lead-107", name: "M***** S*****", phone: "96XXX XX218", email: "m*****@gmail.com",
    createdAt: "2026-03-18T15:12:00", updatedAt: "2026-03-19T16:40:00",
    enrichmentStatus: "enriched", aiQualification: "qualified",
    temperature: "warm", leadStatus: "intent_qualified", leadStage: "negotiation",
    verified: true, sql: true,
    crmSync: { status: "pushed", pushedAt: "2026-03-18T15:20:00", crmRecordId: "Contact #4510",
      syncHistory: [
        { date: "Mar 18, 3:20 PM", action: "Pushed to CRM (auto-sync)" },
        { date: "Mar 19, 4:40 PM", action: "Stage updated: Contacted → Negotiation (synced from CRM)" },
      ] },
    campaign: "Assetz Mizumi PM R3", adset: "Whitefield HNI — 30-45", adName: "Mizumi 3BHK Carousel v2",
    formResponses: [
      { question: "Budget range?", answer: "₹2Cr+" },
      { question: "Configuration preference?", answer: "4 BHK" },
      { question: "Timeline to purchase?", answer: "Immediate" },
      { question: "Current location?", answer: "Koramangala" },
    ],
  },
  {
    id: "lead-108", name: "K***** G*****", phone: "88XXX XX534", email: "k*****@gmail.com",
    createdAt: "2026-03-18T09:45:00", updatedAt: "2026-03-18T09:45:00",
    enrichmentStatus: "not_enriched", aiQualification: "pending",
    temperature: "lukewarm", leadStatus: "interested_not_ready", leadStage: "new",
    verified: false, sql: false,
    crmSync: { status: "pending" },
    campaign: "Assetz Mizumi PM R3", adset: "Broad Bangalore — 25-55", adName: "Mizumi Floor Plan Static",
    formResponses: [
      { question: "Budget range?", answer: "₹1Cr - ₹1.5Cr" },
      { question: "Configuration preference?", answer: "3 BHK" },
    ],
  },
  {
    id: "lead-109", name: "D***** T*****", phone: "70XXX XX912", email: "d*****@gmail.com",
    createdAt: "2026-03-17T20:18:00", updatedAt: "2026-03-18T14:30:00",
    enrichmentStatus: "enriched", aiQualification: "qualified",
    temperature: "warm", leadStatus: "intent_qualified", leadStage: "site_visit_done",
    verified: true, sql: true,
    crmSync: { status: "pushed", pushedAt: "2026-03-17T20:25:00", crmRecordId: "Contact #4505",
      syncHistory: [
        { date: "Mar 17, 8:25 PM", action: "Pushed to CRM (auto-sync)" },
        { date: "Mar 18, 2:30 PM", action: "Stage updated: Contacted → Site Visit Done (synced from CRM)" },
      ] },
    campaign: "Assetz Mizumi PM R3", adset: "Sarjapur IT Corridor", adName: "Mizumi Amenities Carousel",
    formResponses: [
      { question: "Budget range?", answer: "₹1.5Cr - ₹2Cr" },
      { question: "Configuration preference?", answer: "3 BHK" },
      { question: "Timeline to purchase?", answer: "Within 3 months" },
      { question: "Current location?", answer: "HSR Layout" },
    ],
  },
  {
    id: "lead-110", name: "G***** P*****", phone: "95XXX XX671", email: "g*****@yahoo.com",
    createdAt: "2026-03-17T14:55:00", updatedAt: "2026-03-17T14:55:00",
    enrichmentStatus: "failed", aiQualification: "pending",
    temperature: "cold", leadStatus: "duplicate", leadStage: "new",
    verified: false, sql: false,
    crmSync: { status: "failed", failReason: "Duplicate phone number found in CRM" },
    campaign: "Assetz Mizumi PM R3", adset: "Broad Bangalore — 25-55", adName: "Mizumi Lifestyle Video",
    formResponses: [
      { question: "Budget range?", answer: "Not specified" },
      { question: "Configuration preference?", answer: "Any" },
    ],
  },
  {
    id: "lead-111", name: "T***** A*****", phone: "85XXX XX390", email: "t*****@gmail.com",
    createdAt: "2026-03-17T11:30:00", updatedAt: "2026-03-18T10:00:00",
    enrichmentStatus: "enriched", aiQualification: "qualified",
    temperature: "warm", leadStatus: "intent_qualified", leadStage: "won",
    verified: true, sql: true,
    crmSync: { status: "pushed", pushedAt: "2026-03-17T11:35:00", crmRecordId: "Contact #4500",
      syncHistory: [
        { date: "Mar 17, 11:35 AM", action: "Pushed to CRM (auto-sync)" },
        { date: "Mar 18, 10:00 AM", action: "Stage updated: Negotiation → Won (synced from CRM)" },
      ] },
    campaign: "Assetz Mizumi PM R3", adset: "Whitefield HNI — 30-45", adName: "Mizumi 3BHK Carousel v2",
    formResponses: [
      { question: "Budget range?", answer: "₹2Cr - ₹3Cr" },
      { question: "Configuration preference?", answer: "4 BHK Penthouse" },
      { question: "Timeline to purchase?", answer: "Immediate" },
      { question: "Current location?", answer: "MG Road" },
    ],
  },
  {
    id: "lead-112", name: "H***** V*****", phone: "93XXX XX148", email: "h*****@gmail.com",
    createdAt: "2026-03-16T19:42:00", updatedAt: "2026-03-17T09:15:00",
    enrichmentStatus: "enriched", aiQualification: "not_qualified",
    temperature: "cold", leadStatus: "invalid", leadStage: "lost",
    verified: false, sql: false,
    crmSync: { status: "not_synced" },
    campaign: "Assetz Mizumi PM R3", adset: "Broad Bangalore — 25-55", adName: "Mizumi Floor Plan Static",
    formResponses: [
      { question: "Budget range?", answer: "Below ₹70L" },
      { question: "Timeline to purchase?", answer: ">12 months" },
    ],
  },
];

// ── Analysis Tab Data ───────────────────────────────────────

export interface AnalysisMetric {
  label: string;
  value: string | number;
  subtext?: string;
}

export const analysisMetrics = {
  row1: [
    { label: "Total spend", value: "₹2.2L", subtext: "₹2,20,000" },
    { label: "Total leads", value: 186 },
    { label: "CPL", value: "₹1,183" },
    { label: "Margin %", value: "1.4%", subtext: "vs target ₹1,200" },
    { label: "Daily budget", value: "₹8,000" },
    { label: "Trend", value: "Improving", subtext: "Last 7 days" },
  ] as AnalysisMetric[],
  row2: [
    { label: "Verified leads", value: 42, subtext: "22.6% rate" },
    { label: "AI qualified", value: 34, subtext: "18.3% rate" },
    { label: "CPVL", value: "₹5,238", subtext: "Cost per verified" },
    { label: "Qualified (SQL)", value: 22, subtext: "11.8% rate" },
    { label: "CPQL", value: "₹10,000", subtext: "Cost per SQL" },
    { label: "Sent to CRM", value: 18, subtext: "81.8% of SQL" },
  ] as AnalysisMetric[],
};

export interface CPLDataPoint {
  date: string;
  cpl: number;
  target: number;
}

export const cplTrendData: CPLDataPoint[] = [
  { date: "Feb 20", cpl: 1450, target: 1200 },
  { date: "Feb 24", cpl: 1380, target: 1200 },
  { date: "Feb 28", cpl: 1320, target: 1200 },
  { date: "Mar 4", cpl: 1280, target: 1200 },
  { date: "Mar 8", cpl: 1250, target: 1200 },
  { date: "Mar 12", cpl: 1190, target: 1200 },
  { date: "Mar 16", cpl: 1210, target: 1200 },
  { date: "Mar 20", cpl: 1183, target: 1200 },
];

export const campaignDiagnosis = {
  status: "near-target" as "on-target" | "near-target" | "off-target",
  summary:
    "Campaign is NEAR TARGET — CPL ₹1,183 is 1.4% below target ₹1,200. Improving trend visible in second half of the flight.",
  reasons: [
    "CPL started high at ₹1,450 and has steadily decreased over 4 weeks",
    "Whitefield HNI adset is the top performer with ₹920 CPL",
    "Broad Bangalore adset is dragging overall CPL up at ₹1,680",
    "Creative fatigue detected on Lifestyle Video (CTR dropped 22%)",
  ],
  recommendations: [
    "Shift 20% budget from Broad Bangalore to Whitefield HNI adset",
    "Refresh Lifestyle Video creative — try testimonial format",
    "Add Sarjapur Road as a separate adset (12% of qualified leads from there)",
    "Consider pausing Floor Plan Static ad — lowest CTR at 0.8%",
  ],
};

export interface AdSetRow {
  id: string;
  name: string;
  spend: number;
  leads: number;
  verifiedLeads: number;
  qualifiedLeads: number;
  cpl: number;
  cpql: number;
  margin: number;
  ctr: number;
  ctlPercent: number;
  enrichedPercent: number;
  aiQualPercent: number;
  sqlPercent: number;
  diagnosis: "on-track" | "needs-attention" | "pause-candidate";
}

export const adSetsData: AdSetRow[] = [
  {
    id: "adset-1",
    name: "Whitefield HNI — 30-45",
    spend: 95000,
    leads: 72,
    verifiedLeads: 22,
    qualifiedLeads: 14,
    cpl: 920,
    cpql: 6786,
    margin: -23.3,
    ctr: 2.4,
    ctlPercent: 4.2,
    enrichedPercent: 88,
    aiQualPercent: 42,
    sqlPercent: 19.4,
    diagnosis: "on-track",
  },
  {
    id: "adset-2",
    name: "Sarjapur IT Corridor",
    spend: 62000,
    leads: 58,
    verifiedLeads: 14,
    qualifiedLeads: 8,
    cpl: 1069,
    cpql: 7750,
    margin: -10.9,
    ctr: 1.9,
    ctlPercent: 3.6,
    enrichedPercent: 82,
    aiQualPercent: 34,
    sqlPercent: 13.8,
    diagnosis: "on-track",
  },
  {
    id: "adset-3",
    name: "Broad Bangalore — 25-55",
    spend: 63000,
    leads: 56,
    verifiedLeads: 6,
    qualifiedLeads: 0,
    cpl: 1680,
    cpql: 0,
    margin: 40,
    ctr: 0.9,
    ctlPercent: 2.1,
    enrichedPercent: 64,
    aiQualPercent: 14,
    sqlPercent: 0,
    diagnosis: "pause-candidate",
  },
];

// ── Metric Explorer Metadata ────────────────────────────────

export interface MetricMeta {
  key: string;
  label: string;
  category: "headline" | "funnel" | "cost" | "health";
  unit: "currency" | "percentage" | "number";
  currentValue: string;
  color: string;
}

export const metricsMeta: MetricMeta[] = [
  // Headlines (also selectable in explorer)
  { key: "spend", label: "Spend", category: "headline", unit: "currency", currentValue: "₹2.2L", color: "#1A1A1A" },
  { key: "leads", label: "Leads", category: "headline", unit: "number", currentValue: "186", color: "#1A1A1A" },
  { key: "qualified", label: "Qualified", category: "headline", unit: "number", currentValue: "22", color: "#1A1A1A" },
  { key: "cpl", label: "CPL", category: "headline", unit: "currency", currentValue: "₹1,183", color: "#1A1A1A" },
  // Funnel
  { key: "ctr", label: "CTR", category: "funnel", unit: "percentage", currentValue: "2.1%", color: "#3B82F6" },
  { key: "cvr", label: "CVR", category: "funnel", unit: "percentage", currentValue: "4.8%", color: "#3B82F6" },
  { key: "verificationRate", label: "Verification Rate", category: "funnel", unit: "percentage", currentValue: "22.6%", color: "#3B82F6" },
  { key: "aiQualRate", label: "AI Qual Rate", category: "funnel", unit: "percentage", currentValue: "18.3%", color: "#3B82F6" },
  { key: "sqlRate", label: "SQL Rate", category: "funnel", unit: "percentage", currentValue: "11.8%", color: "#3B82F6" },
  // Cost
  { key: "cpm", label: "CPM", category: "cost", unit: "currency", currentValue: "₹245", color: "#F59E0B" },
  { key: "cpc", label: "CPC", category: "cost", unit: "currency", currentValue: "₹57", color: "#F59E0B" },
  { key: "cpvl", label: "CPVL", category: "cost", unit: "currency", currentValue: "₹5,238", color: "#F59E0B" },
  { key: "cpql", label: "CPQL", category: "cost", unit: "currency", currentValue: "₹10,000", color: "#F59E0B" },
  // Health
  { key: "frequency", label: "Frequency", category: "health", unit: "number", currentValue: "2.4", color: "#22C55E" },
  { key: "budgetPacing", label: "Budget Pacing", category: "health", unit: "percentage", currentValue: "97.5%", color: "#22C55E" },
];

export const healthIndicators = [
  { key: "ctr", label: "CTR", value: "2.1%", status: "green" as const },
  { key: "cvr", label: "CVR", value: "4.8%", status: "green" as const },
  { key: "cpl", label: "CPL vs Target", value: "₹1,183", status: "green" as const },
  { key: "cpm", label: "CPM", value: "₹245", status: "green" as const },
  { key: "budgetPacing", label: "Budget", value: "97.5%", status: "green" as const },
  { key: "frequency", label: "Frequency", value: "2.4", status: "green" as const },
];

// ── Settings Tab Data ───────────────────────────────────────

export interface ConnectedAdset {
  id: string;
  name: string;
  adsetId: string;
  status: "active" | "paused";
}

export const connectedAdsets: ConnectedAdset[] = [
  {
    id: "cas-1",
    name: "Whitefield HNI — 30-45",
    adsetId: "23851029384711",
    status: "active",
  },
  {
    id: "cas-2",
    name: "Sarjapur IT Corridor",
    adsetId: "23851029384712",
    status: "active",
  },
  {
    id: "cas-3",
    name: "Broad Bangalore — 25-55",
    adsetId: "23851029384713",
    status: "active",
  },
];

export interface ResponseField {
  id: string;
  fieldId: string;
  systemKey: string;
  defaultValue: string;
}

export const responseFormatFields: ResponseField[] = [
  { id: "rf-1", fieldId: "full_name", systemKey: "name", defaultValue: "" },
  { id: "rf-2", fieldId: "phone_number", systemKey: "phone", defaultValue: "" },
  { id: "rf-3", fieldId: "email", systemKey: "email", defaultValue: "" },
  {
    id: "rf-4",
    fieldId: "budget_range",
    systemKey: "budget",
    defaultValue: "Not specified",
  },
  {
    id: "rf-5",
    fieldId: "configuration",
    systemKey: "config",
    defaultValue: "Any",
  },
  {
    id: "rf-6",
    fieldId: "purchase_timeline",
    systemKey: "timeline",
    defaultValue: "Not specified",
  },
];

// ── Projects Data ───────────────────────────────────────────

export interface ProjectItem {
  id: string;
  name: string;
  client: string;
  category: string;
  status: "active" | "paused" | "completed";
  campaignIds: string[];
  totalSpend: number;
  totalLeads: number;
  verifiedLeads: number;
  qualifiedLeads: number;
  avgCPL: number;
  createdAt: string;
}

export const projectsList: ProjectItem[] = [
  {
    id: "proj-1",
    name: "Whitefield Luxury Villas",
    client: "Prestige Group",
    category: "Real Estate",
    status: "active",
    campaignIds: ["camp-1", "camp-10"],
    totalSpend: 233000,
    totalLeads: 278,
    verifiedLeads: 46,
    qualifiedLeads: 22,
    avgCPL: 838,
    createdAt: "2025-12-01",
  },
  {
    id: "proj-2",
    name: "Assetz Mizumi — Phase 3 Launch",
    client: "Assetz Property",
    category: "Real Estate",
    status: "active",
    campaignIds: ["camp-7"],
    totalSpend: 220000,
    totalLeads: 186,
    verifiedLeads: 42,
    qualifiedLeads: 22,
    avgCPL: 1183,
    createdAt: "2025-11-15",
  },
  {
    id: "proj-3",
    name: "Brigade Utopia — Pre-launch",
    client: "Brigade Group",
    category: "Real Estate",
    status: "active",
    campaignIds: ["camp-2"],
    totalSpend: 142000,
    totalLeads: 156,
    verifiedLeads: 22,
    qualifiedLeads: 11,
    avgCPL: 910,
    createdAt: "2026-01-08",
  },
  {
    id: "proj-4",
    name: "Birla Tisya — Full Funnel",
    client: "Birla Estates",
    category: "Real Estate",
    status: "completed",
    campaignIds: ["camp-9"],
    totalSpend: 310000,
    totalLeads: 340,
    verifiedLeads: 58,
    qualifiedLeads: 29,
    avgCPL: 912,
    createdAt: "2025-09-10",
  },
];

export function getProjectCampaigns(projectId: string) {
  const project = projectsList.find((p) => p.id === projectId);
  if (!project) return [];
  return campaignsList.filter((c) => project.campaignIds.includes(c.id));
}

export const settingsData = {
  channelConfig: {
    platform: "Meta",
    pageId: "109284756301",
    campaignId: "23851029384710",
  },
  sequenceSettings: {
    aiCallingEnabled: true,
    maxAttempts: 3,
    callInterval: "4 hours",
  },
  crmSettings: {
    sendQLeadToCRM: true,
    sendIQLeadToCRM: false,
    autoSendConfig: {
      enabled: true,
      trigger: "on_qualification",
      delay: "0",
      destination: "salesforce",
    },
  },
  notifications: {
    emailOnNewLead: true,
    emailOnQualification: true,
    slackIntegration: false,
    dailyDigest: true,
  },
};
