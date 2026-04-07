"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "./ThemeProvider";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

interface PortalSidebarProps {
  items: NavItem[];
  userName: string;
  role: string;
  onSignOut: () => void;
}

const icons: Record<string, JSX.Element> = {
  dashboard: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  platform: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 14h6M8 11v3" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  tickets: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  messages: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 3h12v8H4l-2 2V3z" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  reports: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 13V7M8 13V3M12 13V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  settings: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  clients: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  portfolio: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="3" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 3V2a1 1 0 011-1h4a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  contacts: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 6h6M5 8h4M5 10h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  overview: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
};

export default function PortalSidebar({
  items,
  userName,
  role,
  onSignOut,
}: PortalSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-60 flex flex-col z-50"
      style={{
        background: "rgba(12,12,16,0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo — navigate home without signing out */}
      <div className="p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <button
          onClick={() => router.push("/")}
          className="text-lg font-anton tracking-tight uppercase"
        >
          <span className="text-text">RG</span>
          <span className="text-blue">.</span>
          <span className="text-text">DEVS</span>
        </button>
        <p className="font-mono text-[10px] text-offwhite tracking-[0.2em] uppercase mt-1">
          {role} Portal
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              item.href !== "/admin" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-blue border-l-[3px] border-blue"
                  : "text-offwhite hover:text-text border-l-[3px] border-transparent"
              }`}
              style={{
                background: isActive
                  ? "rgba(0,85,255,0.08)"
                  : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }
              }}
            >
              <span className="shrink-0">
                {icons[item.icon] || icons.dashboard}
              </span>
              <span className="font-mono text-[11px] tracking-[0.15em] uppercase">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 space-y-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 text-offwhite hover:text-text transition-colors w-full px-3 py-2 rounded-lg"
          style={{ background: "transparent" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          <span className="text-xs">{theme === "dark" ? "☀" : "☾"}</span>
          <span className="font-mono text-[10px] tracking-[0.2em]">
            {theme === "dark" ? "LIGHT" : "DARK"}
          </span>
        </button>

        {/* User info */}
        <div className="px-3 flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono text-blue"
            style={{
              background: "rgba(0,85,255,0.12)",
              border: "1px solid rgba(0,85,255,0.2)",
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-text truncate">{userName}</p>
            <span
              className="inline-block text-[9px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded mt-0.5"
              style={{
                background: role === "Admin" ? "rgba(0,85,255,0.12)" : "rgba(0,255,120,0.12)",
                color: role === "Admin" ? "#4488FF" : "#00FF78",
              }}
            >
              {role}
            </span>
          </div>
        </div>

        <button
          onClick={onSignOut}
          className="w-full text-left px-3 py-2 text-[10px] font-mono text-offwhite/50 hover:text-red-400 transition-colors tracking-[0.15em] uppercase rounded-lg"
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
