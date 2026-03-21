"use client";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { FileText } from "lucide-react";

export default function EnquiriesPage() {
  return (
    <>
      <PageHeader
        breadcrumb="CRM &rsaquo; Leads"
        title="Leads"
        subtitle="Track and manage incoming leads from your campaigns"
      />
      <EmptyState
        icon={FileText}
        title="No leads yet"
        description="Leads from your campaigns and landing pages will appear here as they come in."
      />
    </>
  );
}
