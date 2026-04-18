"use client";

import { useEffect, useRef } from "react";

interface Service {
  index: string;
  title: string;
  description: string;
  price: string;
  priceNote?: string;
  tags: string[];
  span?: "4" | "6" | "12";
  icon: React.ReactNode;
}

const services: Service[] = [
  {
    index: "// 001",
    title: "Marketing &\nCompany Sites",
    description:
      "Editorial, fast-loading sites that look like you spent ten times what you did. SEO baked in.",
    price: "$20–30",
    priceNote: "/mo",
    tags: ["Next", "CMS", "SEO"],
    span: "4",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
        <rect x="4" y="6" width="32" height="22" rx="1" />
        <path d="M4 12h32M12 28v4M28 28v4M10 32h20" />
        <circle cx="8" cy="9" r=".8" fill="currentColor" />
      </svg>
    ),
  },
  {
    index: "// 002",
    title: "E-commerce\nStores",
    description:
      "Shopify or custom checkout, inventory, payments, abandoned-cart flows. Ready to sell day one.",
    price: "$65–85",
    priceNote: "/mo",
    tags: ["Shopify", "Stripe"],
    span: "4",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
        <path d="M6 10h28l-3 16H9L6 10z" />
        <path d="M6 10L4 4H2" />
        <circle cx="14" cy="32" r="2" /><circle cx="28" cy="32" r="2" />
        <path d="M14 18h12M14 22h8" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    index: "// 003",
    title: "Business\nPlatforms & ERPs",
    description:
      "Internal tools, dashboards, CRMs, inventory and ops systems. Replaces six spreadsheets and a Trello board.",
    price: "$85–150",
    priceNote: "/mo",
    tags: ["Auth", "DB", "API"],
    span: "4",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
        <rect x="4" y="6" width="14" height="12" rx="1" />
        <rect x="22" y="6" width="14" height="12" rx="1" />
        <rect x="4" y="22" width="14" height="12" rx="1" />
        <rect x="22" y="22" width="14" height="12" rx="1" />
        <path d="M8 10h6M8 13h4M26 10h6M26 13h4M8 26h6M8 29h4M26 26h6M26 29h4" />
      </svg>
    ),
  },
  {
    index: "// 004",
    title: "Mobile Apps —\niOS & Android, one codebase",
    description:
      "Native-feel cross-platform apps. Push notifications, offline mode, App Store + Play Store deploys handled.",
    price: "$100–200",
    priceNote: "/mo",
    tags: ["React Native", "Expo", "App Store"],
    span: "6",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
        <rect x="11" y="3" width="18" height="34" rx="3" />
        <path d="M11 8h18M11 30h18" />
        <circle cx="20" cy="33.5" r=".8" fill="currentColor" />
        <path d="M16 14h8M16 18h6M16 22h7" strokeDasharray="1 2" />
      </svg>
    ),
  },
  {
    index: "// 005 · ADD-ON",
    title: "AI-Powered\nFeatures",
    description:
      "Bolt onto any project: chatbots, semantic search, image generation, doc summarisation, automated workflows.",
    price: "$30–50",
    priceNote: "/mo · add-on",
    tags: ["Claude", "RAG", "Agents"],
    span: "6",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
        <path d="M20 4l4 8 8 4-8 4-4 8-4-8-8-4 8-4 4-8z" />
        <circle cx="20" cy="20" r="2.5" />
      </svg>
    ),
  },
];

