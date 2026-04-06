"use client";

import { useEffect, useState, FormEvent } from "react";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Ticket, Platform } from "@/lib/types";
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
    <div className="min-h-screen flex">
      <PortalSidebar
        items={sidebarItems}
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
        <div className="bg-card border border-border">
          {tickets.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-offwhite text-sm">No tickets yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {tickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/dashboard/tickets/${ticket.id}`}
                  className="flex items-center justify-between p-5 hover:bg-surface transition-colors"
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
        </div>

        {/* New ticket modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card border border-border p-8 w-full max-w-md mx-4">
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
                  className="w-full bg-bg border border-border px-4 py-3 text-sm text-text placeholder:text-offwhite/30 focus:border-blue focus:outline-none"
                />
                <textarea
                  placeholder="Description"
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, description: e.target.value }))
                  }
                  className="w-full bg-bg border border-border px-4 py-3 text-sm text-text placeholder:text-offwhite/30 focus:border-blue focus:outline-none resize-none"
                />
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, priority: e.target.value }))
                  }
                  className="w-full bg-bg border border-border px-4 py-3 text-sm text-text focus:border-blue focus:outline-none"
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
                    className="w-full bg-bg border border-border px-4 py-3 text-sm text-text focus:border-blue focus:outline-none"
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
