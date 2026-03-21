"use client";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Clock } from "lucide-react";

export default function SequenceDetailPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Agents &rsaquo; Sequences &rsaquo; Detail"
        title="Sequence Detail"
        subtitle="View sequence steps and enrolled contacts"
      />
      <EmptyState
        icon={Clock}
        title="Sequence overview"
        description="Sequence steps, enrolled contacts, and performance analytics will appear here."
      />
    </>
  );
}
