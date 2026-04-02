// Workflow types — orchestrator layer connecting triggers → routing → agents → channels → post-actions

import { ChannelType, ContactOutcome, WorkflowContact } from "./common";

// ─── Workflow Status ────────────────────────────────────────────────

export type WorkflowStatus = "active" | "paused" | "draft" | "completed" | "scheduled";

// ─── Trigger ────────────────────────────────────────────────────────

export type TriggerType = "csv_upload" | "crm_webhook" | "campaign_lead" | "manual" | "workflow_trigger";

export interface WorkflowTrigger {
  type: TriggerType;
  config: {
    /** For csv_upload: file reference */
    file_ref?: string;
    /** For crm_webhook: webhook URL */
    webhook_url?: string;
    /** For campaign_lead: which campaign */
    campaign_id?: string;
    /** For workflow_trigger: source workflow ID */
    source_workflow_id?: string;
  };
}

// ─── Routing ────────────────────────────────────────────────────────

export type RoutingMode = "none" | "rules" | "ai";

export interface RoutingRule {
  id: string;
  field: string; // e.g., "lead.geo", "lead.score"
  operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains" | "in";
  value: string;
  branch_id: string; // which branch to route to
}

export interface WorkflowBranch {
  id: string;
  label: string;
  agent_id: string;
  channel: ChannelType;
  variable_overrides?: Record<string, string>; // e.g., { min_budget: "50L" }
}

export interface WorkflowRouting {
  mode: RoutingMode;
  rules?: RoutingRule[];
  ai_prompt?: string; // natural language routing instructions
  branches: WorkflowBranch[];
}

// ─── Default Step (when no routing) ─────────────────────────────────

export interface WorkflowDefaultStep {
  agent_id: string;
  channel: ChannelType;
  variable_overrides?: Record<string, string>;
}

// ─── Post-Action ────────────────────────────────────────────────────

export type PostActionMode = "rules" | "ai";

export type PostActionType =
  | "push_to_crm"
  | "send_whatsapp"
  | "notify_sales"
  | "schedule_callback"
  | "trigger_workflow"
  | "retry_call"
  | "assign_to_human"
  | "archive";

export interface ActionDef {
  type: PostActionType;
  label: string;
  description: string;
  enabled: boolean;
  config: {
    /** For trigger_workflow: target workflow ID */
    target_workflow_id?: string;
    /** For send_whatsapp: template */
    message_template?: string;
    /** For notify_sales: channel */
    notification_channel?: "slack" | "whatsapp" | "email";
    /** For schedule_callback: delay */
    callback_delay_hours?: number;
    /** For push_to_crm: status to set */
    crm_status?: string;
  };
}

export interface PostActionRule {
  id: string;
  condition: {
    field: string; // e.g., "outcome", "qualification", "extracted.budget"
    operator: "equals" | "not_equals" | "greater_than" | "less_than";
    value: string;
  };
  action_type: PostActionType;
  action_config: Record<string, string>;
}

export interface WorkflowPostAction {
  mode: PostActionMode;
  rules?: PostActionRule[];
  ai_config?: {
    prompt: string; // natural language business rules
    available_actions: ActionDef[];
    fallback_action: PostActionType; // if AI fails or is uncertain
  };
}

// ─── Schedule ───────────────────────────────────────────────────────

export interface WorkflowSchedule {
  daily_limit: number;
  active_hours: { start: string; end: string }; // "10:00" - "19:00"
  active_days: string[]; // ["Mon", "Tue", ...]
  retry: {
    enabled: boolean;
    max_retries: number;
    interval_hours: number;
  };
}

// ─── Workflow Stats ─────────────────────────────────────────────────

export interface WorkflowStats {
  totalContacts: number;
  called: number;
  connected: number;
  qualified: number;
  notQualified: number;
  callback: number;
  noAnswer: number;
}

// ─── AI Decision Log Entry ──────────────────────────────────────────

export interface AIDecisionLogEntry {
  id: string;
  contact_id: string;
  contact_name: string;
  timestamp: string;
  agent_output_summary: string;
  actions_taken: { type: PostActionType; detail: string }[];
  reasoning: string;
  confidence: number;
}

// ─── Full Workflow Type ─────────────────────────────────────────────

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;

  trigger: WorkflowTrigger;

  /** Optional routing — if absent, use default_step */
  routing?: WorkflowRouting;

  /** Single agent step (used when routing.mode === 'none' or routing is absent) */
  default_step?: WorkflowDefaultStep;

  post_action: WorkflowPostAction;

  schedule?: WorkflowSchedule;

  /** Runtime stats */
  stats?: WorkflowStats;

  /** Progress percentage (0-100) */
  progress?: number;

  createdAt: string;
}

// ─── Workflow List Item (for list views) ────────────────────────────

export interface WorkflowListItem {
  id: string;
  name: string;
  description: string;
  trigger_type: TriggerType;
  agent_names: string[]; // agents used in this workflow
  channels: ChannelType[];
  status: WorkflowStatus;
  progress: number;
  stats: WorkflowStats;
  createdAt: string;
}
