"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import PortalSidebar from "@/components/PortalSidebar";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";

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
  const [stats, setStats] = useState({ clients: 0, openTickets: 0, activePlatforms: 0, newContacts: 0 });
  const [recentTickets, setRecentTickets] = useState<Array<{ id: string; title: string; status: string; created_at: string; profiles?: { full_name: string } }>>([]);

  useEffect(() => {
    const supabase = getSupabaseBrowser();

    const fetchStats = async () => {
      const { count: clientCount } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "client");
      const { count: ticketCount } = await supabase.from("tickets").select("*", { count: "exact", head: true }).in("status", ["open", "in_progress"]);
      const { count: platformCount } = await supabase.from("platforms").select("*", { count: "exact", head: true }).eq("status", "live");
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { count: contactCount } = await supabase.from("contacts").select("*", { count: "exact", head: true }).gte("created_at", weekAgo);

      setStats({
        clients: clientCount || 0,
        openTickets: ticketCount || 0,
        activePlatforms: platformCount || 0,
        newContacts: contactCount || 0,
      });

      const { data: tickets } = await supabase
        .from("tickets")
        .select("id, title, status, created_at, profiles(full_name)")
        .order("created_at", { ascending: false })
        .limit(10);
      setRecentTickets((tickets as unknown as typeof recentTickets) || []);
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <PortalSidebar items={sidebarItems} userName={profile?.full_name || "Admin"} role="Admin" onSignOut={signOut} />
      <main className="flex-1 ml-60 p-8">
        <span className="font-mono text-blue text-xs tracking-wider">/ ADMIN</span>
        <h1 className="font-anton text-4xl uppercase mt-2 mb-8 text-text">
          Overview<span className="text-blue">.</span>
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Clients", value: stats.clients },
            { label: "Open Tickets", value: stats.openTickets },
            { label: "Active Platforms", value: stats.activePlatforms },
            { label: "New Contacts (7d)", value: stats.newContacts },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border p-5">
              <p className="font-mono text-[10px] text-offwhite tracking-wider uppercase">{stat.label}</p>
              <p className="font-anton text-3xl text-text mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Tickets */}
        <div className="bg-card border border-border">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h3 className="font-barlow font-semibold text-text">Recent Tickets</h3>
            <Link href="/admin/tickets" className="text-xs font-mono text-blue hover:text-blue-light transition-colors">View All →</Link>
          </div>
          {recentTickets.length === 0 ? (
            <div className="p-8 text-center"><p className="text-offwhite text-sm">No tickets</p></div>
          ) : (
            <div className="divide-y divide-border">
              {recentTickets.map((ticket) => (
                <Link key={ticket.id} href={`/admin/tickets`} className="flex items-center justify-between p-4 hover:bg-surface transition-colors">
                  <div>
                    <p className="text-sm text-text font-medium">{ticket.title}</p>
                    <p className="text-xs text-offwhite mt-1 font-mono">
                      {(ticket.profiles as unknown as { full_name: string })?.full_name || "Unknown"} · {new Date(ticket.created_at).toLocaleDateString()}
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
