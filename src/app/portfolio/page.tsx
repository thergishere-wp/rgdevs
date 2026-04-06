"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Project } from "@/lib/types";
import ThemeProvider from "@/components/ThemeProvider";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const typeFilters = ["All", "Website", "Webapp", "ERP", "Booking", "Dashboard"];

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = getSupabaseBrowser();
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });
      setProjects(data || []);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (loading || !gridRef.current) return;
    const cards = gridRef.current.children;
    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
      }
    );
  }, [loading, filter]);

  const filtered =
    filter === "All"
      ? projects
      : projects.filter(
          (p) => p.type?.toLowerCase() === filter.toLowerCase()
        );

  return (
    <ThemeProvider>
      <CustomCursor />
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-12">
            <span className="font-mono text-blue text-sm tracking-wider">
              / PORTFOLIO
            </span>
            <h1 className="font-anton text-[clamp(2.5rem,6vw,5rem)] uppercase leading-[0.95] mt-4 text-text">
              Our <span className="text-blue">Work.</span>
            </h1>
            <p className="text-offwhite text-sm mt-4 max-w-lg">
              Platforms we&apos;ve built for clients across industries.
            </p>
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap gap-2 mb-10">
            {typeFilters.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2 text-xs font-mono tracking-wider uppercase border transition-all duration-300 ${
                  filter === t
                    ? "bg-blue border-blue text-white"
                    : "border-border text-offwhite hover:border-blue hover:text-blue"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-32">
              <div className="text-6xl font-anton text-outline-blue mb-4">
                {"///"}
              </div>
              <h3 className="font-barlow font-semibold text-xl text-text">
                More projects coming soon
              </h3>
              <p className="text-offwhite text-sm mt-2">
                We&apos;re always building. Check back shortly.
              </p>
            </div>
          ) : (
            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((project) => (
                <div
                  key={project.id}
                  className="group bg-card border border-border overflow-hidden hover:border-blue/30 transition-all duration-500"
                >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden bg-bg-secondary">
                    {project.image_url ? (
                      <Image
                        src={project.image_url}
                        alt={project.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-anton text-4xl text-outline-blue">
                          {project.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    {project.featured && (
                      <span className="absolute top-3 left-3 bg-blue text-white text-[10px] font-mono px-2 py-0.5 tracking-wider uppercase">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      {project.type && (
                        <span className="font-mono text-[10px] text-blue tracking-wider uppercase">
                          {project.type}
                        </span>
                      )}
                    </div>
                    <h3 className="font-barlow font-semibold text-lg text-text">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-offwhite text-sm mt-2 leading-relaxed line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {project.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono text-offwhite bg-surface px-2 py-0.5 border border-border-subtle"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Live link */}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 text-xs font-mono text-blue hover:text-blue-light transition-colors"
                      >
                        View Live
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M3 9L9 3M9 3H3M9 3V9"
                            stroke="currentColor"
                            strokeWidth="1.2"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
