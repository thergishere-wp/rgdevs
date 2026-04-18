"use client";

import { useEffect, useRef } from "react";

interface Stat {
  value: string;
  em?: string;
  label: string;
}

const stats: Stat[] = [
  { value: "2", em: "Live", label: "Clients shipping in production" },
  { value: "< 48", em: "hr", label: "First draft turnaround" },
  { value: "$0", label: "Setup fee · no contracts" },
  { value: "Worldwide", label: "Async across every timezone" },
];

export default function StatsTrustBar() {
  const sectionRef = useRef<HTMLElement>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);

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
    cellRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="trust"
      className="relative z-10 px-5 py-10 md:px-8 md:py-14"
      style={{
        borderTop: "1px solid rgba(0,245,255,0.18)",
        borderBottom: "1px solid rgba(0,245,255,0.18)",
        background: "linear-gradient(to right, transparent, rgba(0,245,255,0.03), transparent)",
      }}
    >
      {/* Top glow line */}
      <div
        className="absolute left-0 right-0 top-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(to right, transparent, rgba(0,245,255,0.5), transparent)",
        }}
        aria-hidden="true"
      />
      {/* Bottom glow line */}
      <div
        className="absolute left-0 right-0 bottom-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(to right, transparent, rgba(0,245,255,0.5), transparent)",
        }}
        aria-hidden="true"
      />

      <div
        className="max-w-[1280px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            ref={(el) => { cellRefs.current[i] = el; }}
            className="text-left relative pl-5 opacity-0 translate-y-7 transition-all duration-700"
            style={{ transitionDelay: `${i * 0.08}s` }}
          >
            {/* Cyan tick */}
            <div
              className="absolute left-0 top-1.5 w-1.5 h-1.5"
              style={{
                background: "var(--cyan)",
                boxShadow: "0 0 8px var(--cyan)",
              }}
              aria-hidden="true"
            />
            {/* Value */}
            <div
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontWeight: 700,
                fontSize: "clamp(36px, 4.2vw, 56px)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                color: "var(--text)",
              }}
            >
              {stat.value}
              {stat.em && (
                <em
                  style={{
                    fontStyle: "normal",
                    color: "var(--cyan)",
                    textShadow: "0 0 20px rgba(0,245,255,0.35)",
                    fontSize: "0.65em",
                    marginLeft: "0.1em",
                  }}
                >
                  {stat.em}
                </em>
              )}
            </div>
            {/* Label */}
            <div
              className="mt-3"
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "11px",
                color: "var(--muted)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              {stat.label}
            </div>

            {/* Divider — not on last in row */}
            {i < stats.length - 1 && (
              <div
                className="absolute right-0 top-0 bottom-0 w-px hidden lg:block"
                style={{ background: "var(--line)", right: "-16px" }}
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
