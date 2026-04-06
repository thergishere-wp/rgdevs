"use client";

import { useEffect, useState, FormEvent } from "react";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Project } from "@/lib/types";
import PortalSidebar from "@/components/PortalSidebar";

const sidebarItems = [
  { label: "Overview", href: "/admin", icon: "overview" },
  { label: "Clients", href: "/admin/clients", icon: "clients" },
  { label: "Tickets", href: "/admin/tickets", icon: "tickets" },
  { label: "Messages", href: "/admin/messages", icon: "messages" },
  { label: "Portfolio", href: "/admin/portfolio", icon: "portfolio" },
  { label: "Reports", href: "/admin/reports", icon: "reports" },
  { label: "Contacts", href: "/admin/contacts", icon: "contacts" },
];

const emptyForm = { name: "", type: "", description: "", live_url: "", image_url: "", tags: "", featured: false };

export default function AdminPortfolioPage() {
  const { profile, loading, signOut } = useAuth("admin");
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    const supabase = getSupabaseBrowser();
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    setProjects(data || []);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const supabase = getSupabaseBrowser();
    const payload = {
      name: form.name,
      type: form.type || null,
      description: form.description || null,
      live_url: form.live_url || null,
      image_url: form.image_url || null,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : null,
      featured: form.featured,
    };

    if (editId) {
      await supabase.from("projects").update(payload).eq("id", editId);
    } else {
      await supabase.from("projects").insert([payload]);
    }

    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
    setSaving(false);
    fetchProjects();
  };

  const handleEdit = (project: Project) => {
    setForm({
      name: project.name,
      type: project.type || "",
      description: project.description || "",
      live_url: project.live_url || "",
      image_url: project.image_url || "",
      tags: project.tags?.join(", ") || "",
      featured: project.featured,
    });
    setEditId(project.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const supabase = getSupabaseBrowser();
    await supabase.from("projects").delete().eq("id", id);
    fetchProjects();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen flex">
      <PortalSidebar items={sidebarItems} userName={profile?.full_name || "Admin"} role="Admin" onSignOut={signOut} />
      <main className="flex-1 ml-60 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="font-mono text-blue text-xs tracking-wider">/ PORTFOLIO</span>
            <h1 className="font-anton text-4xl uppercase mt-2 text-text">Portfolio<span className="text-blue">.</span></h1>
          </div>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(!showForm); }}
            className="px-5 py-2.5 bg-blue text-white text-sm font-medium tracking-wide hover:bg-blue-light transition-colors">
            {showForm ? "Cancel" : "Add Project"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-card border border-border p-6 mb-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" required placeholder="Project name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                className="bg-bg border border-border px-4 py-3 text-sm text-text placeholder:text-offwhite/30 focus:border-blue focus:outline-none" />
              <select value={form.type} onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}
                className="bg-bg border border-border px-4 py-3 text-sm text-text focus:border-blue focus:outline-none">
                <option value="">Type</option>
                <option value="website">Website</option>
                <option value="webapp">Web App</option>
                <option value="erp">ERP</option>
                <option value="booking">Booking</option>
                <option value="dashboard">Dashboard</option>
              </select>
            </div>
            <textarea placeholder="Description" rows={2} value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
              className="w-full bg-bg border border-border px-4 py-3 text-sm text-text placeholder:text-offwhite/30 focus:border-blue focus:outline-none resize-none" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="url" placeholder="Live URL" value={form.live_url} onChange={(e) => setForm((s) => ({ ...s, live_url: e.target.value }))}
                className="bg-bg border border-border px-4 py-3 text-sm text-text placeholder:text-offwhite/30 focus:border-blue focus:outline-none" />
              <input type="url" placeholder="Image URL" value={form.image_url} onChange={(e) => setForm((s) => ({ ...s, image_url: e.target.value }))}
                className="bg-bg border border-border px-4 py-3 text-sm text-text placeholder:text-offwhite/30 focus:border-blue focus:outline-none" />
            </div>
            <input type="text" placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm((s) => ({ ...s, tags: e.target.value }))}
              className="w-full bg-bg border border-border px-4 py-3 text-sm text-text placeholder:text-offwhite/30 focus:border-blue focus:outline-none" />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm((s) => ({ ...s, featured: e.target.checked }))} className="accent-blue" />
              <span className="text-sm text-text">Featured</span>
            </label>
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-blue text-white text-sm font-medium tracking-wide hover:bg-blue-light transition-colors disabled:opacity-50">
              {saving ? "Saving..." : editId ? "Update Project" : "Add Project"}
            </button>
          </form>
        )}

        <div className="space-y-3">
          {projects.map((project) => (
            <div key={project.id} className="bg-card border border-border p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-text font-medium">{project.name}</p>
                  {project.featured && <span className="text-[10px] font-mono text-blue tracking-wider uppercase">Featured</span>}
                  {project.type && <span className="text-[10px] font-mono text-offwhite tracking-wider uppercase">{project.type}</span>}
                </div>
                {project.description && <p className="text-xs text-offwhite mt-1 max-w-md truncate">{project.description}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(project)} className="px-3 py-1.5 border border-border text-xs text-text hover:border-blue transition-colors">Edit</button>
                <button onClick={() => handleDelete(project.id)} className="px-3 py-1.5 border border-border text-xs text-red-400 hover:border-red-400 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
