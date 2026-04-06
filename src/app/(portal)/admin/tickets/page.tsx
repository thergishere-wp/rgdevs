"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Ticket } from "@/lib/types";
import PortalSidebar from "@/components/PortalSidebar";
import StatusBadge from "@/components/StatusBadge";

const sidebarItems = [
  { label: "Overview", href: "/admin", icon: "overview" },
  { label: "Clients", href: "/admin/clients", icon: "clients" },
  { label: "Tickets", href: "/admin/tickets", icon: "tickets" },
  { label: "Messages", href: "/admin/messages", icon: "messages" },
  { label: "Portfolio", href: "/admin/portfolio", icon: "portfolio" },
  { label: "Reports", href: "/admin/reports", icon: "reports" },
  { label: "Contacts", href: "/admin/contacts", icon: "contacts" },
];

export default function AdminTicketsPage() {
  const { profile, loading, signOut } = useAuth("admin");
  const [tickets, setTickets] = useState<(Ticket & { profiles?: { full_name: string } })[]>([]);
  const [filter, setFilter] = useState("all");

  const fetchTickets = async () => {
    const supabase = getSupabaseBrowser();
    let q = supabase.from("tickets").select("*, profiles(full_name)").order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    setTickets(data || []);
  };

  useEffect(() => { fetchTickets(); }, [filter]);

  const updateTicket = async (id: string, updates: Partial<Ticket>) => {
    const supabase = getSupabaseBrowser();
    await supabase.from("tickets").update(updates).eq("id", id);
    fetchTickets();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen flex">
      <PortalSidebar items={sidebarItems} userName={profile?.full_name || "Admin"} role="Admin" onSignOut={signOut} />
      <main className="flex-1 ml-60 p-8">
        <span className="font-mono text-blue text-xs tracking-wider">/ TICKETS</span>
        <h1 className="font-anton text-4xl uppercase mt-2 mb-6 text-text">All <span className="text-blue">Tickets.</span></h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["all", "open", "in_progress", "resolved", "closed"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-mono tracking-wider uppercase border transition-all ${filter === f ? "bg-blue border-blue text-white" : "border-border text-offwhite hover:border-blue"}`}>
              {f.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="bg-card border border-border">
          {tickets.length === 0 ? <div className="p-12 text-center"><p className="text-offwhite text-sm">No tickets</p></div> : (
            <div className="divide-y divide-border">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="p-5 hover:bg-surface transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-text font-medium">{ticket.title}</p>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={ticket.priority} />
                      <StatusBadge status={ticket.status} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-offwhite font-mono">
                      {(ticket.profiles as unknown as { full_name: string })?.full_name || "Unknown"} · {new Date(ticket.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2">
                      <select
                        value={ticket.status}
                        onChange={(e) => updateTicket(ticket.id, { status: e.target.value as Ticket["status"] })}
                        className="bg-bg border border-border text-xs text-text px-2 py-1 focus:border-blue focus:outline-none"
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                      <select
                        value={ticket.priority}
                        onChange={(e) => updateTicket(ticket.id, { priority: e.target.value as Ticket["priority"] })}
                        className="bg-bg border border-border text-xs text-text px-2 py-1 focus:border-blue focus:outline-none"
                      >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
