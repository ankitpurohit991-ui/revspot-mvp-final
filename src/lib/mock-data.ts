export const dashboardMetrics = {
  activeCampaigns: {
    value: 9,
    previous: 7,
    label: "Active campaigns",
    trend: { value: 28.6, direction: "up" as const },
  },
  monthlySpend: {
    value: "₹6.8L",
    rawValue: 680000,
    formattedFull: "₹6,80,000",
    previous: "₹5.4L",
    previousRaw: 540000,
    label: "Monthly spend",
    trend: { value: 25.9, direction: "up" as const },
  },
  totalLeads: {
    value: 845,
    previous: 754,
    label: "Total leads",
    trend: { value: 12, direction: "up" as const },
  },
  verifiedLeads: {
    value: 127,
    previous: 104,
    label: "Verified leads",
    trend: { value: 22.1, direction: "up" as const },
  },
  qualifiedLeads: {
    value: 68,
    previous: 63,
    label: "Qualified leads",
    trend: { value: 7.9, direction: "up" as const },
  },
  verificationRate: {
    value: "15%",
    previous: "13.8%",
    label: "Verification rate",
    trend: { value: 8.7, direction: "up" as const },
  },
  avgCPL: {
    value: "₹1,183",
    previous: "₹1,245",
    label: "Avg CPL",
    trend: { value: 5, direction: "down" as const, positive: true },
  },
  costPerVerified: {
    value: "₹5,354",
    previous: "₹5,192",
    label: "Cost per verified lead",
    trend: { value: 3.1, direction: "up" as const, positive: false },
  },
};

export const aiRecommendations = [
  {
    id: "rec-1",
    priority: "high" as const,
    title: "Shift ₹30K from Google Search to Meta Ads",
    description:
      "Meta generates qualified leads at ₹380 CPL vs Google's ₹620. Shifting budget could yield +15 qualified leads this month.",
  },
  {
    id: "rec-2",
    priority: "medium" as const,
    title: "Refresh HNI carousel creative",
    description:
      "CTR declined 28% in 7 days — creative fatigue detected on the top-performing ad set.",
  },
  {
    id: "rec-3",
    priority: "low" as const,
    title: "Add Sarjapur Road to Meta targeting",
    description:
      "12% of qualified leads are coming from Sarjapur, which isn't in current targeting.",
  },
];

export interface CampaignRow {
  id: string;
  name: string;
  spend: number;
  leads: number;
  verified: number;
  qualified: number;
  cpl: number;
  status: "on-track" | "needs-attention" | "underperforming";
}

export const campaignPerformance: CampaignRow[] = [
  {
    id: "camp-1",
    name: "Prestige Lakeside — Lead Gen",
    spend: 185000,
    leads: 214,
    verified: 38,
    qualified: 18,
    cpl: 864,
    status: "on-track",
  },
  {
    id: "camp-2",
    name: "Brigade Utopia — Retargeting",
    spend: 142000,
    leads: 156,
    verified: 22,
    qualified: 11,
    cpl: 910,
    status: "needs-attention",
  },
  {
    id: "camp-3",
    name: "Sobha Windsor — Lookalike",
    spend: 95000,
    leads: 128,
    verified: 24,
    qualified: 14,
    cpl: 742,
    status: "on-track",
  },
  {
    id: "camp-4",
    name: "Godrej Splendour — Lead Gen",
    spend: 110000,
    leads: 142,
    verified: 18,
    qualified: 8,
    cpl: 775,
    status: "underperforming",
  },
  {
    id: "camp-5",
    name: "Embassy Lake Terraces — HNI",
    spend: 88000,
    leads: 98,
    verified: 16,
    qualified: 10,
    cpl: 898,
    status: "on-track",
  },
  {
    id: "camp-6",
    name: "Total Environment — Carousel",
    spend: 60000,
    leads: 107,
    verified: 9,
    qualified: 7,
    cpl: 561,
    status: "on-track",
  },
];

export interface RecentLead {
  id: string;
  name: string;
  phone: string;
  campaign: string;
  timeAgo: string;
  status: "qualified" | "not_qualified" | "pending";
  verified: boolean;
}

export const recentLeads: RecentLead[] = [
  {
    id: "lead-1",
    name: "V***** R*****",
    phone: "98XXX XX342",
    campaign: "Prestige Lakeside",
    timeAgo: "12 min ago",
    status: "qualified",
    verified: true,
  },
  {
    id: "lead-2",
    name: "S***** M*****",
    phone: "90XXX XX891",
    campaign: "Brigade Utopia",
    timeAgo: "34 min ago",
    status: "pending",
    verified: false,
  },
  {
    id: "lead-3",
    name: "A***** K*****",
    phone: "87XXX XX156",
    campaign: "Sobha Windsor",
    timeAgo: "1 hr ago",
    status: "qualified",
    verified: true,
  },
  {
    id: "lead-4",
    name: "P***** J*****",
    phone: "99XXX XX723",
    campaign: "Godrej Splendour",
    timeAgo: "2 hr ago",
    status: "not_qualified",
    verified: false,
  },
  {
    id: "lead-5",
    name: "R***** B*****",
    phone: "80XXX XX445",
    campaign: "Embassy Lake Terraces",
    timeAgo: "3 hr ago",
    status: "qualified",
    verified: true,
  },
  {
    id: "lead-6",
    name: "N***** D*****",
    phone: "91XXX XX867",
    campaign: "Total Environment",
    timeAgo: "4 hr ago",
    status: "pending",
    verified: false,
  },
];

export const voiceAgentMetrics = {
  totalCalls: 142,
  connected: { value: 112, rate: 78.9 },
  qualified: { value: 52, rate: 46.4 },
  avgDuration: 3.2,
};

export const disqualificationReasons = [
  { reason: "Budget below threshold", percentage: 41 },
  { reason: "Timeline >12 months", percentage: 30 },
  { reason: "Not decision maker", percentage: 17 },
  { reason: "Not interested", percentage: 12 },
];
