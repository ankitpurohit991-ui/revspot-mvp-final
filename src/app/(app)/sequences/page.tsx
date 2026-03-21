"use client";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Clock, Plus } from "lucide-react";
import Link from "next/link";

export default function SequencesPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Agents &rsaquo; Sequences"
        title="Sequences"
        subtitle="Automated multi-step outreach sequences"
        actions={
          <Link
            href="/sequences/create"
            className="h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button flex items-center gap-2 hover:bg-accent-hover transition-colors duration-150"
          >
            <Plus size={15} strokeWidth={2} />
            Create sequence
          </Link>
        }
      />
      <EmptyState
        icon={Clock}
        title="No sequences yet"
        description="Build automated sequences to nurture leads with timed messages across multiple channels."
      />
    </>
  );
}
