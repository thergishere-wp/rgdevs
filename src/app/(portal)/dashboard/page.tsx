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
      // Fetch platform
      const { data: platformData } = await supabase
        .from("platforms")
        .select("*")
        .eq("client_id", user.id)
        .limit(1)
        .single();
      if (platformData) setPlatform(platformData);

      // Open tickets count
      const { count } = await supabase
        .from("tickets")
        .select("*", { count: "exact", head: true })
        .eq("client_id", user.id)
        .in("status", ["open", "in_progress"]);
      setTicketCount(count || 0);

      // Unread messages
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

      // Recent tickets
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <PortalSidebar
        items={sidebarItems}
        userName={profile?.full_name || "Client"}
        role="Client"
        onSignOut={signOut}
      />

      <main className="flex-1 ml-60 p-8">
        {/* Welcome */}
        <div className="mb-8">
          <span className="font-mono text-blue text-xs tracking-wider">
            / DASHBOARD
          </span>
          <h1 className="font-anton text-4xl uppercase mt-2 text-text">
            Welcome back,{" "}
            <span className="text-blue">
              {profile?.full_name?.split(" ")[0] || "there"}.
            </span>
          </h1>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border p-5">
            <p className="font-mono text-[10px] text-offwhite tracking-wider uppercase">
              Open Tickets
            </p>
            <p className="font-anton text-3xl text-text mt-2">{ticketCount}</p>
          </div>
          <div className="bg-card border border-border p-5">
            <p className="font-mono text-[10px] text-offwhite tracking-wider uppercase">
              Unread Messages
            </p>
            <p className="font-anton text-3xl text-text mt-2">{unreadCount}</p>
          </div>
          <div className="bg-card border border-border p-5">
            <p className="font-mono text-[10px] text-offwhite tracking-wider uppercase">
              Platform Status
            </p>
            <div className="mt-2">
              {platform ? (
                <StatusBadge status={platform.status} />
              ) : (
                <span className="text-offwhite text-sm">No platform yet</span>
              )}
            </div>
          </div>
        </div>

        {/* Platform Card */}
        {platform && (
          <div className="bg-card border border-border p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-barlow font-semibold text-lg text-text">
                {platform.name}
              </h2>
              <StatusBadge status={platform.status} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="font-mono text-[10px] text-offwhite tracking-wider uppercase">
                  Plan
                </p>
                <p className="text-text text-sm mt-1 capitalize">
                  {platform.plan || "—"}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-offwhite tracking-wider uppercase">
                  Uptime
                </p>
                <p className="text-text text-sm mt-1">
                  {platform.uptime_percent}%
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-offwhite tracking-wider uppercase">
                  URL
                </p>
                {platform.url ? (
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue text-sm mt-1 hover:underline inline-block truncate max-w-[200px]"
                  >
                    {platform.url}
                  </a>
                ) : (
                  <p className="text-offwhite text-sm mt-1">Coming soon</p>
                )}
              </div>
              <div>
                <p className="font-mono text-[10px] text-offwhite tracking-wider uppercase">
                  Type
                </p>
                <p className="text-text text-sm mt-1 capitalize">
                  {platform.type || "—"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            href="/dashboard/tickets"
            className="px-5 py-2.5 bg-blue text-white text-sm font-medium tracking-wide hover:bg-blue-light transition-colors"
          >
            New Ticket
          </Link>
          <Link
            href="/dashboard/messages"
            className="px-5 py-2.5 border border-border text-text text-sm font-medium tracking-wide hover:border-blue hover:text-blue transition-all"
          >
            Message Us
          </Link>
          <Link
            href="/dashboard/reports"
            className="px-5 py-2.5 border border-border text-text text-sm font-medium tracking-wide hover:border-blue hover:text-blue transition-all"
          >
            View Reports
          </Link>
        </div>

        {/* Recent Tickets */}
        <div className="bg-card border border-border">
          <div className="p-5 border-b border-border">
            <h3 className="font-barlow font-semibold text-text">
              Recent Tickets
            </h3>
          </div>
          {tickets.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-offwhite text-sm">No tickets yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {tickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/dashboard/tickets/${ticket.id}`}
                  className="flex items-center justify-between p-4 hover:bg-surface transition-colors"
                >
                  <div>
                    <p className="text-sm text-text font-medium">
                      {ticket.title}
                    </p>
                    <p className="text-xs text-offwhite mt-1 font-mono">
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
