"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { DemoModeProvider } from "@/lib/demo-mode";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoModeProvider>
      <div className="min-h-screen bg-surface-page">
        <Sidebar />
        <main className="ml-sidebar">
          <div className="max-w-[1400px] mx-auto px-8 py-8">{children}</div>
        </main>
      </div>
    </DemoModeProvider>
  );
}
