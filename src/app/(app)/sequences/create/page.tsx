"use client";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Clock } from "lucide-react";

export default function CreateSequencePage() {
  return (
    <>
      <PageHeader
        breadcrumb="Agents &rsaquo; Sequences &rsaquo; Create"
        title="Create Sequence"
        subtitle="Design a new automated outreach sequence"
      />
      <EmptyState
        icon={Clock}
        title="Sequence builder"
        description="The sequence builder with step configuration, timing, and channel selection will appear here."
      />
    </>
  );
}