export default function WhatWeBuild() {
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("opacity-100", "translate-y-0");
            e.target.classList.remove("opacity-0", "translate-y-7");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="build"
      className="section-pad relative z-10"
      style={{ borderTop: "1px solid var(--line)" }}
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div
          ref={(el) => { revealRefs.current[0] = el; }}
          className="opacity-0 translate-y-7 transition-all duration-700"
        >
          <div
            className="flex items-center gap-2.5"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "11px",
              color: "var(--cyan)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: "var(--dim)" }}>01 ▍</span>
            What we build
            <span
              className="flex-1 h-px max-w-[80px]"
              style={{ background: "var(--line)" }}
              aria-hidden="true"
            />
          </div>
          <h2
            className="mt-4"
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontWeight: 700,
              fontSize: "clamp(40px, 5.4vw, 76px)",
              lineHeight: 0.98,
              letterSpacing: "-0.025em",
              maxWidth: "14ch",
            }}
          >
            Five things.
            <br />
            Done{" "}
            <em style={{ fontStyle: "normal", color: "var(--cyan)", textShadow: "0 0 32px rgba(0,245,255,0.35)" }}>
              properly
            </em>
            .
          </h2>
          <p
            className="mt-6"
            style={{
              color: "var(--muted)",
              fontSize: "18px",
              maxWidth: "60ch",
              lineHeight: 1.55,
            }}
          >
            Every project is shaped by AI from brief to deploy, then refined by humans who actually care about the details. For businesses, founders, and startups worldwide. No template farms. No 12-month contracts.
          </p>
        </div>

        {/* Grid */}
        <div className="build-grid mt-16">
          {services.map((svc, i) => (
            <article
              key={i}
              ref={(el) => { revealRefs.current[i + 1] = el; }}
              className={`opacity-0 translate-y-7 transition-all duration-700 group cursor-pointer ${svc.span === "6" ? "build-span-6" : "build-span-4"}`}
              style={{
                background: "var(--surface)",
                padding: "32px 28px 28px",
                position: "relative",
                minHeight: "340px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflow: "hidden",
                transitionDelay: `${(i + 1) * 0.08}s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--surface-2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--surface)";
              }}
            >
              {/* Hover border glow */}
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  boxShadow: "inset 0 0 0 1px var(--cyan), inset 0 0 40px rgba(0,245,255,0.08)",
                }}
                aria-hidden="true"
              />

              <div>
                <div className="flex justify-between items-start gap-4">
                  <div
                    className="group-hover:text-[var(--cyan)] transition-colors duration-300"
                    style={{
                      color: "var(--text)",
                      filter: "none",
                    }}
                  >
                    {svc.icon}
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      fontSize: "11px",
                      color: "var(--dim)",
                      letterSpacing: "0.2em",
                    }}
                  >
                    {svc.index}
                  </span>
                </div>

                <h3
                  className="mt-16"
                  style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontWeight: 600,
                    fontSize: "26px",
                    lineHeight: 1.1,
                    letterSpacing: "-0.01em",
                    whiteSpace: "pre-line",
                  }}
                >
                  {svc.title}
                </h3>
                <p
                  className="mt-3"
                  style={{
                    color: "var(--muted)",
                    fontSize: "14px",
                    lineHeight: 1.55,
                    maxWidth: "38ch",
                  }}
                >
                  {svc.description}
                </p>
              </div>

              <div
                className="flex justify-between items-end mt-8 pt-4"
                style={{ borderTop: "1px dashed var(--line-2)" }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "13px",
                    color: "var(--text)",
                    letterSpacing: "0.05em",
                  }}
                >
                  <span
                    style={{
                      color: "var(--cyan)",
                      fontSize: "20px",
                      fontWeight: 600,
                    }}
                  >
                    {svc.price}
                  </span>
                  {svc.priceNote && (
                    <span style={{ color: "var(--dim)", fontSize: "11px", marginLeft: "4px" }}>
                      {svc.priceNote}
                    </span>
                  )}
                </div>
                <div className="flex gap-1.5 flex-wrap justify-end max-w-[55%]">
                  {svc.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: "var(--font-jetbrains), monospace",
                        fontSize: "9px",
                        letterSpacing: "0.18em",
                        color: "var(--muted)",
                        textTransform: "uppercase",
                        padding: "4px 8px",
                        border: "1px solid var(--line-2)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
