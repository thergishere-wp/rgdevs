"use client";

import { useEffect, useState, FormEvent } from "react";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Ticket, Platform } from "@/lib/types";
import PortalSidebar from "@/components/PortalSidebar";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import { clientSidebarItems } from "@/lib/sidebar-items";

export default function TicketsPage() {
  const { user, profile, loading, signOut } = useAuth("client");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "normal",
    platform_id: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = async () => {
    if (!user) return;
    const supabase = getSupabaseBrowser();
    const { data } = await supabase
      .from("tickets")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false });
    setTickets(data || []);
  };

  useEffect(() => {
    if (!user) return;
    const supabase = getSupabaseBrowser();
    fetchTickets();
    supabase
      .from("platforms")
      .select("*")
      .eq("client_id", user.id)
      .then(({ data }) => setPlatforms(data || []));
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    const supabase = getSupabaseBrowser();
    await supabase.from("tickets").insert([
      {
        client_id: user.id,
        title: form.title,
        description: form.description,
        priority: form.priority,
        platform_id: form.platform_id || null,
      },
    ]);
    setForm({ title: "", description: "", priority: "normal", platform_id: "" });
    setShowModal(false);
    setSubmitting(false);
    fetchTickets();
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
      <PortalSidebar
        items={clientSidebarItems}
        userName={profile?.full_name || "Client"}
        role="Client"
        onSignOut={signOut}
      />

      <main className="flex-1 ml-60 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="font-mono text-blue text-xs tracking-wider">
              / TICKETS
            </span>
            <h1 className="font-anton text-4xl uppercase mt-2 text-text">
              Support <span className="text-blue">Tickets.</span>
            </h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-blue text-white text-sm font-medium tracking-wide hover:bg-blue-light transition-colors"
          >
            New Request
          </button>
        </div>

        {/* Ticket list */}
        <GlassCard noPadding>
          {tickets.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-offwhite text-sm">No tickets yet</p>
            </div>
          ) : (
            <div>
              {tickets.map((ticket, i) => (
                <Link
                  key={ticket.id}
                  href={`/dashboard/tickets/${ticket.id}`}
                  className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
                  style={i < tickets.length - 1 ? { borderBottom: "1px solid rgba(255,255,255,0.04)" } : undefined}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text font-medium truncate">
                      {ticket.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-offwhite font-mono">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </span>
                      <StatusBadge status={ticket.priority} />
                    </div>
                  </div>
                  <StatusBadge status={ticket.status} />
                </Link>
              ))}
            </div>
          )}
        </GlassCard>

        {/* New ticket modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex py-12 px-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", overflowY: "auto" }}>
            <div className="p-8 w-full max-w-md rounded-2xl overflow-hidden" style={{ background: "rgba(12,12,16,0.97)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 0 40px rgba(0,0,0,0.4)", margin: "auto" }}>
              <h2 className="font-anton text-2xl uppercase text-text mb-6">
                New <span className="text-blue">Request.</span>
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, title: e.target.value }))
                  }
                  className="w-full bg-transparent border px-4 py-3 text-sm text-text placeholder:text-offwhite/30 focus:border-blue focus:outline-none"
                  style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", borderRadius: "0.5rem" }}
                />
                <textarea
                  placeholder="Description"
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, description: e.target.value }))
                  }
                  className="w-full bg-transparent border px-4 py-3 text-sm text-text placeholder:text-offwhite/30 focus:border-blue focus:outline-none resize-none"
                  style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", borderRadius: "0.5rem" }}
                />
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, priority: e.target.value }))
                  }
                  className="w-full bg-transparent border px-4 py-3 text-sm text-text focus:border-blue focus:outline-none"
                  style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", borderRadius: "0.5rem" }}
                >
                  <option value="low">Low Priority</option>
                  <option value="normal">Normal Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>
                {platforms.length > 0 && (
                  <select
                    value={form.platform_id}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, platform_id: e.target.value }))
                    }
                    className="w-full bg-transparent border px-4 py-3 text-sm text-text focus:border-blue focus:outline-none"
                    style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", borderRadius: "0.5rem" }}
                  >
                    <option value="">Select platform</option>
                    {platforms.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                )}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-blue text-white text-sm font-medium tracking-wide hover:bg-blue-light transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Creating..." : "Create Ticket"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 border border-border text-text text-sm hover:border-blue transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
