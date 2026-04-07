"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Profile, Platform } from "@/lib/types";
import PortalSidebar from "@/components/PortalSidebar";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
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

interface ClientWithPlatform extends Profile {
  platforms: Platform[];
}

export default function ClientsPage() {
  const { profile, loading, signOut } = useAuth("admin");
  const [clients, setClients] = useState<ClientWithPlatform[]>([]);
  const [inviteUrl, setInviteUrl] = useState("");

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    supabase
      .from("profiles")
      .select("*, platforms(*)")
      .eq("role", "client")
      .order("created_at", { ascending: false })
      .then(({ data }) => setClients((data as unknown as ClientWithPlatform[]) || []));
  }, []);

  const generateInvite = () => {
    const url = `${window.location.origin}/signup`;
    setInviteUrl(url);
    navigator.clipboard.writeText(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#060608" }}>
      <PortalSidebar items={sidebarItems} userName={profile?.full_name || "Admin"} role="Admin" onSignOut={signOut} />
      <main className="flex-1 ml-60 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="font-mono text-blue text-xs tracking-wider">/ CLIENTS</span>
            <h1 className="font-anton text-4xl uppercase mt-2 text-text">
              Clients<span className="text-blue">.</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {inviteUrl && (
              <span className="text-xs font-mono text-green-400">Copied!</span>
            )}
            <button onClick={generateInvite} className="px-5 py-2.5 bg-blue text-white text-sm font-medium tracking-wide hover:bg-blue-light transition-colors">
              Invite Client
            </button>
          </div>
        </div>

        <GlassCard noPadding>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <th className="text-left p-4 font-mono text-[10px] text-offwhite tracking-wider uppercase">Name</th>
                <th className="text-left p-4 font-mono text-[10px] text-offwhite tracking-wider uppercase">Email</th>
                <th className="text-left p-4 font-mono text-[10px] text-offwhite tracking-wider uppercase">Plan</th>
                <th className="text-left p-4 font-mono text-[10px] text-offwhite tracking-wider uppercase">Platform</th>
                <th className="text-left p-4 font-mono text-[10px] text-offwhite tracking-wider uppercase">Joined</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td className="p-4">
                    <Link href={`/admin/clients/${client.id}`} className="text-sm text-text font-medium hover:text-blue transition-colors">
                      {client.full_name || "—"}
                    </Link>
                  </td>
                  <td className="p-4 text-sm text-offwhite font-mono">{client.email}</td>
                  <td className="p-4">
                    {client.platforms?.[0]?.plan ? (
                      <span className="text-xs font-mono text-text capitalize">{client.platforms[0].plan}</span>
                    ) : "—"}
                  </td>
                  <td className="p-4">
                    {client.platforms?.[0] ? (
                      <StatusBadge status={client.platforms[0].status} />
                    ) : (
                      <span className="text-xs text-offwhite">None</span>
                    )}
                  </td>
                  <td className="p-4 text-xs text-offwhite font-mono">
                    {new Date(client.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {clients.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-offwhite text-sm">No clients yet</p>
            </div>
          )}
        </GlassCard>
      </main>
    </div>
  );
}
