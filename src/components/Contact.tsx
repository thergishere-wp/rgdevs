"use client";

import { useEffect, useRef, useState } from "react";

type ProjectType = "site" | "store" | "app";

interface FormState {
  name: string;
  email: string;
  project: ProjectType;
  message: string;
}

const contactMeta = [
  { key: "Email", value: "hello@rgdevs.com" },
  { key: "Response", value: "< 24h" },
  { key: "First call", value: "30 min · free" },
  { key: "Based in", value: "Bangkok · Async global" },
];

export default function Contact() {
  const revealRefs = useRef<(HTMLElement | null)[]>([]);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    project: "site",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    // Simulate async submit
    await new Promise((r) => setTimeout(r, 800));
    setStatus("success");
  };

  return (
    <section
      id="contact"
      className="section-pad relative z-10"
      style={{ borderTop: "1px solid var(--line)" }}
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Eyebrow */}
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
            <span style={{ color: "var(--dim)" }}>07 ▍</span>
            Start
            <span className="flex-1 h-px max-w-[80px]" style={{ background: "var(--line)" }} aria-hidden="true" />
          </div>
        </div>

        {/* Two-col layout */}
        <div className="mt-0 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-start">
          {/* Left */}
          <div
            ref={(el) => { revealRefs.current[1] = el; }}
            className="opacity-0 translate-y-7 transition-all duration-700 delay-75"
          >
            <h2
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontWeight: 700,
                fontSize: "clamp(40px, 5vw, 72px)",
                lineHeight: 0.98,
                letterSpacing: "-0.025em",
              }}
            >
              Start your
              <br />
              free{" "}
              <em style={{ fontStyle: "normal", color: "var(--cyan)", textShadow: "0 0 32px rgba(0,245,255,0.35)" }}>
                month.
              </em>
            </h2>
            <p
              className="mt-5"
              style={{ color: "var(--muted)", fontSize: "16px", lineHeight: 1.55, maxWidth: "42ch" }}
            >
              Tell us what you&apos;re building. We&apos;ll come back inside 24 hours with scope, timeline, and a preview URL within two weeks. No card. No commitment.
            </p>

            {/* Meta grid */}
            <div className="contact-meta-grid">
              {contactMeta.map((m, i) => (
                <div key={i} className="contact-meta-cell">
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      fontSize: "10px",
                      color: "var(--dim)",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                    }}
                  >
                    {m.key}
                  </div>
                  <div className="contact-meta-val">{m.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div
            ref={(el) => { revealRefs.current[2] = el; }}
            className="opacity-0 translate-y-7 transition-all duration-700 delay-150"
          >
            {status === "success" ? (
              <div
                className="p-8 flex flex-col items-center justify-center gap-4 text-center"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--cyan)",
                  boxShadow: "var(--glow)",
                  minHeight: "360px",
                }}
                role="alert"
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ color: "var(--cyan)" }}
                  aria-hidden="true"
                >
                  <circle cx="24" cy="24" r="22" />
                  <path d="M14 24l7 7 13-13" />
                </svg>
                <p
                  style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: "22px",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                  }}
                >
                  We&apos;ll reply within 24h.
                </p>
                <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.6 }}>
                  Keep an eye on {form.email}
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-4 p-8"
                style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
              >
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contact-name"
                    className="flex justify-between"
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      fontSize: "10px",
                      color: "var(--muted)",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                    }}
                  >
                    Name{" "}
                    <span style={{ color: "var(--cyan)" }} aria-label="required">REQ</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Your name"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="bg-transparent border-0 border-b pb-2 outline-none transition-colors duration-200 text-[15px]"
                    style={{
                      borderBottom: "1px solid var(--line-2)",
                      color: "var(--text)",
                      fontFamily: "var(--font-space-grotesk), sans-serif",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderBottomColor = "var(--cyan)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderBottomColor = "var(--line-2)"; }}
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contact-email"
                    className="flex justify-between"
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      fontSize: "10px",
                      color: "var(--muted)",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                    }}
                  >
                    Email{" "}
                    <span style={{ color: "var(--cyan)" }} aria-label="required">REQ</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="bg-transparent border-0 border-b pb-2 outline-none transition-colors duration-200 text-[15px]"
                    style={{
                      borderBottom: "1px solid var(--line-2)",
                      color: "var(--text)",
                      fontFamily: "var(--font-space-grotesk), sans-serif",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderBottomColor = "var(--cyan)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderBottomColor = "var(--line-2)"; }}
                  />
                </div>

                {/* Project type segmented control */}
                <div className="flex flex-col gap-2">
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      fontSize: "10px",
                      color: "var(--muted)",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                    }}
                  >
                    Project type
                  </span>
                  <div
                    className="grid grid-cols-3"
                    style={{ gap: "1px", background: "var(--line-2)", border: "1px solid var(--line-2)" }}
                    role="group"
                    aria-label="Project type"
                  >
                    {(["site", "store", "app"] as ProjectType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, project: type }))}
                        className="py-3 px-2 transition-all duration-200 cursor-pointer"
                        style={{
                          fontFamily: "var(--font-jetbrains), monospace",
                          fontSize: "10px",
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          background: form.project === type ? "var(--cyan)" : "var(--surface)",
                          color: form.project === type ? "#001015" : "var(--muted)",
                          fontWeight: form.project === type ? 600 : 400,
                        }}
                        aria-pressed={form.project === type}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contact-message"
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      fontSize: "10px",
                      color: "var(--muted)",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                    }}
                  >
                    What are you building?
                  </label>
                  <textarea
                    id="contact-message"
                    placeholder="A few sentences is plenty."
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="bg-transparent border-0 border-b outline-none transition-colors duration-200 text-[15px] resize-y"
                    style={{
                      borderBottom: "1px solid var(--line-2)",
                      color: "var(--text)",
                      fontFamily: "var(--font-space-grotesk), sans-serif",
                      minHeight: "90px",
                      paddingBottom: "8px",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderBottomColor = "var(--cyan)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderBottomColor = "var(--line-2)"; }}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="mt-2 flex justify-between items-center px-4 py-4 transition-all duration-200 cursor-pointer disabled:opacity-50"
                  style={{
                    background: "var(--cyan)",
                    color: "#001015",
                    fontFamily: "var(--font-jetbrains), monospace",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) => {
                    if (status !== "loading") {
                      e.currentTarget.style.background = "#7CFEFF";
                      e.currentTarget.style.letterSpacing = "0.28em";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--cyan)";
                    e.currentTarget.style.letterSpacing = "0.22em";
                  }}
                >
                  <span>
                    {status === "loading" ? "Sending..." : "Start free month"}
                  </span>
                  {status === "loading" ? (
                    <svg
                      className="animate-spin"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      aria-hidden="true"
                    >
                      <circle cx="8" cy="8" r="6" strokeOpacity="0.3" />
                      <path d="M8 2a6 6 0 0 1 6 6" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      aria-hidden="true"
                    >
                      <path d="M2 8h12M9 3l5 5-5 5" />
                    </svg>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
