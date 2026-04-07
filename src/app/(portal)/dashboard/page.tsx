"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Platform, Ticket } from "@/lib/types";
import PortalSidebar from "@/components/PortalSidebar";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";

const sidebarItems = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "My Platform", href: "/dashboard/platform", icon: "platform" },
  { label: "Tickets", href: "/dashboard/tickets", icon: "tickets" },
  { label: "Messages", href: "/dashboard/messages", icon: "messages" },
  { label: "Reports", href: "/dashboard/reports", icon: "reports" },
  { label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export default function DashboardPage() {
  const { user, profile, loading, signOut } = useAuth("client");
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [ticketCount, setTicketCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    if (!user) return;
    const supabase = getSupabaseBrowser();

    const fetchData = async () => {
      const { data: platformData } = await supabase
        .from("platforms")
        .select("*")
        .eq("client_id", user.id)
        .limit(1)
        .single();
      if (platformData) setPlatform(platformData);

      const { count } = await supabase
        .from("tickets")
        .select("*", { count: "exact", head: true })
        .eq("client_id", user.id)
        .in("status", ["open", "in_progress"]);
      setTicketCount(count || 0);

      const { count: msgCount } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("read", false)
        .eq("is_admin", true)
        .in(
          "ticket_id",
          (
            await supabase
              .from("tickets")
              .select("id")
              .eq("client_id", user.id)
          ).data?.map((t) => t.id) || []
        );
      setUnreadCount(msgCount || 0);

      const { data: ticketsData } = await supabase
        .from("tickets")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      setTickets(ticketsData || []);
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#060608" }}>
        <div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#060608" }}>
      <PortalSidebar
        items={sidebarItems}
        userName={profile?.full_name || "Client"}
        role="Client"
        onSignOut={signOut}
      />

      <main className="flex-1 ml-60 p-8">
        {/* Welcome */}
        <div className="mb-8">
          <span className="font-mono text-blue text-xs tracking-[0.2em]">
            / DASHBOARD
          </span>
          <h1 className="font-anton text-[clamp(2rem,4vw,3.5rem)] uppercase mt-2 text-text">
            Welcome back,{" "}
            <span className="text-blue">
              {profile?.full_name?.split(" ")[0] || "there"}.
            </span>
          </h1>
          <div className="w-16 h-[2px] bg-blue mt-2" />
        </div>

        {/* Platform Hero Card */}
        {platform && (
          <div
            className="relative rounded-2xl p-6 mb-8 overflow-hidden"
            style={{
              height: "200px",
              background: "linear-gradient(135deg, rgba(0,85,255,0.08) 0%, rgba(6,6,8,0.95) 100%)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 0 40px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex items-start justify-between h-full">
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h2 className="font-anton text-4xl uppercase text-text">
                    {platform.name}
                  </h2>
                  {platform.url && (
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue text-sm hover:text-blue-light transition-colors mt-1 inline-flex items-center gap-1 font-mono"
                    >
                      {platform.url}
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M3 9L9 3M9 3H4M9 3v5" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="font-mono text-[9px] text-offwhite/40 tracking-wider uppercase">Plan</p>
                    <p className="text-text text-sm capitalize">{platform.plan || "—"}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] text-offwhite/40 tracking-wider uppercase">Uptime</p>
                    <p className="text-text text-sm">{platform.uptime_percent}%</p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] text-offwhite/40 tracking-wider uppercase">Type</p>
                    <p className="text-text text-sm capitalize">{platform.type || "—"}</p>
                  </div>
                </div>
              </div>
              <StatusBadge status={platform.status} />
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Open Tickets", value: ticketCount },
            { label: "Unread Messages", value: unreadCount },
            { label: "Platform Status", badge: platform?.status },
          ].map((stat) => (
            <div
              key={stat.label}
              className="relative rounded-2xl p-6"
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
              {stat.badge ? (
                <div className="mt-3">
                  <StatusBadge status={stat.badge} />
                </div>
              ) : (
                <p className="font-anton text-[48px] text-text mt-2 leading-none">
                  {stat.value}
                </p>
              )}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue/60 via-blue/20 to-transparent" />
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            href="/dashboard/tickets"
            className="px-5 py-2.5 bg-blue text-white text-sm font-medium tracking-wide hover:bg-blue-light transition-colors rounded-lg"
          >
            New Ticket
          </Link>
          <Link
            href="/dashboard/messages"
            className="px-5 py-2.5 border border-border/30 text-text text-sm font-medium tracking-wide hover:border-blue hover:text-blue transition-all rounded-lg"
          >
            Message Us
          </Link>
          <Link
            href="/dashboard/reports"
            className="px-5 py-2.5 border border-border/30 text-text text-sm font-medium tracking-wide hover:border-blue hover:text-blue transition-all rounded-lg"
          >
            View Reports
          </Link>
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
            className="p-5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <h3 className="font-barlow font-semibold text-text">
              Recent Tickets
            </h3>
          </div>
          {tickets.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-offwhite/40 text-sm">No tickets yet</p>
            </div>
          ) : (
            <div>
              {tickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/dashboard/tickets/${ticket.id}`}
                  className="flex items-center justify-between p-4 transition-colors duration-200"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <div>
                    <p className="text-sm text-text font-medium">
                      {ticket.title}
                    </p>
                    <p className="text-xs text-offwhite/40 mt-0.5 font-mono">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={ticket.status} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
