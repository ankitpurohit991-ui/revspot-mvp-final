// Workflow mock data — orchestrator layer

import type {
  Workflow,
  WorkflowListItem,
  WorkflowSchedule,
  AIDecisionLogEntry,
  ActionDef,
} from "./types/workflow";
import type { WorkflowContact, ContactOutcome } from "./types/common";

// ─── Workflow List ──────────────────────────────────────────────────

export const workflowsList: WorkflowListItem[] = [
  {
    id: "wf-1",
    name: "Godrej Reflections — Lead Qualification",
    description: "Qualify inbound leads from Godrej Reflections campaign via voice calls",
    trigger_type: "csv_upload",
    agent_names: ["Priya — Qualification Agent"],
    channels: ["voice"],
    status: "active",
    progress: 70.2,
    stats: {
      totalContacts: 487,
      called: 342,
      connected: 268,
      qualified: 89,
      notQualified: 142,
      callback: 37,
      noAnswer: 74,
    },
    createdAt: "2026-03-18",
  },
  {
    id: "wf-2",
    name: "Godrej Eternity — Re-engagement",
    description: "Re-engage cold leads from Godrej Eternity campaign",
    trigger_type: "csv_upload",
    agent_names: ["Arjun — Follow-up Agent"],
    channels: ["voice"],
    status: "completed",
    progress: 100,
    stats: {
      totalContacts: 215,
      called: 215,
      connected: 178,
      qualified: 52,
      notQualified: 98,
      callback: 28,
      noAnswer: 37,
    },
    createdAt: "2026-03-10",
  },
  {
    id: "wf-3",
    name: "Godrej Air — Site Visit Follow-up",
    description: "Follow up with leads who showed interest in site visits",
    trigger_type: "csv_upload",
    agent_names: ["Priya — Qualification Agent"],
    channels: ["voice"],
    status: "scheduled",
    progress: 0,
    stats: {
      totalContacts: 64,
      called: 0,
      connected: 0,
      qualified: 0,
      notQualified: 0,
      callback: 0,
      noAnswer: 0,
    },
    createdAt: "2026-03-22",
  },
  {
    id: "wf-4",
    name: "Scripbox — Quality-Based Routing",
    description: "Route high-quality leads to humans, others to AI agent for onboarding",
    trigger_type: "crm_webhook",
    agent_names: ["Priya — Qualification Agent", "Arjun — Follow-up Agent"],
    channels: ["voice", "whatsapp"],
    status: "active",
    progress: 45.5,
    stats: {
      totalContacts: 320,
      called: 146,
      connected: 112,
      qualified: 48,
      notQualified: 39,
      callback: 15,
      noAnswer: 34,
    },
    createdAt: "2026-03-20",
  },
];

// ─── Full Workflow Detail (for wf-1) ────────────────────────────────

export const workflowDetail: Workflow = {
  id: "wf-1",
  name: "Godrej Reflections — Lead Qualification",
  description: "Qualify inbound leads from Godrej Reflections campaign via voice calls",
  status: "active",
  trigger: {
    type: "csv_upload",
    config: { file_ref: "godrej_reflections_leads_mar2026.csv" },
  },
  default_step: {
    agent_id: "va-1",
    channel: "voice",
  },
  post_action: {
    mode: "ai",
    ai_config: {
      prompt:
        "Push qualified leads to CRM immediately. If the lead requested a callback, notify the sales team on WhatsApp with the lead details. If no answer after 2 retries, archive. If the lead expressed interest but didn't fully qualify, schedule a callback in 2 days.",
      available_actions: [
        {
          type: "push_to_crm",
          label: "Push to CRM",
          description: "Auto-sync qualified leads to GoHighLevel",
          enabled: true,
          config: { crm_status: "qualified" },
        },
        {
          type: "send_whatsapp",
          label: "Send WhatsApp to Lead",
          description: "Send a follow-up message to the lead",
          enabled: true,
          config: { message_template: "Thanks for your interest in Godrej Reflections!" },
        },
        {
          type: "notify_sales",
          label: "Notify Sales Team",
          description: "Alert sales rep via WhatsApp",
          enabled: true,
          config: { notification_channel: "whatsapp" },
        },
        {
          type: "schedule_callback",
          label: "Schedule Callback",
          description: "Schedule a follow-up call",
          enabled: true,
          config: { callback_delay_hours: 48 },
        },
        {
          type: "retry_call",
          label: "Retry Call",
          description: "Retry unanswered calls",
          enabled: false,
          config: {},
        },
        {
          type: "archive",
          label: "Archive",
          description: "Mark as archived / no further action",
          enabled: true,
          config: {},
        },
      ],
      fallback_action: "notify_sales",
    },
  },
  schedule: {
    daily_limit: 200,
    active_hours: { start: "10:00", end: "19:00" },
    active_days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    retry: { enabled: true, max_retries: 2, interval_hours: 4 },
  },
  stats: {
    totalContacts: 487,
    called: 342,
    connected: 268,
    qualified: 89,
    notQualified: 142,
    callback: 37,
    noAnswer: 74,
  },
  progress: 70.2,
  createdAt: "2026-03-18",
};

