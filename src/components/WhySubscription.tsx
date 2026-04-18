"use client";

import { useEffect, useRef } from "react";

interface CompareRow {
  label: string;
  agency: string;
  rg: string;
}

const rows: CompareRow[] = [
  { label: "Upfront cost", agency: "$5,000 – $15,000", rg: "$0" },
  { label: "Contract length", agency: "12 months locked", rg: "None · cancel anytime" },
  { label: "First delivery", agency: "6 – 12 weeks", rg: "Days" },
  { label: "Post-launch updates", agency: "Billed separately", rg: "Included" },
  { label: "You own the domain", agency: "Sometimes", rg: "Always" },
  { label: "AI-accelerated builds", agency: "Rarely", rg: "Every project" },
];

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M2 2l8 8M10 2l-8 8" />
    </svg>
  );
}

function OkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M2 6l3 3 5-6" />
    </svg>
  );
}

export default function WhySubscription() {
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
      id="benefits"
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
            <span style={{ color: "var(--dim)" }}>03 ▍</span>
            Why subscription
            <span className="flex-1 h-px max-w-[80px]" style={{ background: "var(--line)" }} aria-hidden="true" />
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
            Why subscription beats a{" "}
            <em style={{ fontStyle: "normal", color: "var(--cyan)", textShadow: "0 0 32px rgba(0,245,255,0.35)" }}>
              one-time agency
            </em>
            .
          </h2>
          <p
            className="mt-6"
            style={{ color: "var(--muted)", fontSize: "18px", maxWidth: "60ch", lineHeight: 1.55 }}
          >
            Traditional agencies charge $5,000–15,000 upfront, lock you into 12-month contracts, and disappear after launch. We work differently.
          </p>
        </div>

        {/* Comparison grid */}
        <div
          ref={(el) => { revealRefs.current[1] = el; }}
          className="compare-grid mt-16 opacity-0 translate-y-7 transition-all duration-700 delay-100 relative"
        >
          {/* VS badge */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-3.5 z-10 px-2.5 py-1 hidden md:block"
            style={{
              background: "var(--bg)",
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "10px",
              color: "var(--dim)",
              letterSpacing: "0.3em",
            }}
            aria-hidden="true"
          >
            VS
          </div>

          {/* Agency column */}
          <div
            className="p-8 md:p-9"
            style={{ background: "var(--surface)", color: "#C8CCE0" }}
          >
            <div className="flex items-center gap-2.5 mb-7">
              <span
                className="px-2.5 py-1"
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#ff5a6a",
                  border: "1px solid rgba(255,90,106,0.35)",
                  background: "rgba(255,90,106,0.06)",
                }}
              >
                The old way
              </span>
              <h4
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontWeight: 600,
                  fontSize: "22px",
                  letterSpacing: "-0.01em",
                  color: "#9097B0",
                }}
              >
                Traditional Agency
              </h4>
            </div>
            {rows.map((row, i) => (
              <div
                key={i}
                className="grid gap-3 items-center py-3.5"
                style={{
                  gridTemplateColumns: "1fr auto",
                  borderTop: i === 0 ? "none" : "1px dashed var(--line-2)",
                  paddingTop: i === 0 ? 0 : undefined,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "11px",
                    color: "var(--muted)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  {row.label}
                </span>
                <span
                  className="flex items-center gap-2"
                  style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: "16px",
                    fontWeight: 500,
                    color: "#C8CCE0",
                    textDecoration: "line-through",
                    textDecorationColor: "rgba(255,90,106,0.55)",
                    textDecorationThickness: "1px",
                  }}
                >
                  <span style={{ color: "#ff5a6a", flexShrink: 0 }}>
                    <XIcon />
                  </span>
                  {row.agency}
                </span>
              </div>
            ))}
          </div>

          {/* RG column */}
          <div
            className="p-8 md:p-9"
            style={{
              background: "var(--surface)",
              outline: "1px solid var(--cyan)",
              outlineOffset: "-1px",
              boxShadow: "inset 0 0 60px rgba(0,245,255,0.05)",
            }}
          >
            <div className="flex items-center gap-2.5 mb-7">
              <span
                className="px-2.5 py-1"
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--cyan)",
                  border: "1px solid var(--cyan)",
                  background: "rgba(0,245,255,0.06)",
                }}
              >
                The RG way
              </span>
              <h4
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontWeight: 600,
                  fontSize: "22px",
                  letterSpacing: "-0.01em",
                  color: "var(--text)",
                }}
              >
                RG Devs
              </h4>
            </div>
            {rows.map((row, i) => (
              <div
                key={i}
                className="grid gap-3 items-center py-3.5"
                style={{
                  gridTemplateColumns: "1fr auto",
                  borderTop: i === 0 ? "none" : "1px dashed var(--line-2)",
                  paddingTop: i === 0 ? 0 : undefined,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "11px",
                    color: "var(--muted)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  {row.label}
                </span>
                <span
                  className="flex items-center gap-2"
                  style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: "16px",
                    fontWeight: 500,
                    color: "var(--text)",
                  }}
                >
                  <span style={{ color: "var(--cyan)", flexShrink: 0 }}>
                    <OkIcon />
                  </span>
                  <em style={{ fontStyle: "normal", color: "var(--cyan)" }}>{row.rg}</em>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
