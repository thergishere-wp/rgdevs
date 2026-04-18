"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import PortalSidebar from "@/components/PortalSidebar";
import StatusBadge from "@/components/StatusBadge";
import GlassCard from "@/components/GlassCard";
import Link from "next/link";
import gsap from "gsap";
import { adminSidebarItems } from "@/lib/sidebar-items";

interface RecentTicket {
  id: string;
  title: string;
  status: string;
  priority: string;
  created_at: string;
  profiles?: { full_name: string };
}

interface RecentContact {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
  platform_type?: string;
  selected_plan?: string;
}

interface PlatformInfo {
  id: string;
  name: string;
  status: string;
  uptime_percent: number;
  client_id: string;
  profiles?: { full_name: string };
}

export default function AdminOverview() {
  const { profile, loading, signOut } = useAuth("admin");
  const [stats, setStats] = useState({
    clients: 0,
    openTickets: 0,
    activePlatforms: 0,
    newContacts: 0,
    totalRevenue: 0,
    resolvedThisWeek: 0,
  });
  const [recentTickets, setRecentTickets] = useState<RecentTicket[]>([]);
  const [recentContacts, setRecentContacts] = useState<RecentContact[]>([]);
  const [platforms, setPlatforms] = useState<PlatformInfo[]>([]);
  const numbersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const supabase = getSupabaseBrowser();

    const fetchAll = async () => {
      // Stats
      const { count: clientCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "client");
      const { count: ticketCount } = await supabase
        .from("tickets")
        .select("*", { count: "exact", head: true })
        .in("status", ["open", "in_progress"]);
      const { count: platformCount } = await supabase
        .from("platforms")
        .select("*", { count: "exact", head: true })
        .eq("status", "live");
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { count: contactCount } = await supabase
        .from("contacts")
        .select("*", { count: "exact", head: true })
        .gte("created_at", weekAgo);
      const { count: resolvedCount } = await supabase
        .from("tickets")
        .select("*", { count: "exact", head: true })
        .eq("status", "resolved")
        .gte("updated_at", weekAgo);

      const newStats = {
        clients: clientCount || 0,
        openTickets: ticketCount || 0,
        activePlatforms: platformCount || 0,
        newContacts: contactCount || 0,
        totalRevenue: 0,
        resolvedThisWeek: resolvedCount || 0,
      };
      setStats(newStats);

      // Count-up animation
      const values = [
        newStats.clients,
        newStats.openTickets,
        newStats.activePlatforms,
        newStats.newContacts,
      ];
      numbersRef.current.forEach((el, i) => {
        if (!el) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: values[i],
          duration: 1.5,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = String(Math.round(obj.val));
          },
          onComplete: () => {
            el.textContent = String(values[i]);
          },
        });
      });

      // Recent tickets
      const { data: tickets } = await supabase
        .from("tickets")
        .select("id, title, status, priority, created_at, profiles(full_name)")
        .order("created_at", { ascending: false })
        .limit(8);
      setRecentTickets((tickets as unknown as RecentTicket[]) || []);

      // Recent contacts
      const { data: contacts } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      setRecentContacts(contacts || []);

      // Platforms with client info
      const { data: platformData } = await supabase
        .from("platforms")
        .select("id, name, status, uptime_percent, client_id, profiles(full_name)")
        .order("created_at", { ascending: false });
      setPlatforms((platformData as unknown as PlatformInfo[]) || []);
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060608]">
        <div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Clients", value: stats.clients, color: "#0055FF" },
    { label: "Open Tickets", value: stats.openTickets, color: stats.openTickets > 5 ? "#FF4444" : "#FFB800" },
    { label: "Platforms Live", value: stats.activePlatforms, color: "#00FF78" },
    { label: "New Leads (7d)", value: stats.newContacts, color: "#A855F7" },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "#060608" }}>
      <PortalSidebar
        items={adminSidebarItems}
        userName={profile?.full_name || "Admin"}
        role="Admin"
        onSignOut={signOut}
      />
      <main className="flex-1 ml-60 p-8">
        {/* Header with greeting */}
        <div className="mb-8">
          <span className="font-mono text-blue text-xs tracking-[0.2em]">/ MISSION CONTROL</span>
          <h1 className="font-anton text-[clamp(2rem,4vw,3.5rem)] uppercase mt-2 mb-2 text-text">
            Admin <span className="text-blue">Overview.</span>
          </h1>
          <div className="w-16 h-[2px] bg-blue" />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <div
              key={stat.label}
              className="relative rounded-2xl p-6 overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 0 40px rgba(0,0,0,0.4)",
              }}
            >
              <p className="font-mono text-[10px] text-offwhite/60 tracking-[0.2em] uppercase">
                {stat.label}
              </p>
              <p className="mt-3">
                <span
                  ref={(el) => { numbersRef.current[i] = el; }}
                  className="font-anton text-[48px] text-text leading-none"
                >
                  0
                </span>
              </p>
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(to right, ${stat.color}99, ${stat.color}33, transparent)` }}
              />
            </div>
          ))}
        </div>

        {/* Two-column: Tickets + Platforms */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          {/* Recent Tickets — wider */}
          <GlassCard noPadding className="lg:col-span-3">
            <div className="p-5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-3">
                <h3 className="font-barlow font-semibold text-text">Recent Tickets</h3>
                {stats.openTickets > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono" style={{ background: "rgba(255,184,0,0.15)", color: "#FFB800" }}>
                    {stats.openTickets} open
                  </span>
                )}
              </div>
              <Link href="/admin/tickets" className="text-xs font-mono text-blue hover:text-blue-light transition-colors tracking-wider">
                View All →
              </Link>
            </div>
            {recentTickets.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-offwhite/40 text-sm">No tickets</p>
              </div>
            ) : (
              <div>
                {recentTickets.map((ticket) => (
                  <Link
                    key={ticket.id}
                    href={`/admin/tickets/${ticket.id}`}
                    className="flex items-center justify-between px-5 py-3.5 transition-colors duration-200 hover:bg-white/[0.02]"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text font-medium truncate">{ticket.title}</p>
                      <p className="text-xs text-offwhite/40 mt-0.5 font-mono">
                        {(ticket.profiles as unknown as { full_name: string })?.full_name || "Unknown"} · {new Date(ticket.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <StatusBadge status={ticket.priority} />
                      <StatusBadge status={ticket.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Platform Health */}
          <GlassCard noPadding className="lg:col-span-2">
            <div className="p-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 className="font-barlow font-semibold text-text">Platform Health</h3>
            </div>
            {platforms.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-offwhite/40 text-sm">No platforms</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {platforms.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                    {/* Status dot */}
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{
                        background: p.status === "live" ? "#00FF78" : p.status === "building" ? "#FFB800" : "#FF4444",
                        boxShadow: p.status === "live"
                          ? "0 0 8px rgba(0,255,120,0.4)"
                          : p.status === "building"
                          ? "0 0 8px rgba(255,184,0,0.4)"
                          : "0 0 8px rgba(255,68,68,0.4)",
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text font-medium truncate">{p.name}</p>
                      <p className="text-[10px] text-offwhite/40 font-mono">
                        {(p.profiles as unknown as { full_name: string })?.full_name || "Client"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-text font-mono">{p.uptime_percent}%</p>
                      <p className="text-[9px] text-offwhite/30 font-mono uppercase">uptime</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Bottom row: Recent Contacts + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Recent Contacts / Leads */}
          <GlassCard noPadding className="lg:col-span-3">
            <div className="p-5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-3">
                <h3 className="font-barlow font-semibold text-text">Recent Leads</h3>
                {stats.newContacts > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono" style={{ background: "rgba(168,85,247,0.15)", color: "#A855F7" }}>
                    {stats.newContacts} new
                  </span>
                )}
              </div>
              <Link href="/admin/contacts" className="text-xs font-mono text-blue hover:text-blue-light transition-colors tracking-wider">
                View All →
              </Link>
            </div>
            {recentContacts.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-offwhite/40 text-sm">No leads yet</p>
              </div>
            ) : (
              <div>
                {recentContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono shrink-0"
                          style={{
                            background: contact.status === "new" ? "rgba(168,85,247,0.15)" : "rgba(255,255,255,0.05)",
                            color: contact.status === "new" ? "#A855F7" : "#888",
                          }}
                        >
                          {contact.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm text-text font-medium">{contact.name}</p>
                          <p className="text-[10px] text-offwhite/40 font-mono">{contact.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {contact.selected_plan && (
                          <span className="text-[10px] font-mono text-blue tracking-wider uppercase">{contact.selected_plan}</span>
                        )}
                        <p className="text-[10px] text-offwhite/30 font-mono mt-0.5">
                          {new Date(contact.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {contact.message && (
                      <p className="text-xs text-offwhite/50 mt-2 truncate pl-11">{contact.message}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Quick Actions + Stats */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard>
              <h3 className="font-barlow font-semibold text-text mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: "Manage Tickets", href: "/admin/tickets", icon: "→" },
                  { label: "Message Clients", href: "/admin/messages", icon: "→" },
                  { label: "Create Report", href: "/admin/reports", icon: "→" },
                  { label: "Add Portfolio", href: "/admin/portfolio", icon: "→" },
                  { label: "View Contacts", href: "/admin/contacts", icon: "→" },
                ].map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center justify-between p-3 rounded-xl text-sm text-offwhite hover:text-blue hover:bg-blue/5 transition-all duration-200"
                  >
                    <span className="font-mono text-xs tracking-wider">{action.label}</span>
                    <span className="text-blue">{action.icon}</span>
                  </Link>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="font-barlow font-semibold text-text mb-4">This Week</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-offwhite/60 font-mono">Tickets Resolved</span>
                  <span className="text-sm text-text font-mono font-bold" style={{ color: "#00FF78" }}>{stats.resolvedThisWeek}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-offwhite/60 font-mono">New Leads</span>
                  <span className="text-sm text-text font-mono font-bold" style={{ color: "#A855F7" }}>{stats.newContacts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-offwhite/60 font-mono">Open Tickets</span>
                  <span className="text-sm text-text font-mono font-bold" style={{ color: "#FFB800" }}>{stats.openTickets}</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
}
