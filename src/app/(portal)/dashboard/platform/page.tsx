"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Platform } from "@/lib/types";
import PortalSidebar from "@/components/PortalSidebar";
import StatusBadge from "@/components/StatusBadge";
import GlassCard from "@/components/GlassCard";

const sidebarItems = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "My Platform", href: "/dashboard/platform", icon: "platform" },
  { label: "Tickets", href: "/dashboard/tickets", icon: "tickets" },
  { label: "Messages", href: "/dashboard/messages", icon: "messages" },
  { label: "Reports", href: "/dashboard/reports", icon: "reports" },
  { label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export default function PlatformPage() {
  const { user, profile, loading, signOut } = useAuth("client");
  const [platform, setPlatform] = useState<Platform | null>(null);

  useEffect(() => {
    if (!user) return;
    const supabase = getSupabaseBrowser();
    supabase
      .from("platforms")
      .select("*")
      .eq("client_id", user.id)
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setPlatform(data);
      });
  }, [user]);

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
        items={sidebarItems}
        userName={profile?.full_name || "Client"}
        role="Client"
        onSignOut={signOut}
      />

      <main className="flex-1 ml-60 p-8">
        <span className="font-mono text-blue text-xs tracking-wider">
          / MY PLATFORM
        </span>
        <h1 className="font-anton text-4xl uppercase mt-2 mb-8 text-text">
          Platform <span className="text-blue">Details.</span>
        </h1>

        {!platform ? (
          <GlassCard className="text-center">
            <h3 className="font-barlow font-semibold text-lg text-text">
              No Platform Yet
            </h3>
            <p className="text-offwhite text-sm mt-2">
              Your platform is being set up. We&apos;ll have it ready soon.
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-6">
            {/* Status card */}
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-barlow font-bold text-2xl text-text">
                  {platform.name}
                </h2>
                <StatusBadge status={platform.status} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="font-mono text-[10px] text-offwhite tracking-wider uppercase mb-1">
                    Platform Type
                  </p>
                  <p className="text-text capitalize">{platform.type || "—"}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-offwhite tracking-wider uppercase mb-1">
                    Plan
                  </p>
                  <p className="text-text capitalize">{platform.plan || "—"}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-offwhite tracking-wider uppercase mb-1">
                    Uptime
                  </p>
                  <p className="text-text">{platform.uptime_percent}%</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-offwhite tracking-wider uppercase mb-1">
                    Live URL
                  </p>
                  {platform.url ? (
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue hover:underline text-sm"
                    >
                      {platform.url} ↗
                    </a>
                  ) : (
                    <p className="text-offwhite text-sm">Coming soon</p>
                  )}
                </div>
                <div>
                  <p className="font-mono text-[10px] text-offwhite tracking-wider uppercase mb-1">
                    Start Date
                  </p>
                  <p className="text-text text-sm">
                    {platform.start_date
                      ? new Date(platform.start_date).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-offwhite tracking-wider uppercase mb-1">
                    Next Billing
                  </p>
                  <p className="text-text text-sm">
                    {platform.next_billing
                      ? new Date(platform.next_billing).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Timeline */}
            <GlassCard>
              <h3 className="font-barlow font-semibold text-text mb-4">
                Status Timeline
              </h3>
              <div className="flex items-center gap-4">
                {["building", "live"].map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono ${
                        platform.status === step ||
                        (step === "building" && platform.status === "live")
                          ? "bg-blue text-white"
                          : "bg-surface text-offwhite border border-border"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span className="text-sm text-text capitalize">{step}</span>
                    {i < 1 && (
                      <div className="w-16 h-px bg-border mx-2" />
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}
      </main>
    </div>
  );
}