// ─── Workflow with Routing (for wf-4 — Scripbox pattern) ────────────

export const workflowWithRouting: Workflow = {
  id: "wf-4",
  name: "Scripbox — Quality-Based Routing",
  description: "Route high-quality leads to humans, others to AI agent for onboarding",
  status: "active",
  trigger: {
    type: "crm_webhook",
    config: { webhook_url: "https://api.revspot.io/webhooks/scripbox-leads" },
  },
  routing: {
    mode: "ai",
    ai_prompt:
      "Route leads based on their quality score. If the lead has a quality score of 80 or above, assign to a human sales rep (Path A). If the score is between 50-79, route to Priya qualification agent on voice (Path B). If below 50, route to Arjun follow-up agent on WhatsApp (Path C).",
    branches: [
      {
        id: "br-1",
        label: "High Quality (80+) → Human",
        agent_id: "human",
        channel: "voice",
      },
      {
        id: "br-2",
        label: "Medium Quality (50-79) → AI Voice",
        agent_id: "va-1",
        channel: "voice",
        variable_overrides: { min_budget: "50L" },
      },
      {
        id: "br-3",
        label: "Low Quality (<50) → AI WhatsApp",
        agent_id: "va-2",
        channel: "whatsapp",
      },
    ],
  },
  post_action: {
    mode: "ai",
    ai_config: {
      prompt:
        "If qualified, push to CRM and send a WhatsApp confirmation to the lead. If assigned to human and they completed the call, notify the manager. For WhatsApp leads that don't respond within 24 hours, schedule a voice callback.",
      available_actions: [
        {
          type: "push_to_crm",
          label: "Push to CRM",
          description: "Sync to CRM",
          enabled: true,
          config: {},
        },
        {
          type: "send_whatsapp",
          label: "Send WhatsApp",
          description: "Send WhatsApp to lead",
          enabled: true,
          config: {},
        },
        {
          type: "notify_sales",
          label: "Notify Manager",
          description: "Alert manager",
          enabled: true,
          config: { notification_channel: "slack" },
        },
        {
          type: "schedule_callback",
          label: "Schedule Callback",
          description: "Schedule voice callback",
          enabled: true,
          config: { callback_delay_hours: 24 },
        },
        {
          type: "assign_to_human",
          label: "Assign to Human",
          description: "Route to human agent",
          enabled: true,
          config: {},
        },
        {
          type: "archive",
          label: "Archive",
          description: "No further action",
          enabled: true,
          config: {},
        },
      ],
      fallback_action: "notify_sales",
    },
  },
  stats: {
    totalContacts: 320,
    called: 146,
    connected: 112,
    qualified: 48,
    notQualified: 39,
    callback: 15,
    noAnswer: 34,
  },
  progress: 45.5,
  createdAt: "2026-03-20",
};

// ─── Contacts (reused from outreach, same data) ─────────────────────

