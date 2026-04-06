"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Report } from "@/lib/types";
import PortalSidebar from "@/components/PortalSidebar";

const sidebarItems = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "My Platform", href: "/dashboard/platform", icon: "platform" },
  { label: "Tickets", href: "/dashboard/tickets", icon: "tickets" },
  { label: "Messages", href: "/dashboard/messages", icon: "messages" },
  { label: "Reports", href: "/dashboard/reports", icon: "reports" },
  { label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export default function ReportsPage() {
  const { user, profile, loading, signOut } = useAuth("client");
  const [reports, setReports] = useState<Report[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const supabase = getSupabaseBrowser();
    supabase
      .from("reports")
      .select("*, platforms(name)")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setReports(data || []));
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
      <PortalSidebar items={sidebarItems} userName={profile?.full_name || "Client"} role="Client" onSignOut={signOut} />
      <main className="flex-1 ml-60 p-8">
        <span className="font-mono text-blue text-xs tracking-wider">/ REPORTS</span>
        <h1 className="font-anton text-4xl uppercase mt-2 mb-8 text-text">
          Monthly <span className="text-blue">Reports.</span>
        </h1>

        {reports.length === 0 ? (
          <div className="bg-card border border-border p-12 text-center">
            <h3 className="font-barlow font-semibold text-lg text-text">No Reports Yet</h3>
            <p className="text-offwhite text-sm mt-2">Monthly reports will appear here once your platform is live.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="bg-card border border-border">
                <button
                  onClick={() => setExpanded(expanded === report.id ? null : report.id)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-surface transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-blue">{report.month}</span>
                    <span className="text-sm text-text font-medium">
                      {(report.platforms as unknown as { name: string })?.name || "Platform"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-text">{report.uptime_percent}% uptime</span>
                    <span className="text-offwhite text-xs">{expanded === report.id ? "−" : "+"}</span>
                  </div>
                </button>
                {expanded === report.id && (
                  <div className="px-5 pb-5 border-t border-border pt-4 space-y-3">
                    {report.updates_made && report.updates_made.length > 0 && (
                      <div>
                        <p className="font-mono text-[10px] text-offwhite tracking-wider uppercase mb-2">Updates Made</p>
                        <ul className="space-y-1">
                          {report.updates_made.map((update, i) => (
                            <li key={i} className="text-sm text-text flex items-start gap-2">
                              <span className="text-blue mt-1">•</span> {update}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {report.notes && (
                      <div>
                        <p className="font-mono text-[10px] text-offwhite tracking-wider uppercase mb-2">Notes</p>
                        <p className="text-sm text-offwhite">{report.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
