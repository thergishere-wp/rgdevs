"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Profile, Platform, Ticket } from "@/lib/types";
import PortalSidebar from "@/components/PortalSidebar";
import StatusBadge from "@/components/StatusBadge";
import GlassCard from "@/components/GlassCard";

const sidebarItems = [
  { label: "Overview", href: "/admin", icon: "overview" },
  { label: "Clients", href: "/admin/clients", icon: "clients" },
  { label: "Tickets", href: "/admin/tickets", icon: "tickets" },
  { label: "Messages", href: "/admin/messages", icon: "messages" },
  { label: "Portfolio", href: "/admin/portfolio", icon: "portfolio" },
  { label: "Reports", href: "/admin/reports", icon: "reports" },
  { label: "Contacts", href: "/admin/contacts", icon: "contacts" },
];

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;
  const { profile: adminProfile, loading, signOut } = useAuth("admin");
  const [client, setClient] = useState<Profile | null>(null);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    supabase.from("profiles").select("*").eq("id", clientId).single().then(({ data }) => setClient(data as unknown as Profile));
    supabase.from("platforms").select("*").eq("client_id", clientId).then(({ data }) => setPlatforms(data || []));
    supabase.from("tickets").select("*").eq("client_id", clientId).order("created_at", { ascending: false }).then(({ data }) => setTickets(data || []));
  }, [clientId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#060608" }}>
      <PortalSidebar items={sidebarItems} userName={adminProfile?.full_name || "Admin"} role="Admin" onSignOut={signOut} />
      <main className="flex-1 ml-60 p-8">
        <span className="font-mono text-blue text-xs tracking-wider">/ CLIENT DETAIL</span>
        <h1 className="font-anton text-4xl uppercase mt-2 mb-8 text-text">
          {client?.full_name || "Client"}<span className="text-blue">.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile */}
          <GlassCard>
            <h3 className="font-barlow font-semibold text-text mb-4">Profile</h3>
            <div className="space-y-3">
              <div><p className="font-mono text-[10px] text-offwhite tracking-wider uppercase">Email</p><p className="text-text text-sm">{client?.email}</p></div>
              <div><p className="font-mono text-[10px] text-offwhite tracking-wider uppercase">Joined</p><p className="text-text text-sm">{client?.created_at ? new Date(client.created_at).toLocaleDateString() : "—"}</p></div>
            </div>
          </GlassCard>

          {/* Platforms */}
          <GlassCard>
            <h3 className="font-barlow font-semibold text-text mb-4">Platforms</h3>
            {platforms.length === 0 ? <p className="text-offwhite text-sm">No platforms</p> : (
              platforms.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 last:border-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div><p className="text-sm text-text">{p.name}</p><p className="text-xs text-offwhite capitalize">{p.plan || "—"}</p></div>
                  <StatusBadge status={p.status} />
                </div>
              ))
            )}
          </GlassCard>
        </div>

        {/* Tickets */}
        <GlassCard noPadding className="mt-6">
          <div className="p-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}><h3 className="font-barlow font-semibold text-text">Tickets</h3></div>
          {tickets.length === 0 ? <div className="p-8 text-center"><p className="text-offwhite text-sm">No tickets</p></div> : (
            <div>
              {tickets.map((t) => (
                <div key={t.id} className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div><p className="text-sm text-text">{t.title}</p><p className="text-xs text-offwhite font-mono mt-1">{new Date(t.created_at).toLocaleDateString()}</p></div>
                  <div className="flex gap-2"><StatusBadge status={t.priority} /><StatusBadge status={t.status} /></div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </main>
    </div>
  );
}
