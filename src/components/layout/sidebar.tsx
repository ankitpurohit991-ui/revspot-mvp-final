"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  FolderKanban,
  Monitor,
  Workflow,
  Image,
  Bot,
  FileText,
  Users,
  Globe,
  Plug,
  Settings,
} from "lucide-react";

const dashboardItem = { name: "Dashboard", href: "/dashboard", icon: LayoutGrid };

const navSections = [
  {
    label: "Lead Generation",
    items: [
      { name: "Projects", href: "/projects", icon: FolderKanban },
      { name: "Campaigns", href: "/campaigns", icon: Monitor },
      { name: "Workflows", href: "/workflows", icon: Workflow },
    ],
  },
  {
    label: "CRM",
    items: [
      { name: "Leads", href: "/enquiries", icon: FileText },
      { name: "Contacts", href: "/contacts", icon: Users },
    ],
  },
  {
    label: "Tools",
    items: [
      { name: "Creatives", href: "/creatives", icon: Image },
      { name: "Agents", href: "/agents", icon: Bot },
      { name: "Audiences", href: "/audiences", icon: Globe },
      { name: "Integrations", href: "/integrations", icon: Plug },
    ],
  },
];

function RevspotLogo() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="30" rx="6" fill="#1A1A1A" />
      <defs>
        <linearGradient id="r-gradient" x1="9" y1="6" x2="21" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E0E0E0" />
          <stop offset="40%" stopColor="#B0B0B0" />
          <stop offset="100%" stopColor="#808080" />
        </linearGradient>
      </defs>
      <path
        d="M10 22V8h5.5c1.2 0 2.2.35 2.95 1.05.75.7 1.05 1.6 1.05 2.7 0 .85-.2 1.55-.6 2.15-.4.55-.95.95-1.65 1.2L20.5 22h-2.8l-3-6.2h-2.2V22H10zm2.5-8.5h3c.6 0 1.05-.2 1.4-.5.35-.35.5-.8.5-1.3 0-.5-.15-.95-.5-1.25-.35-.35-.8-.5-1.4-.5h-3v3.55z"
        fill="url(#r-gradient)"
      />
    </svg>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard" || pathname === "/";
    return pathname.startsWith(href);
  };

  const navLinkClass = (href: string) =>
    `relative flex items-center gap-2.5 px-2 h-9 rounded-[6px] transition-colors duration-150 ${
      isActive(href)
        ? "bg-surface-secondary text-text-primary font-medium"
        : "text-text-secondary hover:bg-surface-secondary/60"
    }`;

  return (
    <aside className="fixed left-0 top-0 h-screen w-sidebar bg-white border-r border-border flex flex-col z-50">
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-2.5">
        <RevspotLogo />
        <span className="text-[15px] font-semibold text-text-primary">Revspot</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-1">
        {/* Dashboard — standalone at top */}
        <div className="mb-4">
          <Link href={dashboardItem.href} className={navLinkClass(dashboardItem.href)} style={{ fontSize: "13.5px" }}>
            <dashboardItem.icon size={16} strokeWidth={1.5} />
            <span>{dashboardItem.name}</span>
          </Link>
        </div>

        {/* Sections */}
        {navSections.map((section) => (
          <div key={section.label} className="mb-5">
            <div className="label-section px-2 mb-1.5">{section.label}</div>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={navLinkClass(item.href)}
                  style={{ fontSize: "13.5px" }}
                >
                  <item.icon size={16} strokeWidth={1.5} />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-border px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] rounded-full bg-surface-secondary flex items-center justify-center flex-shrink-0">
            <span className="text-[12px] font-medium text-text-secondary">GP</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-text-primary">Godrej Properties</div>
            <div className="text-[11px] text-text-tertiary truncate">demo@godrejproperties.com</div>
          </div>
          <button className="p-1 text-text-tertiary hover:text-text-secondary transition-colors">
            <Settings size={15} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </aside>
  );
}
