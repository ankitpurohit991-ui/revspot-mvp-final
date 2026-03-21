"use client";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Image as ImageIcon, Plus } from "lucide-react";

export default function CreativesPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Lead Generation &rsaquo; Creatives"
        title="Creatives"
        subtitle="Manage your ad creatives and design assets"
        actions={
          <button className="h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button flex items-center gap-2 hover:bg-accent-hover transition-colors duration-150">
            <Plus size={15} strokeWidth={2} />
            Upload creative
          </button>
        }
      />
      <EmptyState
        icon={ImageIcon}
        title="No creatives yet"
        description="Upload ad creatives, images, and videos to use across your campaigns."
      />
    </>
  );
}
