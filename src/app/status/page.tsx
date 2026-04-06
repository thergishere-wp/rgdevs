"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Platform } from "@/lib/types";
import ThemeProvider from "@/components/ThemeProvider";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const statusConfig = {
  live: { color: "bg-green-500", label: "Live", textColor: "text-green-400" },
  maintenance: {
    color: "bg-yellow-500",
    label: "Maintenance",
    textColor: "text-yellow-400",
  },
  building: {
    color: "bg-blue",
    label: "Building",
    textColor: "text-blue-light",
  },
};

export default function StatusPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchPlatforms = async () => {
    const supabase = getSupabaseBrowser();
    const { data } = await supabase
      .from("platforms")
      .select("*")
      .order("name");
    setPlatforms(data || []);
    setLoading(false);
    setLastUpdated(new Date());
  };

  useEffect(() => {
    fetchPlatforms();
    const interval = setInterval(fetchPlatforms, 60000);
    return () => clearInterval(interval);
  }, []);

  const allLive = platforms.every((p) => p.status === "live");

  return (
    <ThemeProvider>
      <CustomCursor />
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="mb-12">
            <span className="font-mono text-blue text-sm tracking-wider">
              / STATUS
            </span>
            <h1 className="font-anton text-[clamp(2.5rem,6vw,5rem)] uppercase leading-[0.95] mt-4 text-text">
              System <span className="text-blue">Status.</span>
            </h1>
            <p className="text-offwhite text-sm mt-4">
              Real-time status of all client platforms. Auto-refreshes every 60
              seconds.
            </p>
          </div>

          {/* Overall status banner */}
          <div
            className={`border p-6 mb-8 ${
              allLive && !loading
                ? "border-green-500/30 bg-green-500/5"
                : "border-border bg-card"
            }`}
          >
            <div className="flex items-center gap-3">
              {loading ? (
                <div className="w-3 h-3 border-2 border-blue border-t-transparent rounded-full animate-spin" />
              ) : allLive ? (
                <div className="relative w-3 h-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-50" />
                </div>
              ) : (
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
              )}
              <span className="font-barlow font-semibold text-text">
                {loading
                  ? "Checking systems..."
                  : allLive
                  ? "All Systems Operational"
                  : "Some Systems Under Maintenance"}
              </span>
            </div>
          </div>

          {/* Platform list */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" />
            </div>
          ) : platforms.length === 0 ? (
            <div className="text-center py-20 bg-card border border-border">
              <p className="text-offwhite text-sm">
                No platforms registered yet.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {platforms.map((platform) => {
                const cfg =
                  statusConfig[platform.status as keyof typeof statusConfig] ||
                  statusConfig.building;
                return (
                  <div
                    key={platform.id}
                    className="bg-card border border-border p-5 flex items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="font-barlow font-semibold text-text truncate">
                          {platform.name}
                        </h3>
                        {platform.type && (
                          <span className="font-mono text-[10px] text-offwhite tracking-wider uppercase hidden sm:inline">
                            {platform.type}
                          </span>
                        )}
                      </div>
                      {platform.url && (
                        <a
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-offwhite hover:text-blue transition-colors font-mono mt-1 inline-block truncate max-w-xs"
                        >
                          {platform.url}
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                      {/* Uptime */}
                      <span className="font-mono text-sm text-text hidden sm:block">
                        {platform.uptime_percent}%
                      </span>

                      {/* Status badge */}
                      <div className="flex items-center gap-2">
                        <div className="relative w-2.5 h-2.5">
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${cfg.color}`}
                          />
                          {platform.status === "live" && (
                            <div
                              className={`absolute inset-0 rounded-full ${cfg.color} animate-ping opacity-40`}
                            />
                          )}
                        </div>
                        <span
                          className={`font-mono text-xs tracking-wider ${cfg.textColor}`}
                        >
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Last updated */}
          <p className="text-offwhite/40 text-xs font-mono mt-6 text-center">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
