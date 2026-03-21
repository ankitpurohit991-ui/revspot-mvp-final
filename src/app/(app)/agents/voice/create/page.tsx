"use client";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Phone } from "lucide-react";

export default function CreateVoiceAgentPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Agents &rsaquo; Voice Agents &rsaquo; Create"
        title="Create Voice Agent"
        subtitle="Configure a new AI voice agent"
      />
      <EmptyState
        icon={Phone}
        title="Agent builder"
        description="Voice agent configuration with script setup, voice selection, and call flow design will appear here."
      />
    </>
  );
}
