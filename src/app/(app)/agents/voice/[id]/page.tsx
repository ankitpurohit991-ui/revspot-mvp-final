"use client";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Phone } from "lucide-react";

export default function VoiceAgentDetailPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Agents &rsaquo; Voice Agents &rsaquo; Detail"
        title="Voice Agent Detail"
        subtitle="Monitor agent performance and call history"
      />
      <EmptyState
        icon={Phone}
        title="Agent overview"
        description="Agent performance metrics, call logs, and configuration settings will appear here."
      />
    </>
  );
}
