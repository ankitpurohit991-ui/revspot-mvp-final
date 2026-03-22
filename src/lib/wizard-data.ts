// Campaign creation wizard mock data

export const existingClients = [
  "Prestige Group",
  "Brigade Group",
  "Sobha Ltd",
  "Godrej Properties",
  "Embassy Group",
  "Total Environment",
  "Assetz Property",
  "Puravankara",
  "Birla Estates",
  "Tata Housing",
];

export const industries = [
  "Real Estate",
  "EdTech",
  "InsurTech",
  "FinTech",
  "Healthcare",
  "SaaS",
  "E-commerce",
  "Hospitality",
  "Automotive",
  "Other",
];

export const cities = [
  "Bangalore",
  "Mumbai",
  "Delhi NCR",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
];

export const languages = ["English", "Hindi", "Kannada", "Tamil", "Telugu", "Marathi"];

export const qualityPreferences = [
  { value: "volume", label: "Volume — Maximize lead count" },
  { value: "balanced", label: "Balanced — Mix of volume and quality" },
  { value: "quality", label: "Quality — Fewer but highly qualified leads" },
];

// Step 2 — Business Profile (AI-extracted)
export const extractedProfile = {
  builderName: "Assetz Property Group",
  projectName: "Assetz Mizumi",
  city: "Bangalore",
  industry: "Real Estate",
  geography: "Whitefield, East Bangalore",
  offerSummary:
    "Premium 3 & 4 BHK apartments starting ₹1.8Cr in Whitefield. Phase 3 launch with exclusive pre-launch pricing. RERA approved. Possession by Dec 2027.",
  pricePositioning: "Premium (₹1.8Cr – ₹3.5Cr)",
  keyBenefits: [
    "Japanese-inspired architecture with zen gardens",
    "3-acre central landscaped deck",
    "2 mins from ITPL & Whitefield Metro",
    "Club house with infinity pool, co-working spaces",
    "Smart home automation in every unit",
    "IGBC Gold pre-certified",
  ],
  proofPoints: [
    "1200+ happy families across 8 projects",
    "RERA: PRM/KA/RERA/1251/310/PR/171015/001457",
    "Assetz ranked #1 in customer satisfaction — Track2Realty 2025",
  ],
  primaryObjections: [
    "Price seems high for Whitefield micro-market",
    "Possession timeline is 2+ years away",
    "Traffic congestion in Whitefield area",
  ],
  assumptions: [
    "Target audience: IT professionals, 28-45, HHI > ₹25L",
    "Primary decision driver: location proximity to ITPL",
    "Budget range of audience: ₹1.5Cr - ₹3Cr",
  ],
  specialAdCategory: "housing",
};

