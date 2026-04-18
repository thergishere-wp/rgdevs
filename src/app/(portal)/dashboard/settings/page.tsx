"use client";

import { useState, useEffect, FormEvent } from "react";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import PortalSidebar from "@/components/PortalSidebar";
import GlassCard from "@/components/GlassCard";
import { clientSidebarItems } from "@/lib/sidebar-items";

export default function SettingsPage() {
  const { user, profile, loading, signOut } = useAuth("client");
  const [fullName, setFullName] = useState("");

  // Sync when profile loads
  useEffect(() => {
    if (profile?.full_name) setFullName(profile.full_name);
  }, [profile]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const supabase = getSupabaseBrowser();
    await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) return;
    const supabase = getSupabaseBrowser();
    await supabase.auth.updateUser({ password: newPassword });
    setNewPassword("");
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 3000);
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
      <PortalSidebar items={clientSidebarItems} userName={profile?.full_name || "Client"} role="Client" onSignOut={signOut} />
      <main className="flex-1 ml-60 p-8">
        <span className="font-mono text-blue text-xs tracking-wider">/ SETTINGS</span>
        <h1 className="font-anton text-4xl uppercase mt-2 mb-8 text-text">
          Account <span className="text-blue">Settings.</span>
        </h1>

        <div className="max-w-xl space-y-8">
          {/* Profile */}
          <GlassCard>
            <h2 className="font-barlow font-semibold text-text mb-4">Profile</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] text-offwhite tracking-wider uppercase mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-transparent border px-4 py-3 text-sm text-text focus:border-blue focus:outline-none"
                  style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", borderRadius: "0.5rem" }}
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] text-offwhite tracking-wider uppercase mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full bg-transparent border px-4 py-3 text-sm text-offwhite opacity-50"
                  style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", borderRadius: "0.5rem" }}
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] text-offwhite tracking-wider uppercase mb-2">Plan</label>
                <p className="text-text text-sm capitalize">{profile?.role || "—"}</p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-blue text-white text-sm font-medium tracking-wide hover:bg-blue-light transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
              </button>
            </form>
          </GlassCard>

          {/* Password */}
          <GlassCard>
            <h2 className="font-barlow font-semibold text-text mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (min 6 chars)"
                minLength={6}
                className="w-full bg-transparent border px-4 py-3 text-sm text-text placeholder:text-offwhite/30 focus:border-blue focus:outline-none"
                style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", borderRadius: "0.5rem" }}
              />
              <button
                type="submit"
                className="px-6 py-2.5 border border-border text-text text-sm hover:border-blue hover:text-blue transition-all"
              >
                {passwordSaved ? "Updated!" : "Update Password"}
              </button>
            </form>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
