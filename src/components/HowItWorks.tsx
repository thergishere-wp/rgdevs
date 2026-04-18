"use client";

import { useEffect, useRef } from "react";

interface Step {
  num: string;
  title: string;
  description: string;
  tool: string;
}

const steps: Step[] = [
  {
    num: "STEP 01",
    title: "Client Brief",
    description: "30-min call. We map the goal, scope, and what success looks like in plain English.",
    tool: "Discovery",
  },
  {
    num: "STEP 02",
    title: "AI Design",
    description: "Initial layouts, flows and visual system generated from the brief in hours, not weeks.",
    tool: "Google Stitch",
  },
  {
    num: "STEP 03",
    title: "Human Refinement",
    description: "We pull it into Figma. Tighten the system, push the visual direction, prep specs for build.",
    tool: "Figma",
  },
  {
    num: "STEP 04",
    title: "Code Generation",
    description: "Production code generated and reviewed against the spec — components, routes, schemas, tests.",
    tool: "Claude Code",
  },
  {
    num: "STEP 05",
    title: "Deploy",
    description: "Live on a preview URL same week. Iterate with you. Push to your domain when ready.",
    tool: "Vercel",
  },
];

const pipelineStats = [
  { value: "7–14", em: "d", label: "First preview live" },
  { value: "1/10", em: "th", label: "Cost vs. agency" },
  { value: "∞", label: "Iterations included" },
  { value: "0", em: "%", label: "Lock-in. Cancel anytime." },
];

export default function HowItWorks() {
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
      id="how"
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
            <span style={{ color: "var(--dim)" }}>02 ▍</span>
            The pipeline
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
            An AI-native build process.
            <br />
            Boring agencies{" "}
            <em style={{ fontStyle: "normal", color: "var(--cyan)", textShadow: "0 0 32px rgba(0,245,255,0.35)" }}>
              can&apos;t compete
            </em>
            .
          </h2>
          <p
            className="mt-6"
            style={{ color: "var(--muted)", fontSize: "18px", maxWidth: "60ch", lineHeight: 1.55 }}
          >
            We treat AI as the production line, not a buzzword. Every step has a tool that does it better and faster than a human alone — and a human who makes sure it&apos;s right.
          </p>
        </div>

        {/* Pipeline */}
        <div
          ref={(el) => { revealRefs.current[1] = el; }}
          className="mt-20 relative opacity-0 translate-y-7 transition-all duration-700 delay-100"
        >
          {/* Track line */}
          <div
            className="absolute left-0 right-0 hidden md:block"
            style={{
              top: "62px",
              height: "1px",
              background: "linear-gradient(to right, transparent, var(--line-2) 8%, var(--line-2) 92%, transparent)",
              zIndex: 0,
            }}
            aria-hidden="true"
          >
            {/* Pulse */}
            <div
              className="absolute top-[-1px] h-[3px] w-[120px]"
              style={{
                background: "linear-gradient(to right, transparent, var(--cyan), transparent)",
                boxShadow: "0 0 16px var(--cyan)",
                animation: "flow 5s linear infinite",
              }}
            />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 relative z-10">
            {steps.map((step, i) => (
              <div
                key={i}
                className="group cursor-default transition-all duration-300"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  padding: "24px 20px",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--cyan)";
                  e.currentTarget.style.boxShadow = "var(--glow)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--line)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Node */}
                <div
                  className="w-6 h-6 rounded-full grid place-items-center"
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--cyan)",
                    margin: "-36px auto 18px",
                    boxShadow: "0 0 0 4px var(--bg), 0 0 18px rgba(0,245,255,0.5)",
                    position: "relative",
                  }}
                  aria-hidden="true"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--cyan)", boxShadow: "0 0 8px var(--cyan)" }}
                  />
                </div>
                <div
                  className="text-center"
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "10px",
                    color: "var(--dim)",
                    letterSpacing: "0.3em",
                  }}
                >
                  {step.num}
                </div>
                <h4
                  className="text-center mt-2"
                  style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontWeight: 600,
                    fontSize: "18px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {step.title}
                </h4>
                <p
                  className="text-center mt-2.5"
                  style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.55 }}
                >
                  {step.description}
                </p>
                <div
                  className="mt-4 pt-3.5 text-center"
                  style={{
                    borderTop: "1px dashed var(--line-2)",
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "10px",
                    color: "var(--cyan)",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  <span
                    className="inline-block w-2 h-2 mr-1.5 align-middle"
                    style={{ background: "var(--cyan)", boxShadow: "0 0 6px var(--cyan)" }}
                    aria-hidden="true"
                  />
                  {step.tool}
                </div>
              </div>
            ))}
          </div>

          {/* Pipeline stats */}
          <div className="mt-16 pipeline-stats-grid">
            {pipelineStats.map((stat, i) => (
              <div key={i} className="pipeline-stat-cell">
                <div
                  style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontWeight: 700,
                    fontSize: "42px",
                    letterSpacing: "-0.02em",
                    color: "var(--text)",
                  }}
                >
                  {stat.value}
                  {stat.em && (
                    <em
                      style={{
                        fontStyle: "normal",
                        color: "var(--cyan)",
                        fontSize: "24px",
                        marginLeft: "4px",
                      }}
                    >
                      {stat.em}
                    </em>
                  )}
                </div>
                <div
                  className="mt-2"
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "10px",
                    color: "var(--muted)",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