// Step 3 — Strategy
export const strategyData = {
  campaignStrategy: {
    objective: "Lead Generation via Meta Lead Ads",
    optimization: "Optimize for lead quality using Meta Conversions API",
    placements: "Facebook Feed, Instagram Feed, Instagram Stories, Reels",
    principles: [
      "Lead with lifestyle and aspiration, not just floor plans",
      "Use social proof and scarcity to drive urgency",
      "Segment by intent level — separate warm and cold audiences",
      "Test 3 creative angles per persona in first week",
    ],
  },
  adSets: [
    {
      id: "as-1",
      name: "Whitefield HNI — 30-45",
      description: "High-net-worth IT professionals near Whitefield who can afford premium apartments",
      targeting: {
        geo: "Whitefield, ITPL, Marathahalli, Kundalahalli — 10km radius",
        audience: "Age 30-45, IT professionals, income > ₹25L, interested in luxury living",
        exclusions: "Existing Assetz leads, converted customers",
      },
    },
    {
      id: "as-2",
      name: "Sarjapur IT Corridor",
      description: "IT professionals along Sarjapur road corridor looking to move to East Bangalore",
      targeting: {
        geo: "Sarjapur Road, HSR Layout, Bellandur, Haralur — 8km radius",
        audience: "Age 28-42, IT professionals, recently engaged or married, home loan pre-approved",
        exclusions: "Existing leads from past 30 days",
      },
    },
    {
      id: "as-3",
      name: "Broad Bangalore — 25-55",
      description: "Wider Bangalore audience for brand awareness and top-of-funnel lead capture",
      targeting: {
        geo: "Bangalore city — 25km radius from MG Road",
        audience: "Age 25-55, interested in real estate, property investment, home buying",
        exclusions: "Existing leads, low-intent audiences",
      },
    },
  ],
  personas: [
    {
      id: "p-1",
      name: "The IT Professional",
      description: "Senior software engineer or manager at a top tech company, looking to upgrade from a rented apartment",
      angle: "Lifestyle upgrade",
      pain: "Long commute, cramped rental, want ownership pride",
      hooks: ["Your office is 2 mins away", "Stop paying someone else's EMI", "Premium living, not premium commute"],
    },
    {
      id: "p-2",
      name: "The NRI Investor",
      description: "NRI looking for investment property in Bangalore with good rental yield and appreciation",
      angle: "Investment returns",
      pain: "Managing property from abroad, want trusted builder",
      hooks: ["₹1.8Cr today, ₹2.5Cr by possession", "Fully managed investment", "Bangalore's fastest growing corridor"],
    },
    {
      id: "p-3",
      name: "The Upgrader Family",
      description: "Family currently in a 2BHK looking to upgrade to a spacious 3BHK with better amenities",
      angle: "Family-first living",
      pain: "Kids need more space, want better school proximity, community",
      hooks: ["3-acre garden for your kids", "From 2BHK to zen living", "The home your family deserves"],
    },
  ],
  creatives: {
    staticIdeas: [
      {
        id: "cr-1",
        name: "Hero Lifestyle Shot",
        persona: "The IT Professional",
        visual: "Aerial drone shot of the project with the green deck visible, ITPL towers in background, golden hour lighting",
        text: "Your office is 2 minutes away. Your home should feel like a resort. Assetz Mizumi — Premium 3 & 4 BHK from ₹1.8Cr",
      },
      {
        id: "cr-2",
        name: "Price Anchor Carousel",
        persona: "The Upgrader Family",
        visual: "4-slide carousel: (1) Kitchen interior (2) Kids play area (3) Pool deck (4) Floor plan with pricing",
        text: "Phase 3 exclusive pricing won't last. 3 BHK from ₹1.8Cr — only 42 units in this release.",
      },
      {
        id: "cr-3",
        name: "Social Proof Testimonial",
        persona: "The NRI Investor",
        visual: "Video testimonial thumbnail of an existing Assetz homeowner with quote overlay",
        text: "1200+ families chose Assetz. Here's why Rajesh from San Francisco invested in Mizumi Phase 2.",
      },
    ],
    videoScripts: [
      {
        id: "vs-1",
        name: "60s Lifestyle Walkthrough",
        scenes: [
          { timestamp: "0-5s", description: "Drone approaching the project through tree-lined avenue" },
          { timestamp: "5-15s", description: "Walking through the zen garden, water features" },
          { timestamp: "15-25s", description: "Interior shots — living room, kitchen, master bedroom" },
          { timestamp: "25-35s", description: "Amenities montage — pool, gym, co-working, kids area" },
          { timestamp: "35-50s", description: "Couple on balcony at sunset, Whitefield skyline visible" },
          { timestamp: "50-60s", description: "Logo, pricing, CTA: 'Book your site visit'" },
        ],
      },
    ],
    primaryTexts: [
      "Your office is 2 mins from ITPL. Your home should feel like a Japanese retreat. Assetz Mizumi Phase 3 — Premium 3 & 4 BHK from ₹1.8Cr. Book your exclusive site visit today.",
      "1200+ families trust Assetz. Phase 3 of Mizumi in Whitefield is now open. Japanese-inspired architecture, 3-acre zen gardens, smart homes. Starting ₹1.8Cr. Limited units.",
      "Stop commuting 2 hours to live in a box. Assetz Mizumi is 2 mins from ITPL — premium 3BHK apartments with zen gardens, infinity pool, and co-working spaces. From ₹1.8Cr.",
      "Phase 3 exclusive: Only 42 units at pre-launch pricing. Assetz Mizumi, Whitefield — RERA approved, IGBC Gold certified. 3 & 4 BHK from ₹1.8Cr. Register now.",
      "Your family deserves a 3-acre garden, not a 300 sqft balcony. Upgrade to Assetz Mizumi — Whitefield's most premium address. Starting ₹1.8Cr. Possession Dec 2027.",
    ],
    headlines: [
      "Premium 3BHK from ₹1.8Cr",
      "2 Mins from ITPL, Whitefield",
      "Phase 3 Pre-Launch Pricing",
      "Japanese-Inspired Zen Living",
      "Only 42 Units Available",
    ],
    descriptions: [
      "RERA Approved | IGBC Gold | Assetz Mizumi Whitefield",
      "3-Acre Zen Gardens | Smart Homes | Book Site Visit",
      "1200+ Happy Families | Trusted Builder Since 2006",
      "Infinity Pool | Co-Working | Near ITPL & Metro",
      "Exclusive Pre-Launch Offer | Register Today",
    ],
  },
  forms: [
    {
      id: "form-1",
      name: "High Intent Lead Form",
      intent: "High",
      headline: "Book Your Exclusive Site Visit",
      greeting: "Thank you for your interest in Assetz Mizumi! Our team will reach out within 2 hours to schedule your private site visit.",
      bullets: [
        "Get exclusive Phase 3 pricing",
        "Virtual & in-person site visits available",
        "Talk to our property advisor",
      ],
      questions: [
        "What is your budget range?",
        "Preferred configuration? (2BHK / 3BHK / 4BHK)",
        "When are you planning to purchase?",
        "Your current location in Bangalore?",
      ],
    },
    {
      id: "form-2",
      name: "Quick Inquiry Form",
      intent: "Medium",
      headline: "Get Mizumi Phase 3 Brochure",
      greeting: "Download the detailed brochure with floor plans, pricing, and amenities.",
      bullets: [
        "Detailed floor plans for all configurations",
        "Complete pricing sheet",
        "Amenity highlights and specifications",
      ],
      questions: [
        "What is your budget range?",
        "Preferred configuration?",
      ],
    },
  ],
  budgetForecast: {
    goalLeads: 200,
    cplRange: { min: 800, max: 1200 },
    dailyBudget: 8000,
  },
  scalingPlan: [
    { phase: "Day 1-3", action: "Launch all 3 ad sets with 3 creatives each at ₹5K/day. Monitor CTR and CPL." },
    { phase: "Day 4-7", action: "Kill underperforming creatives (CTR < 1%). Scale winning ad set to ₹8K/day." },
    { phase: "Day 8-14", action: "Introduce lookalike audiences from verified leads. Target ₹10K/day total spend." },
  ],
  guardrails: [
    "Pause any ad set with CPL > ₹1,500 for 3 consecutive days",
    "Alert if daily spend exceeds ₹12,000",
    "Auto-pause creatives with CTR < 0.5% after 1000 impressions",
    "Weekly review of lead quality with sales team",
  ],
};