export const workflowContacts: WorkflowContact[] = [
  {
    id: "wc-1",
    name: "Ramesh K*****",
    phone: "98XXX XX123",
    outcome: "qualified",
    duration: "4:12",
    qualification: "qualified",
    verified: true,
    keyNotes: "Budget ₹1.8Cr, wants 3BHK, can visit this weekend",
    calledAt: "2026-03-21T14:32:00",
    aiDecision: {
      actions_taken: ["push_to_crm", "send_whatsapp"],
      reasoning:
        "Lead is qualified with budget ₹1.8Cr (above ₹1Cr threshold) and timeline of 3 months. Pushing to CRM and sending WhatsApp with site visit link.",
      confidence: 0.94,
    },
  },
  {
    id: "wc-2",
    name: "Sunita P*****",
    phone: "90XXX XX456",
    outcome: "qualified",
    duration: "3:32",
    qualification: "qualified",
    verified: true,
    keyNotes: "NRI investor, budget ₹2Cr+, interested in rental yield",
    calledAt: "2026-03-21T14:18:00",
    aiDecision: {
      actions_taken: ["push_to_crm", "notify_sales"],
      reasoning:
        "High-value NRI lead with ₹2Cr+ budget. Pushing to CRM and notifying sales team — NRI leads need personalized follow-up for documentation.",
      confidence: 0.97,
    },
  },
  {
    id: "wc-3",
    name: "Vikram S*****",
    phone: "87XXX XX789",
    outcome: "not_qualified",
    duration: "2:06",
    qualification: "not_qualified",
    verified: false,
    keyNotes: "Budget below ₹80L, looking for 1BHK",
    calledAt: "2026-03-21T13:55:00",
    aiDecision: {
      actions_taken: ["archive"],
      reasoning:
        "Lead budget (₹80L) is significantly below the ₹1Cr minimum threshold. Looking for 1BHK which is not in our luxury portfolio. Archiving.",
      confidence: 0.92,
    },
  },
  {
    id: "wc-4",
    name: "Ananya R*****",
    phone: "91XXX XX234",
    outcome: "callback",
    duration: "0:48",
    qualification: undefined,
    verified: false,
    keyNotes: "Asked to call back after 5 PM",
    calledAt: "2026-03-21T13:40:00",
    aiDecision: {
      actions_taken: ["schedule_callback"],
      reasoning:
        "Lead requested callback after 5 PM. Scheduling callback for today at 5:15 PM to respect their preferred time.",
      confidence: 0.99,
    },
  },
  {
    id: "wc-5",
    name: "Deepak M*****",
    phone: "80XXX XX567",
    outcome: "no_answer",
    duration: undefined,
    qualification: undefined,
    verified: false,
    keyNotes: "",
    calledAt: "2026-03-21T13:22:00",
    aiDecision: {
      actions_taken: ["retry_call"],
      reasoning: "No answer on first attempt. Scheduling retry in 4 hours as per workflow policy.",
      confidence: 0.88,
    },
  },
  {
    id: "wc-6",
    name: "Kavitha L*****",
    phone: "99XXX XX890",
    outcome: "qualified",
    duration: "5:06",
    qualification: "qualified",
    verified: true,
    keyNotes: "Family of 4, upgrading from 2BHK, timeline 3 months",
    calledAt: "2026-03-21T12:50:00",
    aiDecision: {
      actions_taken: ["push_to_crm", "send_whatsapp", "notify_sales"],
      reasoning:
        "Strong qualified lead — family upgrading with clear 3-month timeline. Pushing to CRM, sending site visit details via WhatsApp, and notifying sales for priority follow-up.",
      confidence: 0.96,
    },
  },
  {
    id: "wc-7",
    name: "Prashant G*****",
    phone: "96XXX XX345",
    outcome: "not_qualified",
    duration: "1:48",
    qualification: "not_qualified",
    verified: false,
    keyNotes: "Timeline > 2 years, just browsing",
    calledAt: "2026-03-21T12:35:00",
    aiDecision: {
      actions_taken: ["send_whatsapp"],
      reasoning:
        "Lead has a long timeline (2+ years) and is just browsing. Not qualified for immediate follow-up, but sending a WhatsApp with project brochure to keep them warm.",
      confidence: 0.85,
    },
  },
  {
    id: "wc-8",
    name: "Meera T*****",
    phone: "88XXX XX678",
    outcome: "not_qualified",
    duration: "2:24",
    qualification: "not_qualified",
    verified: false,
    keyNotes: "Not decision maker, will check with spouse",
    calledAt: "2026-03-21T12:10:00",
    aiDecision: {
      actions_taken: ["schedule_callback"],
      reasoning:
        "Lead isn't the primary decision maker but showed interest. Scheduling callback in 2 days to allow time for spousal discussion.",
      confidence: 0.78,
    },
  },
  {
    id: "wc-9",
    name: "Arun V*****",
    phone: "70XXX XX901",
    outcome: "wrong_number",
    duration: "0:18",
    qualification: undefined,
    verified: false,
    keyNotes: "Wrong number",
    calledAt: "2026-03-21T11:55:00",
    aiDecision: {
      actions_taken: ["archive"],
      reasoning: "Wrong number confirmed. Archiving contact — no further action needed.",
      confidence: 0.99,
    },
  },
  {
    id: "wc-10",
    name: "Lakshmi N*****",
    phone: "85XXX XX012",
    outcome: "not_called",
    duration: undefined,
    qualification: undefined,
    verified: false,
    keyNotes: "",
    calledAt: undefined,
  },
];

