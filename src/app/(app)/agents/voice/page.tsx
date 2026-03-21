"use client";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Phone, Plus } from "lucide-react";
import Link from "next/link";

export default function VoiceAgentsPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Agents &rsaquo; Voice Agents"
        title="Voice Agents"
        subtitle="AI-powered voice agents for lead qualification and outreach"
        actions={
          <Link
            href="/agents/voice/create"
            className="h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button flex items-center gap-2 hover:bg-accent-hover transition-colors duration-150"
          >
            <Plus size={15} strokeWidth={2} />
            Create agent
          </Link>
        }
      />
      <EmptyState
        icon={Phone}
        title="No voice agents"
        description="Create AI voice agents to automatically qualify leads and handle outbound calls."
      />
    </>
  );
}
