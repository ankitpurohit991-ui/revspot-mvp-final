"use client";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { MessageCircle } from "lucide-react";

export default function WhatsAppAgentsPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Agents &rsaquo; WhatsApp Agents"
        title="WhatsApp Agents"
        subtitle="AI-powered WhatsApp agents for lead engagement"
      />
      <EmptyState
        icon={MessageCircle}
        title="Coming soon"
        description="WhatsApp agents are under development. You'll be able to create AI agents that engage leads through WhatsApp conversations."
      />
    </>
  );
}