// ─── AI Decision Log ────────────────────────────────────────────────

export const aiDecisionLog: AIDecisionLogEntry[] = workflowContacts
  .filter((c) => c.aiDecision)
  .map((c) => ({
    id: `log-${c.id}`,
    contact_id: c.id,
    contact_name: c.name,
    timestamp: c.calledAt || "",
    agent_output_summary: c.keyNotes || c.outcome,
    actions_taken: c.aiDecision!.actions_taken.map((type) => ({
      type: type as any,
      detail: "",
    })),
    reasoning: c.aiDecision!.reasoning,
    confidence: c.aiDecision!.confidence,
  }));

// ─── Disqualification Reasons ───────────────────────────────────────

export const disqualReasons = [
  { reason: "Budget below ₹1Cr", percentage: 38 },
  { reason: "Timeline > 12 months", percentage: 26 },
  { reason: "Not decision maker", percentage: 18 },
  { reason: "Already purchased", percentage: 11 },
  { reason: "Not interested", percentage: 7 },
];

// ─── Workflow Purposes ──────────────────────────────────────────────

export const workflowPurposes = [
  "Lead Qualification",
  "Follow-up",
  "Survey",
  "Re-engagement",
  "Onboarding",
];

// ─── CSV Preview Mock ───────────────────────────────────────────────

export const csvPreviewHeaders = ["Name", "Phone", "Email", "Source", "Budget"];
export const csvPreviewRows = [
  ["Ramesh Kumar", "9876543210", "ramesh@gmail.com", "Meta Lead", "₹1.5Cr"],
  ["Sunita Patel", "9012345678", "sunita@yahoo.com", "Website", "₹2Cr"],
  ["Vikram Singh", "8765432109", "vikram@outlook.com", "Meta Lead", "₹80L"],
  ["Ananya Rao", "9123456780", "ananya@gmail.com", "Referral", "₹1.8Cr"],
  ["Deepak Menon", "8012345679", "deepak@gmail.com", "Meta Lead", "₹1.2Cr"],
];

// ─── Available Trigger Types ────────────────────────────────────────

export const triggerTypes = [
  { type: "csv_upload" as const, label: "CSV Upload", description: "Upload a contact list", comingSoon: false },
  {
    type: "crm_webhook" as const,
    label: "CRM Webhook",
    description: "Trigger when a lead enters your CRM",
    comingSoon: true,
  },
  {
    type: "campaign_lead" as const,
    label: "Campaign Lead",
    description: "Select a campaign to trigger this workflow when a new lead arrives",
    comingSoon: false,
  },
  {
    type: "manual" as const,
    label: "Manually (API)",
    description: "Get an API endpoint to trigger this workflow programmatically",
    comingSoon: false,
  },
  {
    type: "workflow_trigger" as const,
    label: "From Another Workflow",
    description: "Triggered by another workflow's post-action",
    comingSoon: true,
  },
];

// ─── Available Post-Actions ─────────────────────────────────────────

export const availableActions: ActionDef[] = [
  {
    type: "push_to_crm",
    label: "Push to CRM",
    description: "Auto-sync leads to your connected CRM",
    enabled: true,
    config: {},
  },
  {
    type: "send_whatsapp",
    label: "Send WhatsApp",
    description: "Send a WhatsApp message to the lead",
    enabled: true,
    config: {},
  },
  {
    type: "notify_sales",
    label: "Notify Sales Team",
    description: "Alert your sales team via Slack or WhatsApp",
    enabled: true,
    config: {},
  },
  {
    type: "schedule_callback",
    label: "Schedule Callback",
    description: "Schedule a follow-up call",
    enabled: true,
    config: {},
  },
  {
    type: "trigger_workflow",
    label: "Trigger Another Workflow",
    description: "Start another workflow for this lead",
    enabled: false,
    config: {},
  },
  {
    type: "retry_call",
    label: "Retry Call",
    description: "Retry unanswered calls",
    enabled: false,
    config: {},
  },
  {
    type: "assign_to_human",
    label: "Assign to Human",
    description: "Route to a human agent",
    enabled: false,
    config: {},
  },
  {
    type: "archive",
    label: "Archive",
    description: "No further action needed",
    enabled: false,
    config: {},
  },
];
