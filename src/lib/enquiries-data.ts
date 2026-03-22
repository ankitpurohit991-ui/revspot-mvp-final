// Cross-campaign leads data for the CRM Leads page
import type {
  LeadTemperature,
  LeadQualification,
  LeadStatus,
  EnrichmentStatus,
} from "@/lib/campaign-data";

export interface EnquiryLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  campaign: string;
  campaignId: string;
  createdAt: string;
  updatedAt: string;
  enrichmentStatus: EnrichmentStatus;
  aiQualification: LeadQualification;
  temperature: LeadTemperature;
  leadStatus: LeadStatus;
  verified: boolean;
  sql: boolean;
  sentToCRM: string | null;
  adset: string;
  adName: string;
  formResponses: { question: string; answer: string }[];
}

export const enquiryStats = {
  total: 845,
  qualified: 127,
  notQualified: 412,
  pending: 306,
  verified: 142,
};

export const allLeads: EnquiryLead[] = [
  {
    id: "e-001", name: "V***** R*****", phone: "98XXX XX342", email: "v*****@gmail.com",
    campaign: "Prestige Lakeside", campaignId: "camp-1",
    createdAt: "2026-03-22T09:10:00", updatedAt: "2026-03-22T10:30:00",
    enrichmentStatus: "enriched", aiQualification: "qualified", temperature: "hot",
    leadStatus: "site_visit", verified: true, sql: true, sentToCRM: "ankit@starealtor.in",
    adset: "Whitefield HNI — 30-45", adName: "Lakeside 3BHK Carousel",
    formResponses: [
      { question: "Budget range?", answer: "₹2Cr - ₹2.5Cr" },
      { question: "Configuration?", answer: "3 BHK Premium" },
      { question: "Timeline?", answer: "Immediate" },
    ],
  },
  {
    id: "e-002", name: "S***** M*****", phone: "90XXX XX891", email: "s*****@yahoo.com",
    campaign: "Brigade Utopia", campaignId: "camp-2",
    createdAt: "2026-03-22T08:45:00", updatedAt: "2026-03-22T09:15:00",
    enrichmentStatus: "enriched", aiQualification: "pending", temperature: "warm",
    leadStatus: "contacted", verified: false, sql: false, sentToCRM: null,
    adset: "Sarjapur IT Corridor", adName: "Utopia Lifestyle Video",
    formResponses: [
      { question: "Budget range?", answer: "₹1Cr - ₹1.5Cr" },
      { question: "Configuration?", answer: "2 BHK" },
    ],
  },
  {
    id: "e-003", name: "A***** K*****", phone: "87XXX XX156", email: "a*****@outlook.com",
    campaign: "Sobha Windsor", campaignId: "camp-3",
    createdAt: "2026-03-22T07:30:00", updatedAt: "2026-03-22T08:00:00",
    enrichmentStatus: "enriched", aiQualification: "qualified", temperature: "hot",
    leadStatus: "negotiation", verified: true, sql: true, sentToCRM: "priya@starealtor.in",
    adset: "Whitefield HNI", adName: "Windsor Floor Plan",
    formResponses: [
      { question: "Budget range?", answer: "₹1.8Cr - ₹2.2Cr" },
      { question: "Configuration?", answer: "3 BHK" },
      { question: "Timeline?", answer: "Within 3 months" },
    ],
  },
  {
    id: "e-004", name: "P***** J*****", phone: "99XXX XX723", email: "p*****@gmail.com",
    campaign: "Godrej Splendour", campaignId: "camp-4",
    createdAt: "2026-03-21T19:20:00", updatedAt: "2026-03-21T19:20:00",
    enrichmentStatus: "not_enriched", aiQualification: "not_qualified", temperature: "cold",
    leadStatus: "new", verified: false, sql: false, sentToCRM: null,
    adset: "Broad Bangalore", adName: "Splendour Carousel",
    formResponses: [
      { question: "Budget range?", answer: "Below ₹80L" },
    ],
  },
  {
    id: "e-005", name: "R***** B*****", phone: "80XXX XX445", email: "r*****@gmail.com",
    campaign: "Embassy Lake Terraces", campaignId: "camp-5",
    createdAt: "2026-03-21T17:50:00", updatedAt: "2026-03-22T08:10:00",
    enrichmentStatus: "enriched", aiQualification: "qualified", temperature: "warm",
    leadStatus: "interested", verified: true, sql: false, sentToCRM: null,
    adset: "Koramangala HNI", adName: "Lake Terraces Virtual Tour",
    formResponses: [
      { question: "Budget range?", answer: "₹3Cr+" },
      { question: "Configuration?", answer: "4 BHK Penthouse" },
      { question: "Timeline?", answer: "3-6 months" },
    ],
  },
  {
    id: "e-006", name: "N***** D*****", phone: "91XXX XX867", email: "n*****@hotmail.com",
    campaign: "Assetz Mizumi PM R3", campaignId: "camp-7",
    createdAt: "2026-03-21T16:15:00", updatedAt: "2026-03-21T17:00:00",
    enrichmentStatus: "enriched", aiQualification: "not_qualified", temperature: "lukewarm",
    leadStatus: "contacted", verified: false, sql: false, sentToCRM: null,
    adset: "Whitefield HNI — 30-45", adName: "Mizumi Amenities Carousel",
    formResponses: [
      { question: "Budget range?", answer: "₹1Cr - ₹1.5Cr" },
      { question: "Timeline?", answer: ">12 months" },
    ],
  },
  {
    id: "e-007", name: "M***** S*****", phone: "96XXX XX218", email: "m*****@gmail.com",
    campaign: "Assetz Mizumi PM R3", campaignId: "camp-7",
    createdAt: "2026-03-21T15:00:00", updatedAt: "2026-03-21T18:30:00",
    enrichmentStatus: "enriched", aiQualification: "qualified", temperature: "hot",
    leadStatus: "site_visit", verified: true, sql: true, sentToCRM: "ankit@starealtor.in",
    adset: "Whitefield HNI — 30-45", adName: "Mizumi 3BHK Carousel v2",
    formResponses: [
      { question: "Budget range?", answer: "₹2Cr+" },
      { question: "Configuration?", answer: "4 BHK" },
      { question: "Timeline?", answer: "Immediate" },
      { question: "Current location?", answer: "Koramangala" },
    ],
  },
  {
    id: "e-008", name: "K***** G*****", phone: "88XXX XX534", email: "k*****@gmail.com",
    campaign: "Prestige Lakeside", campaignId: "camp-1",
    createdAt: "2026-03-21T12:30:00", updatedAt: "2026-03-21T12:30:00",
    enrichmentStatus: "not_enriched", aiQualification: "pending", temperature: "lukewarm",
    leadStatus: "new", verified: false, sql: false, sentToCRM: null,
    adset: "Broad Bangalore", adName: "Lakeside Floor Plan",
    formResponses: [
      { question: "Budget range?", answer: "₹1.2Cr" },
    ],
  },
  {
    id: "e-009", name: "D***** T*****", phone: "70XXX XX912", email: "d*****@gmail.com",
    campaign: "Sobha Windsor", campaignId: "camp-3",
    createdAt: "2026-03-21T10:45:00", updatedAt: "2026-03-21T14:00:00",
    enrichmentStatus: "enriched", aiQualification: "qualified", temperature: "warm",
    leadStatus: "interested", verified: true, sql: true, sentToCRM: "priya@starealtor.in",
    adset: "Sarjapur IT Corridor", adName: "Windsor Lifestyle Video",
    formResponses: [
      { question: "Budget range?", answer: "₹1.5Cr - ₹2Cr" },
      { question: "Configuration?", answer: "3 BHK" },
      { question: "Timeline?", answer: "Within 3 months" },
    ],
  },
  {
    id: "e-010", name: "G***** P*****", phone: "95XXX XX671", email: "g*****@yahoo.com",
    campaign: "Godrej Splendour", campaignId: "camp-4",
    createdAt: "2026-03-21T09:00:00", updatedAt: "2026-03-21T09:00:00",
    enrichmentStatus: "failed", aiQualification: "pending", temperature: "cold",
    leadStatus: "new", verified: false, sql: false, sentToCRM: null,
    adset: "Broad Bangalore", adName: "Splendour Video",
    formResponses: [
      { question: "Budget range?", answer: "Not specified" },
    ],
  },
  {
    id: "e-011", name: "T***** A*****", phone: "85XXX XX390", email: "t*****@gmail.com",
    campaign: "Prestige Lakeside", campaignId: "camp-1",
    createdAt: "2026-03-20T18:20:00", updatedAt: "2026-03-21T10:00:00",
    enrichmentStatus: "enriched", aiQualification: "qualified", temperature: "hot",
    leadStatus: "negotiation", verified: true, sql: true, sentToCRM: "ankit@starealtor.in",
    adset: "Whitefield HNI — 30-45", adName: "Lakeside 3BHK Carousel",
    formResponses: [
      { question: "Budget range?", answer: "₹2.5Cr - ₹3Cr" },
      { question: "Configuration?", answer: "4 BHK" },
      { question: "Timeline?", answer: "Immediate" },
    ],
  },
  {
    id: "e-012", name: "H***** V*****", phone: "93XXX XX148", email: "h*****@gmail.com",
    campaign: "Brigade Utopia", campaignId: "camp-2",
    createdAt: "2026-03-20T15:40:00", updatedAt: "2026-03-20T16:30:00",
    enrichmentStatus: "enriched", aiQualification: "not_qualified", temperature: "cold",
    leadStatus: "lost", verified: false, sql: false, sentToCRM: null,
    adset: "Broad Bangalore", adName: "Utopia Floor Plan",
    formResponses: [
      { question: "Budget range?", answer: "Below ₹70L" },
    ],
  },
  {
    id: "e-013", name: "L***** R*****", phone: "78XXX XX203", email: "l*****@gmail.com",
    campaign: "Embassy Lake Terraces", campaignId: "camp-5",
    createdAt: "2026-03-20T14:10:00", updatedAt: "2026-03-20T15:45:00",
    enrichmentStatus: "enriched", aiQualification: "qualified", temperature: "warm",
    leadStatus: "interested", verified: true, sql: false, sentToCRM: null,
    adset: "Koramangala HNI", adName: "Lake Terraces Amenities",
    formResponses: [
      { question: "Budget range?", answer: "₹2.5Cr - ₹3.5Cr" },
      { question: "Configuration?", answer: "3 BHK Premium" },
      { question: "Timeline?", answer: "6 months" },
    ],
  },
  {
    id: "e-014", name: "Y***** N*****", phone: "82XXX XX567", email: "y*****@outlook.com",
    campaign: "Assetz Mizumi PM R3", campaignId: "camp-7",
    createdAt: "2026-03-20T11:30:00", updatedAt: "2026-03-20T14:20:00",
    enrichmentStatus: "enriched", aiQualification: "pending", temperature: "warm",
    leadStatus: "contacted", verified: false, sql: false, sentToCRM: null,
    adset: "Sarjapur IT Corridor", adName: "Mizumi Lifestyle Video",
    formResponses: [
      { question: "Budget range?", answer: "₹1.5Cr - ₹2Cr" },
      { question: "Configuration?", answer: "3 BHK" },
    ],
  },
  {
    id: "e-015", name: "B***** C*****", phone: "97XXX XX834", email: "b*****@gmail.com",
    campaign: "Purva Atmosphere", campaignId: "camp-8",
    createdAt: "2026-03-20T09:55:00", updatedAt: "2026-03-20T09:55:00",
    enrichmentStatus: "not_enriched", aiQualification: "pending", temperature: "lukewarm",
    leadStatus: "new", verified: false, sql: false, sentToCRM: null,
    adset: "Broad Bangalore", adName: "Atmosphere Brand Video",
    formResponses: [
      { question: "Budget range?", answer: "₹1Cr - ₹1.5Cr" },
    ],
  },
  {
    id: "e-016", name: "F***** I*****", phone: "89XXX XX401", email: "f*****@gmail.com",
    campaign: "Prestige Lakeside", campaignId: "camp-1",
    createdAt: "2026-03-19T20:30:00", updatedAt: "2026-03-20T09:15:00",
    enrichmentStatus: "enriched", aiQualification: "qualified", temperature: "hot",
    leadStatus: "site_visit", verified: true, sql: true, sentToCRM: "priya@starealtor.in",
    adset: "Whitefield HNI — 30-45", adName: "Lakeside Virtual Tour",
    formResponses: [
      { question: "Budget range?", answer: "₹2Cr - ₹2.5Cr" },
      { question: "Configuration?", answer: "3 BHK" },
      { question: "Timeline?", answer: "Within 1 month" },
      { question: "Current location?", answer: "Marathahalli" },
    ],
  },
  {
    id: "e-017", name: "J***** W*****", phone: "94XXX XX678", email: "j*****@gmail.com",
    campaign: "Sobha Windsor", campaignId: "camp-3",
    createdAt: "2026-03-19T17:15:00", updatedAt: "2026-03-19T17:15:00",
    enrichmentStatus: "not_enriched", aiQualification: "not_qualified", temperature: "cold",
    leadStatus: "new", verified: false, sql: false, sentToCRM: null,
    adset: "Broad Bangalore", adName: "Windsor Carousel",
    formResponses: [
      { question: "Budget range?", answer: "Below ₹60L" },
    ],
  },
  {
    id: "e-018", name: "C***** E*****", phone: "76XXX XX190", email: "c*****@gmail.com",
    campaign: "Assetz Mizumi PM R3", campaignId: "camp-7",
    createdAt: "2026-03-19T14:40:00", updatedAt: "2026-03-20T11:00:00",
    enrichmentStatus: "enriched", aiQualification: "qualified", temperature: "warm",
    leadStatus: "interested", verified: true, sql: false, sentToCRM: null,
    adset: "Whitefield HNI — 30-45", adName: "Mizumi 3BHK Carousel v2",
    formResponses: [
      { question: "Budget range?", answer: "₹1.8Cr - ₹2.2Cr" },
      { question: "Configuration?", answer: "3 BHK" },
      { question: "Timeline?", answer: "3-6 months" },
    ],
  },
  {
    id: "e-019", name: "O***** U*****", phone: "83XXX XX345", email: "o*****@hotmail.com",
    campaign: "Brigade Utopia", campaignId: "camp-2",
    createdAt: "2026-03-19T11:20:00", updatedAt: "2026-03-19T15:30:00",
    enrichmentStatus: "enriched", aiQualification: "not_qualified", temperature: "lukewarm",
    leadStatus: "contacted", verified: false, sql: false, sentToCRM: null,
    adset: "Sarjapur IT Corridor", adName: "Utopia Amenities",
    formResponses: [
      { question: "Budget range?", answer: "₹90L - ₹1.1Cr" },
      { question: "Timeline?", answer: ">12 months" },
    ],
  },
  {
    id: "e-020", name: "W***** Z*****", phone: "92XXX XX789", email: "w*****@gmail.com",
    campaign: "Godrej Splendour", campaignId: "camp-4",
    createdAt: "2026-03-19T08:00:00", updatedAt: "2026-03-19T12:45:00",
    enrichmentStatus: "enriched", aiQualification: "pending", temperature: "warm",
    leadStatus: "contacted", verified: false, sql: false, sentToCRM: null,
    adset: "Whitefield Broad", adName: "Splendour Lifestyle",
    formResponses: [
      { question: "Budget range?", answer: "₹1.2Cr - ₹1.6Cr" },
      { question: "Configuration?", answer: "2 BHK" },
    ],
  },
  {
    id: "e-021", name: "I***** Q*****", phone: "86XXX XX012", email: "i*****@gmail.com",
    campaign: "Prestige Lakeside", campaignId: "camp-1",
    createdAt: "2026-03-18T21:10:00", updatedAt: "2026-03-19T10:00:00",
    enrichmentStatus: "enriched", aiQualification: "qualified", temperature: "hot",
    leadStatus: "negotiation", verified: true, sql: true, sentToCRM: "ankit@starealtor.in",
    adset: "Whitefield HNI — 30-45", adName: "Lakeside 3BHK Carousel",
    formResponses: [
      { question: "Budget range?", answer: "₹2Cr - ₹3Cr" },
      { question: "Configuration?", answer: "3 BHK" },
      { question: "Timeline?", answer: "Immediate" },
      { question: "Current location?", answer: "HSR Layout" },
    ],
  },
  {
    id: "e-022", name: "X***** L*****", phone: "79XXX XX456", email: "x*****@yahoo.com",
    campaign: "Embassy Lake Terraces", campaignId: "camp-5",
    createdAt: "2026-03-18T16:30:00", updatedAt: "2026-03-18T16:30:00",
    enrichmentStatus: "not_enriched", aiQualification: "pending", temperature: "lukewarm",
    leadStatus: "new", verified: false, sql: false, sentToCRM: null,
    adset: "Broad Bangalore", adName: "Lake Terraces Brand",
    formResponses: [
      { question: "Budget range?", answer: "₹1.5Cr" },
    ],
  },
  {
    id: "e-023", name: "E***** H*****", phone: "81XXX XX678", email: "e*****@gmail.com",
    campaign: "Assetz Mizumi PM R3", campaignId: "camp-7",
    createdAt: "2026-03-18T13:00:00", updatedAt: "2026-03-19T09:30:00",
    enrichmentStatus: "enriched", aiQualification: "qualified", temperature: "warm",
    leadStatus: "interested", verified: true, sql: true, sentToCRM: "priya@starealtor.in",
    adset: "Sarjapur IT Corridor", adName: "Mizumi Amenities Carousel",
    formResponses: [
      { question: "Budget range?", answer: "₹1.5Cr - ₹2Cr" },
      { question: "Configuration?", answer: "3 BHK" },
      { question: "Timeline?", answer: "Within 3 months" },
    ],
  },
  {
    id: "e-024", name: "U***** F*****", phone: "77XXX XX901", email: "u*****@gmail.com",
    campaign: "Birla Tisya", campaignId: "camp-9",
    createdAt: "2026-03-18T10:20:00", updatedAt: "2026-03-18T14:00:00",
    enrichmentStatus: "enriched", aiQualification: "not_qualified", temperature: "cold",
    leadStatus: "lost", verified: false, sql: false, sentToCRM: null,
    adset: "Broad Bangalore", adName: "Tisya Carousel",
    formResponses: [
      { question: "Budget range?", answer: "Below ₹70L" },
      { question: "Timeline?", answer: "Not sure" },
    ],
  },
];

export const campaignFilterOptions = [
  "All Campaigns",
  "Prestige Lakeside",
  "Brigade Utopia",
  "Sobha Windsor",
  "Godrej Splendour",
  "Embassy Lake Terraces",
  "Assetz Mizumi PM R3",
  "Purva Atmosphere",
  "Birla Tisya",
];
