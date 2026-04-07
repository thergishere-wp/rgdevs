"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import PortalSidebar from "@/components/PortalSidebar";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
import gsap from "gsap";

const sidebarItems = [
  { label: "Overview", href: "/admin", icon: "overview" },
  { label: "Clients", href: "/admin/clients", icon: "clients" },
  { label: "Tickets", href: "/admin/tickets", icon: "tickets" },
  { label: "Messages", href: "/admin/messages", icon: "messages" },
  { label: "Portfolio", href: "/admin/portfolio", icon: "portfolio" },
  { label: "Reports", href: "/admin/reports", icon: "reports" },
  { label: "Contacts", href: "/admin/contacts", icon: "contacts" },
];

export default function AdminOverview() {
  const { profile, loading, signOut } = useAuth("admin");
  const [stats, setStats] = useState({
    clients: 0,
    openTickets: 0,
    activePlatforms: 0,
    newContacts: 0,
  });
  const [recentTickets, setRecentTickets] = useState<
    Array<{
      id: string;
      title: string;
      status: string;
      created_at: string;
      profiles?: { full_name: string };
    }>
  >([]);
  const numbersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const supabase = getSupabaseBrowser();

    const fetchStats = async () => {
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
      const weekAgo = new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000
      ).toISOString();
      const { count: contactCount } = await supabase
        .from("contacts")
        .select("*", { count: "exact", head: true })
        .gte("created_at", weekAgo);

      const newStats = {
        clients: clientCount || 0,
        openTickets: ticketCount || 0,
        activePlatforms: platformCount || 0,
        newContacts: contactCount || 0,
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
            if (el.parentElement) {
              gsap.to(el.parentElement, {
                textShadow:
                  "0 0 30px rgba(0,85,255,0.3), 0 0 60px rgba(0,85,255,0.1)",
                duration: 0.4,
              });
            }
          },
        });
      });

      const { data: tickets } = await supabase
        .from("tickets")
        .select("id, title, status, created_at, profiles(full_name)")
        .order("created_at", { ascending: false })
        .limit(10);
      setRecentTickets(
        (tickets as unknown as typeof recentTickets) || []
      );
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060608]">
        <div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Clients", value: stats.clients },
    { label: "Open Tickets", value: stats.openTickets },
    { label: "Platforms Live", value: stats.activePlatforms },
    { label: "New Contacts (7d)", value: stats.newContacts },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "#060608" }}>
      <PortalSidebar
        items={sidebarItems}
        userName={profile?.full_name || "Admin"}
        role="Admin"
        onSignOut={signOut}
      />
      <main className="flex-1 ml-60 p-8">
        {/* Global stats bar */}
        <div
          className="flex items-center gap-6 px-5 py-3 rounded-xl mb-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {statCards.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-offwhite/50 tracking-wider uppercase">
                {s.label}:
              </span>
              <span className="font-mono text-sm text-text font-bold">
                {s.value}
              </span>
              {i < statCards.length - 1 && (
                <span className="ml-4 w-px h-4 bg-border/30" />
              )}
            </div>
          ))}
        </div>

        {/* Page header */}
        <span className="font-mono text-blue text-xs tracking-[0.2em]">
          / ADMIN
        </span>
        <h1 className="font-anton text-[clamp(2rem,4vw,3.5rem)] uppercase mt-2 mb-2 text-text">
          Overview<span className="text-blue">.</span>
        </h1>
        <div className="w-16 h-[2px] bg-blue mb-8" />

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
                  ref={(el) => {
                    numbersRef.current[i] = el;
                  }}
                  className="font-anton text-[48px] text-text leading-none"
                >
                  0
                </span>
              </p>
              {/* Blue bottom accent */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue/60 via-blue/20 to-transparent" />
            </div>
          ))}
        </div>

        {/* Recent Tickets */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 0 40px rgba(0,0,0,0.4)",
          }}
        >
          <div
            className="p-5 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <h3 className="font-barlow font-semibold text-text">
              Recent Tickets
            </h3>
            <Link
              href="/admin/tickets"
              className="text-xs font-mono text-blue hover:text-blue-light transition-colors tracking-wider"
            >
              View All →
            </Link>
          </div>

          {/* Table header */}
          <div
            className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
          >
            <span className="font-mono text-[10px] text-offwhite/40 tracking-[0.15em] uppercase">
              Title
            </span>
            <span className="font-mono text-[10px] text-offwhite/40 tracking-[0.15em] uppercase">
              Date
            </span>
            <span className="font-mono text-[10px] text-offwhite/40 tracking-[0.15em] uppercase">
              Status
            </span>
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
                  href="/admin/tickets"
                  className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-4 transition-colors duration-200"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,0.02)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                  }}
                >
                  <div>
                    <p className="text-sm text-text font-medium">
                      {ticket.title}
                    </p>
                    <p className="text-xs text-offwhite/40 mt-0.5 font-mono">
                      {(
                        ticket.profiles as unknown as {
                          full_name: string;
                        }
                      )?.full_name || "Unknown"}
                    </p>
                  </div>
                  <span className="text-xs text-offwhite/40 font-mono self-center">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </span>
                  <div className="self-center">
                    <StatusBadge status={ticket.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
