import { create } from "zustand";
import type { AgentListItem } from "./types/agent";
import type { WorkflowListItem } from "./types/workflow";

export interface Campaign {
  id: string;
  name: string;
  status: "active" | "paused" | "completed" | "draft";
  platform: string;
  budget: number;
  spent: number;
  leads: number;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  campaignCount: number;
  status: "active" | "archived";
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  verified: boolean;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  tags: string[];
  createdAt: string;
}

export interface ConnectedAccount {
  id: string;
  platform: string;
  accountName: string;
  status: "connected" | "disconnected" | "error";
}

// Legacy types kept for backward compatibility
export interface VoiceAgent {
  id: string;
  name: string;
  status: "active" | "inactive" | "training";
  callsMade: number;
  successRate: number;
  createdAt: string;
}

export interface Sequence {
  id: string;
  name: string;
  steps: number;
  enrolledContacts: number;
  status: "active" | "paused" | "draft";
  createdAt: string;
}

interface AppState {
  connectedAccounts: ConnectedAccount[];
  campaigns: Campaign[];
  projects: Project[];
  leads: Lead[];
  contacts: Contact[];

  // New types
  agents: AgentListItem[];
  workflows: WorkflowListItem[];

  // Legacy (kept for backward compat with existing pages)
  voiceAgents: VoiceAgent[];
  sequences: Sequence[];

  setConnectedAccounts: (accounts: ConnectedAccount[]) => void;
  setCampaigns: (campaigns: Campaign[]) => void;
  setProjects: (projects: Project[]) => void;
  setLeads: (leads: Lead[]) => void;
  setContacts: (contacts: Contact[]) => void;
  setAgents: (agents: AgentListItem[]) => void;
  setWorkflows: (workflows: WorkflowListItem[]) => void;
  setVoiceAgents: (agents: VoiceAgent[]) => void;
  setSequences: (sequences: Sequence[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  connectedAccounts: [],
  campaigns: [],
  projects: [],
  leads: [],
  contacts: [],
  agents: [],
  workflows: [],
  voiceAgents: [],
  sequences: [],

  setConnectedAccounts: (accounts) => set({ connectedAccounts: accounts }),
  setCampaigns: (campaigns) => set({ campaigns }),
  setProjects: (projects) => set({ projects }),
  setLeads: (leads) => set({ leads }),
  setContacts: (contacts) => set({ contacts }),
  setAgents: (agents) => set({ agents }),
  setWorkflows: (workflows) => set({ workflows }),
  setVoiceAgents: (agents) => set({ voiceAgents: agents }),
  setSequences: (sequences) => set({ sequences }),
}));
