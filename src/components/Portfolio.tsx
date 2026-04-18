"use client";

import { useEffect, useRef } from "react";

interface Project {
  url: string;
  name: string;
  subtitle: string;
  variant?: "default" | "alt";
}

const projects: Project[] = [
  {
    url: "denovatech.co.nz",
    name: "Denova Technologies Ltd",
    subtitle: "Corporate site · 2026",
    variant: "default",
  },
  {
    url: "ceylora.com",
    name: "Ceylora",
    subtitle: "E-commerce · Shopify · 2026",
    variant: "alt",
  },
];

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <path d="M3 11L11 3M11 3H5M11 3v6" />
    </svg>
  );
}

function MockBrowser({ url, variant }: { url: string; variant?: string }) {
  return (
    <div className="absolute inset-8">
      <div
        className="h-6 flex items-center px-2.5 gap-1.5"
        style={{
          border: "1px solid var(--line-2)",
          borderBottom: 0,
          background: "#0A0A18",
        }}
        aria-hidden="true"
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#1A1A2E" }} />
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#1A1A2E" }} />
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#1A1A2E" }} />
        <span
          className="ml-3.5"
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "9px",
            color: "var(--dim)",
            letterSpacing: "0.1em",
          }}
        >
          {url}
        </span>
      </div>
      <div
        className="absolute left-0 right-0 bottom-0 overflow-hidden"
        style={{
          top: "24px",
          border: "1px solid var(--line-2)",
          background: "linear-gradient(180deg, #08081A, #04040C)",
        }}
      >
        {variant === "alt" ? (
          <>
            <div
              className="absolute"
              style={{
                top: "18%",
                left: "8%",
                width: "60%",
                height: "14px",
                background: "linear-gradient(to right, rgba(0,245,255,0.4), transparent 50%)",
              }}
            />
            <div
              className="absolute"
              style={{ top: "30%", left: "8%", width: "50%", height: "8px", background: "rgba(255,255,255,0.12)" }}
            />
            <div
              className="absolute flex gap-2"
              style={{ left: "8%", right: "8%", top: "50%", height: "38%" }}
            >
              {[0, 1, 2, 3].map((j) => (
                <span
                  key={j}
                  className="flex-1"
                  style={{ border: "1px solid var(--line-2)", background: "rgba(0,245,255,0.04)" }}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div
              className="absolute"
              style={{
                top: "18%",
                left: "8%",
                right: "8%",
                height: "14px",
                background: "linear-gradient(to right, rgba(0,245,255,0.4), transparent 50%)",
              }}
            />
            <div
              className="absolute"
              style={{ top: "30%", left: "8%", width: "50%", height: "8px", background: "rgba(255,255,255,0.12)" }}
            />
            <div
              className="absolute flex gap-2"
              style={{ left: "8%", right: "8%", top: "55%", height: "30%" }}
            >
              {[0, 1, 2].map((j) => (
                <span
                  key={j}
                  className="flex-1"
                  style={{ border: "1px solid var(--line-2)", background: "rgba(0,245,255,0.04)" }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Portfolio() {
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
      id="work"
      className="relative z-10"
      style={{ padding: "140px 32px", borderTop: "1px solid var(--line)" }}
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
            <span style={{ color: "var(--dim)" }}>06 ▍</span>
            In production
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
            Live work.
            <br />
            Real{" "}
            <em style={{ fontStyle: "normal", color: "var(--cyan)", textShadow: "0 0 32px rgba(0,245,255,0.35)" }}>
              clients
            </em>
            .
          </h2>
        </div>

        {/* Work grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <article
              key={i}
              ref={(el) => { revealRefs.current[i + 1] = el; }}
              className="opacity-0 translate-y-7 transition-all duration-700 group cursor-pointer"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transitionDelay: `${(i + 1) * 0.08}s`,
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
              {/* Preview */}
              <div
                className="relative overflow-hidden"
                style={{
                  aspectRatio: "16/10",
                  background: "#06060E",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                {/* Overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: project.variant === "alt"
                      ? `
                        repeating-linear-gradient(-45deg, transparent 0 18px, rgba(0,245,255,0.05) 18px 19px),
                        radial-gradient(ellipse at center, rgba(0,245,255,0.08), transparent 70%)
                      `
                      : `
                        repeating-linear-gradient(45deg, transparent 0 18px, rgba(0,245,255,0.05) 18px 19px),
                        radial-gradient(ellipse at center, rgba(0,245,255,0.08), transparent 70%)
                      `,
                  }}
                  aria-hidden="true"
                />

                {/* Tag */}
                <div
                  className="absolute top-4 left-4 z-10 px-2.5 py-1"
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "10px",
                    color: "var(--dim)",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    border: "1px solid var(--line-2)",
                    background: "rgba(8,8,16,0.7)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  Live preview · {project.url}
                </div>

                <MockBrowser url={project.url} variant={project.variant} />
              </div>

              {/* Meta */}
              <div className="px-6 py-6 flex justify-between items-center">
                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-space-grotesk), sans-serif",
                      fontWeight: 600,
                      fontSize: "20px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {project.name}
                  </h4>
                  <div
                    className="mt-1.5"
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      fontSize: "11px",
                      color: "var(--muted)",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                    }}
                  >
                    {project.subtitle}
                  </div>
                </div>
                <div
                  className="w-9 h-9 grid place-items-center transition-all duration-200"
                  style={{
                    border: "1px solid var(--line-2)",
                    color: "var(--muted)",
                  }}
                  aria-hidden="true"
                >
                  <ArrowIcon />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
