"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Platform, Ticket } from "@/lib/types";
import PortalSidebar from "@/components/PortalSidebar";
import StatusBadge from "@/components/StatusBadge";
import GlassCard from "@/components/GlassCard";
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
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

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
          <span className="font-mono text-blue text-xs tracking-[0.2em]">/ YOUR PORTAL</span>
          <h1 className="font-anton text-[clamp(2rem,4vw,3.5rem)] uppercase mt-2 text-text">
            {greeting},{" "}
            <span className="text-blue">
              {profile?.full_name?.split(" ")[0] || "there"}.
            </span>
          </h1>
          <div className="w-16 h-[2px] bg-blue mt-2" />
        </div>

        {/* Platform Hero Card */}
        {platform ? (
          <div
            className="relative rounded-2xl p-8 mb-8 overflow-hidden"
            style={{
              minHeight: "200px",
              background: "linear-gradient(135deg, rgba(0,85,255,0.12) 0%, rgba(6,6,8,0.95) 60%, rgba(0,255,120,0.03) 100%)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 0 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }} />

            <div className="relative flex items-start justify-between h-full">
              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-anton text-4xl uppercase text-text">{platform.name}</h2>
                    <StatusBadge status={platform.status} />
                  </div>
                  {platform.url && (
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue text-sm hover:text-blue-light transition-colors inline-flex items-center gap-1 font-mono"
                    >
                      {platform.url}
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M3 9L9 3M9 3H4M9 3v5" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-8">
                  <div>
                    <p className="font-mono text-[9px] text-offwhite/40 tracking-wider uppercase">Plan</p>
                    <p className="text-text text-lg font-barlow font-semibold capitalize">{platform.plan || "—"}</p>
                  </div>
                  <div className="w-px h-8" style={{ background: "rgba(255,255,255,0.06)" }} />
                  <div>
                    <p className="font-mono text-[9px] text-offwhite/40 tracking-wider uppercase">Uptime</p>
                    <p className="text-lg font-barlow font-semibold" style={{ color: "#00FF78" }}>{platform.uptime_percent}%</p>
                  </div>
                  <div className="w-px h-8" style={{ background: "rgba(255,255,255,0.06)" }} />
                  <div>
                    <p className="font-mono text-[9px] text-offwhite/40 tracking-wider uppercase">Type</p>
                    <p className="text-text text-lg font-barlow font-semibold capitalize">{platform.type || "—"}</p>
                  </div>
                  {platform.next_billing && (
                    <>
                      <div className="w-px h-8" style={{ background: "rgba(255,255,255,0.06)" }} />
                      <div>
                        <p className="font-mono text-[9px] text-offwhite/40 tracking-wider uppercase">Next Billing</p>
                        <p className="text-text text-lg font-barlow font-semibold">{new Date(platform.next_billing).toLocaleDateString()}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <GlassCard className="mb-8">
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(0,85,255,0.1)" }}>
                <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="12" height="9" rx="1" stroke="#0055FF" strokeWidth="1.2" />
                  <path d="M5 14h6M8 11v3" stroke="#0055FF" strokeWidth="1.2" />
                </svg>
              </div>
              <h3 className="font-barlow font-semibold text-lg text-text mb-2">Your Platform is Being Set Up</h3>
              <p className="text-offwhite text-sm">We&apos;re working on getting everything ready for you. We&apos;ll notify you when it&apos;s live.</p>
            </div>
          </GlassCard>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] text-offwhite/60 tracking-[0.2em] uppercase">Open Tickets</p>
                <p className="font-anton text-[48px] text-text mt-2 leading-none">{ticketCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,184,0,0.1)" }}>
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h12M2 8h12M2 12h8" stroke="#FFB800" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-yellow-500/60 via-yellow-500/20 to-transparent" />
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] text-offwhite/60 tracking-[0.2em] uppercase">Unread Messages</p>
                <p className="font-anton text-[48px] text-text mt-2 leading-none">{unreadCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,85,255,0.1)" }}>
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                  <path d="M2 3h12v8H4l-2 2V3z" stroke="#0055FF" strokeWidth="1.2" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue/60 via-blue/20 to-transparent" />
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] text-offwhite/60 tracking-[0.2em] uppercase">Platform Status</p>
                <div className="mt-3">
                  <StatusBadge status={platform?.status || "building"} />
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,255,120,0.1)" }}>
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="#00FF78" strokeWidth="1.2" />
                  <path d="M5 8l2 2 4-4" stroke="#00FF78" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-green-500/60 via-green-500/20 to-transparent" />
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            href="/dashboard/tickets"
            className="px-5 py-2.5 bg-blue text-white text-sm font-medium tracking-wide hover:bg-blue-light transition-colors rounded-lg"
          >
            + New Ticket
          </Link>
          <Link
            href="/dashboard/messages"
            className="px-5 py-2.5 border text-text text-sm font-medium tracking-wide hover:border-blue hover:text-blue transition-all rounded-lg"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            💬 Message Us
          </Link>
          <Link
            href="/dashboard/platform"
            className="px-5 py-2.5 border text-text text-sm font-medium tracking-wide hover:border-blue hover:text-blue transition-all rounded-lg"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            🖥 Platform Details
          </Link>
          <Link
            href="/dashboard/reports"
            className="px-5 py-2.5 border text-text text-sm font-medium tracking-wide hover:border-blue hover:text-blue transition-all rounded-lg"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            📊 View Reports
          </Link>
        </div>

        {/* Recent Tickets */}
        <GlassCard noPadding>
          <div className="p-5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 className="font-barlow font-semibold text-text">Recent Tickets</h3>
            <Link href="/dashboard/tickets" className="text-xs font-mono text-blue hover:text-blue-light transition-colors tracking-wider">
              View All →
            </Link>
          </div>
          {tickets.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-offwhite/40 text-sm">No tickets yet — create one if you need help!</p>
            </div>
          ) : (
            <div>
              {tickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/dashboard/tickets/${ticket.id}`}
                  className="flex items-center justify-between px-5 py-3.5 transition-colors duration-200 hover:bg-white/[0.02]"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <div>
                    <p className="text-sm text-text font-medium">{ticket.title}</p>
                    <p className="text-xs text-offwhite/40 mt-0.5 font-mono">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={ticket.priority} />
                    <StatusBadge status={ticket.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </GlassCard>
      </main>
    </div>
  );
}
