"use client";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Activity } from "lucide-react";

export default function OutreachDetailPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Lead Generation &rsaquo; Outreach &rsaquo; Detail"
        title="Outreach Detail"
        subtitle="View outreach results and engagement metrics"
      />
      <EmptyState
        icon={Activity}
        title="Outreach results"
        description="Outreach performance, response rates, and detailed results will appear here."
      />
    </>
  );
}
