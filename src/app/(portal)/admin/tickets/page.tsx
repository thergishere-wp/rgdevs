"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Ticket } from "@/lib/types";
import PortalSidebar from "@/components/PortalSidebar";
import StatusBadge from "@/components/StatusBadge";
import GlassCard from "@/components/GlassCard";
import Link from "next/link";
import { adminSidebarItems } from "@/lib/sidebar-items";

interface TicketWithMeta extends Omit<Ticket, "profiles"> {
  profiles?: { full_name: string | null };
  message_count?: number;
}

export default function AdminTicketsPage() {
  const { profile, loading, signOut } = useAuth("admin");
  const [tickets, setTickets] = useState<TicketWithMeta[]>([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "priority">("newest");

  const fetchTickets = async () => {
    const supabase = getSupabaseBrowser();
    let q = supabase
      .from("tickets")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: sortBy === "oldest" });
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    let result = (data || []) as TicketWithMeta[];

    // Sort by priority if selected
    if (sortBy === "priority") {
      const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
      result = result.sort(
        (a, b) =>
          (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2)
      );
    }

    setTickets(result);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchTickets(); }, [filter, sortBy]);

  const filteredTickets = tickets.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ((t.profiles as unknown as { full_name: string })?.full_name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const statusCounts = tickets.reduce(
    (acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const getTicketAge = (created: string) => {
    const days = Math.floor(
      (Date.now() - new Date(created).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days === 0) return "Today";
    if (days === 1) return "1d ago";
    return `${days}d ago`;
  };

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
        items={adminSidebarItems}
        userName={profile?.full_name || "Admin"}
        role="Admin"
        onSignOut={signOut}
      />
      <main className="flex-1 ml-60 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="font-mono text-blue text-xs tracking-wider">/ TICKETS</span>
            <h1 className="font-anton text-4xl uppercase mt-2 text-text">
              All <span className="text-blue">Tickets.</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-offwhite/40">
              {filteredTickets.length} ticket{filteredTickets.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-4 mb-6">
          {["open", "in_progress", "resolved", "closed"].map((s) => (
            <div
              key={s}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{
                background:
                  filter === s ? "rgba(0,85,255,0.1)" : "rgba(255,255,255,0.02)",
                border:
                  filter === s
                    ? "1px solid rgba(0,85,255,0.3)"
                    : "1px solid rgba(255,255,255,0.05)",
                cursor: "pointer",
              }}
              onClick={() => setFilter(filter === s ? "all" : s)}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background:
                    s === "open"
                      ? "#FFB800"
                      : s === "in_progress"
                      ? "#4488FF"
                      : s === "resolved"
                      ? "#00FF78"
                      : "#888",
                }}
              />
              <span className="text-xs font-mono text-offwhite/70 capitalize">
                {s.replace("_", " ")}
              </span>
              <span className="text-xs font-mono text-text font-bold">
                {statusCounts[s] || 0}
              </span>
            </div>
          ))}
        </div>

        {/* Search + Sort */}
        <div className="flex items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Search tickets by title or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 text-sm text-text placeholder:text-offwhite/30 focus:outline-none rounded-xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2.5 text-xs text-text rounded-xl focus:outline-none"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        {/* Table header */}
        <div
          className="grid grid-cols-[1fr_120px_80px_80px_80px_60px] gap-4 px-5 py-3 rounded-t-2xl"
          style={{
            background: "rgba(255,255,255,0.02)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span className="font-mono text-[10px] text-offwhite/40 tracking-[0.15em] uppercase">
            Ticket
          </span>
          <span className="font-mono text-[10px] text-offwhite/40 tracking-[0.15em] uppercase">
            Client
          </span>
          <span className="font-mono text-[10px] text-offwhite/40 tracking-[0.15em] uppercase">
            Priority
          </span>
          <span className="font-mono text-[10px] text-offwhite/40 tracking-[0.15em] uppercase">
            Status
          </span>
          <span className="font-mono text-[10px] text-offwhite/40 tracking-[0.15em] uppercase">
            Age
          </span>
          <span className="font-mono text-[10px] text-offwhite/40 tracking-[0.15em] uppercase">
            View
          </span>
        </div>

        <GlassCard noPadding className="rounded-t-none">
          {filteredTickets.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-offwhite/40 text-sm">
                {searchQuery ? "No tickets match your search" : "No tickets"}
              </p>
            </div>
          ) : (
            <div>
              {filteredTickets.map((ticket) => {
                const clientName =
                  (ticket.profiles as unknown as { full_name: string })
                    ?.full_name || "Unknown";
                const age = getTicketAge(ticket.created_at);
                const ageColor =
                  age.includes("Today") || age === "1d ago"
                    ? "#00FF78"
                    : parseInt(age) > 7
                    ? "#FF4444"
                    : parseInt(age) > 3
                    ? "#FFB800"
                    : "#888";

                return (
                  <Link
                    key={ticket.id}
                    href={`/admin/tickets/${ticket.id}`}
                    className="grid grid-cols-[1fr_120px_80px_80px_80px_60px] gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors duration-200 items-center"
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-text font-medium truncate">
                        {ticket.title}
                      </p>
                      {ticket.description && (
                        <p className="text-[11px] text-offwhite/40 truncate mt-0.5">
                          {ticket.description}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-offwhite font-mono truncate">
                      {clientName}
                    </span>
                    <StatusBadge status={ticket.priority} />
                    <StatusBadge status={ticket.status} />
                    <span
                      className="text-xs font-mono"
                      style={{ color: ageColor }}
                    >
                      {age}
                    </span>
                    <span className="text-blue text-xs font-mono">→</span>
                  </Link>
                );
              })}
            </div>
          )}
        </GlassCard>
      </main>
    </div>
  );
}
