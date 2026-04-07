"use client";

import { useEffect, useState, FormEvent } from "react";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Profile, Platform, Report } from "@/lib/types";
import PortalSidebar from "@/components/PortalSidebar";
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

export default function AdminReportsPage() {
  const { profile: adminProfile, loading, signOut } = useAuth("admin");
  const [reports, setReports] = useState<(Report & { profiles?: { full_name: string }; platforms?: { name: string } })[]>([]);
  const [clients, setClients] = useState<Profile[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ client_id: "", platform_id: "", month: "", uptime_percent: "99.9", updates_made: "", notes: "" });

  const fetchReports = async () => {
    const supabase = getSupabaseBrowser();
    const { data } = await supabase.from("reports").select("*, profiles(full_name), platforms(name)").order("created_at", { ascending: false });
    setReports(data || []);
  };

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    fetchReports();
    supabase.from("profiles").select("*").eq("role", "client").then(({ data }) => setClients(data as Profile[] || []));
    supabase.from("platforms").select("*").then(({ data }) => setPlatforms(data || []));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const supabase = getSupabaseBrowser();
    await supabase.from("reports").insert([{
      client_id: form.client_id,
      platform_id: form.platform_id || null,
      month: form.month,
      uptime_percent: parseFloat(form.uptime_percent),
      updates_made: form.updates_made ? form.updates_made.split("\n").filter(Boolean) : null,
      notes: form.notes || null,
    }]);
    setForm({ client_id: "", platform_id: "", month: "", uptime_percent: "99.9", updates_made: "", notes: "" });
    setShowForm(false);
    setSaving(false);
    fetchReports();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#060608" }}>
      <PortalSidebar items={sidebarItems} userName={adminProfile?.full_name || "Admin"} role="Admin" onSignOut={signOut} />
      <main className="flex-1 ml-60 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="font-mono text-blue text-xs tracking-wider">/ REPORTS</span>
            <h1 className="font-anton text-4xl uppercase mt-2 text-text">Reports<span className="text-blue">.</span></h1>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 bg-blue text-white text-sm font-medium tracking-wide hover:bg-blue-light transition-colors">
            {showForm ? "Cancel" : "Create Report"}
          </button>
        </div>

        {showForm && (
          <GlassCard className="mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select required value={form.client_id} onChange={(e) => setForm((s) => ({ ...s, client_id: e.target.value }))}
                className="bg-transparent border rounded-lg px-4 py-3 text-sm text-text focus:border-blue focus:outline-none" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                <option value="">Select client</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.full_name || c.email}</option>)}
              </select>
              <select value={form.platform_id} onChange={(e) => setForm((s) => ({ ...s, platform_id: e.target.value }))}
                className="bg-transparent border rounded-lg px-4 py-3 text-sm text-text focus:border-blue focus:outline-none" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                <option value="">Select platform</option>
                {platforms.filter((p) => p.client_id === form.client_id).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input type="text" required placeholder="Month (e.g. April 2026)" value={form.month} onChange={(e) => setForm((s) => ({ ...s, month: e.target.value }))}
                className="bg-transparent border rounded-lg px-4 py-3 text-sm text-text placeholder:text-offwhite/30 focus:border-blue focus:outline-none" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }} />
            </div>
            <input type="number" step="0.1" placeholder="Uptime %" value={form.uptime_percent} onChange={(e) => setForm((s) => ({ ...s, uptime_percent: e.target.value }))}
              className="w-full bg-transparent border rounded-lg px-4 py-3 text-sm text-text focus:border-blue focus:outline-none" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }} />
            <textarea placeholder="Updates made (one per line)" rows={3} value={form.updates_made} onChange={(e) => setForm((s) => ({ ...s, updates_made: e.target.value }))}
              className="w-full bg-transparent border rounded-lg px-4 py-3 text-sm text-text placeholder:text-offwhite/30 focus:border-blue focus:outline-none resize-none" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }} />
            <textarea placeholder="Notes" rows={2} value={form.notes} onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))}
              className="w-full bg-transparent border rounded-lg px-4 py-3 text-sm text-text placeholder:text-offwhite/30 focus:border-blue focus:outline-none resize-none" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }} />
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-blue text-white text-sm font-medium tracking-wide hover:bg-blue-light transition-colors disabled:opacity-50">
              {saving ? "Creating..." : "Create Report"}
            </button>
            </form>
          </GlassCard>
        )}

        <GlassCard noPadding>
          {reports.length === 0 ? <div className="p-12 text-center"><p className="text-offwhite text-sm">No reports yet</p></div> : (
            <div>
              {reports.map((report) => (
                <div key={report.id} className="p-5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div>
                    <p className="text-sm text-text font-medium">{report.month}</p>
                    <p className="text-xs text-offwhite font-mono mt-1">
                      {(report.profiles as unknown as { full_name: string })?.full_name || "Unknown"} · {(report.platforms as unknown as { name: string })?.name || "—"}
                    </p>
                  </div>
                  <span className="font-mono text-sm text-text">{report.uptime_percent}%</span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </main>
    </div>
  );
}