// Step 4 — Launch
export const adAccounts = [
  { id: "act-1", name: "Star Realtor — Primary (act_1234567890)" },
  { id: "act-2", name: "Star Realtor — Backup (act_0987654321)" },
];

export const facebookPages = [
  { id: "pg-1", name: "Star Realtor Official (109284756301)" },
  { id: "pg-2", name: "Bangalore Property Deals (109284756302)" },
];

// Metric chart data for Analysis tab improvement
export interface AnalysisChartDataPoint {
  date: string;
  cpl: number;
  leads: number;
  verifiedLeads: number;
  spend: number;
  qualifiedLeads: number;
  ctr: number;
  target: number;
}

export const analysisChartData: AnalysisChartDataPoint[] = [
  { date: "Feb 20", cpl: 1450, leads: 18, verifiedLeads: 3, spend: 26100, qualifiedLeads: 1, ctr: 1.2, target: 1200 },
  { date: "Feb 24", cpl: 1380, leads: 22, verifiedLeads: 4, spend: 30360, qualifiedLeads: 2, ctr: 1.4, target: 1200 },
  { date: "Feb 28", cpl: 1320, leads: 24, verifiedLeads: 5, spend: 31680, qualifiedLeads: 3, ctr: 1.6, target: 1200 },
  { date: "Mar 4", cpl: 1280, leads: 26, verifiedLeads: 6, spend: 33280, qualifiedLeads: 3, ctr: 1.7, target: 1200 },
  { date: "Mar 8", cpl: 1250, leads: 24, verifiedLeads: 5, spend: 30000, qualifiedLeads: 3, ctr: 1.8, target: 1200 },
  { date: "Mar 12", cpl: 1190, leads: 28, verifiedLeads: 7, spend: 33320, qualifiedLeads: 4, ctr: 2.0, target: 1200 },
  { date: "Mar 16", cpl: 1210, leads: 22, verifiedLeads: 5, spend: 26620, qualifiedLeads: 3, ctr: 1.9, target: 1200 },
  { date: "Mar 20", cpl: 1183, leads: 22, verifiedLeads: 7, spend: 26026, qualifiedLeads: 3, ctr: 2.1, target: 1200 },
];

export const chartMetricOptions = [
  { key: "cpl", label: "CPL", color: "#1A1A1A", format: "currency" },
  { key: "leads", label: "Leads", color: "#3B82F6", format: "number" },
  { key: "verifiedLeads", label: "Verified Leads", color: "#22C55E", format: "number" },
  { key: "spend", label: "Spend", color: "#F5A623", format: "currency" },
  { key: "qualifiedLeads", label: "Qualified Leads", color: "#8B5CF6", format: "number" },
  { key: "ctr", label: "CTR %", color: "#EC4899", format: "percent" },
] as const;
