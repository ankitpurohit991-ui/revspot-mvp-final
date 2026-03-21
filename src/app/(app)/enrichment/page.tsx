"use client";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Layers } from "lucide-react";

export default function EnrichmentPage() {
  return (
    <>
      <PageHeader
        breadcrumb="CRM &rsaquo; Enrichment"
        title="Enrichment"
        subtitle="Enrich your contact data with AI-powered insights"
      />
      <EmptyState
        icon={Layers}
        title="Data enrichment"
        description="Automatically enrich your contacts with company data, social profiles, and intent signals."
      />
    </>
  );
}
