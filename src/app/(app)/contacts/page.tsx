"use client";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Users, Plus } from "lucide-react";

export default function ContactsPage() {
  return (
    <>
      <PageHeader
        breadcrumb="CRM &rsaquo; Contacts"
        title="Contacts"
        subtitle="Your unified contact database"
        actions={
          <button className="h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button flex items-center gap-2 hover:bg-accent-hover transition-colors duration-150">
            <Plus size={15} strokeWidth={2} />
            Add contact
          </button>
        }
      />
      <EmptyState
        icon={Users}
        title="No contacts yet"
        description="Import contacts or let them flow in automatically from your campaigns and enquiries."
      />
    </>
  );
}
