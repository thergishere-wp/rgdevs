"use client";

const navLinks = [
  { href: "#build", label: "What we build" },
  { href: "#how", label: "How it works" },
  { href: "#benefits", label: "Why subscription" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" },
];

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M2 8h12M9 3l5 5-5 5" />
    </svg>
  );
}

function ExternalIcon() {
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

export default function Footer() {
  return (
    <footer
      className="relative z-10 px-5 pt-14 pb-16 md:px-8 md:pt-20 md:pb-24"
      style={{ borderTop: "1px solid rgba(0,245,255,0.18)" }}
    >
      {/* Top glow line */}
      <div
        className="absolute left-0 right-0 top-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(to right, transparent, rgba(0,245,255,0.5), transparent)",
        }}
        aria-hidden="true"
      />

      <div className="footer-grid max-w-[1280px] mx-auto items-start">
        {/* Brand column */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span
              className="w-7 h-7 grid place-items-center relative"
              style={{
                border: "1px solid var(--cyan)",
                color: "var(--cyan)",
                fontWeight: 600,
                fontFamily: "var(--font-space-grotesk), sans-serif",
                boxShadow: "inset 0 0 12px rgba(0,245,255,0.25)",
              }}
              aria-hidden="true"
            >
              R
              <span
                className="absolute inset-[3px]"
                style={{ border: "1px solid rgba(0,245,255,0.35)" }}
              />
            </span>
            <span
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontWeight: 700,
                fontSize: "22px",
                letterSpacing: "-0.01em",
                color: "var(--text)",
              }}
            >
              RG·DEVS
            </span>
          </div>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "14px",
              lineHeight: 1.6,
              maxWidth: "34ch",
            }}
          >
            AI-powered development studio. Bangkok, Thailand — shipping for businesses, founders and startups worldwide.
          </p>
          <div
            className="mt-7"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "10px",
              color: "var(--dim)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              lineHeight: 1.9,
            }}
          >
            <div>© 2026 RG Devs</div>
            <div>Bangkok · Thailand · Remote global</div>
            <div>All rights reserved</div>
          </div>
        </div>

        {/* Nav column */}
        <div>
          <h5
            className="mb-4"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "10px",
              color: "var(--dim)",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
            }}
          >
            {"// Navigate"}
          </h5>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex items-center gap-2.5 transition-all duration-200 group cursor-pointer"
                    style={{
                      fontFamily: "var(--font-space-grotesk), sans-serif",
                      fontSize: "16px",
                      color: "#C8CCE0",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--cyan)";
                      e.currentTarget.style.paddingLeft = "0px";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#C8CCE0";
                      e.currentTarget.style.paddingLeft = "0px";
                    }}
                  >
                    <span
                      className="w-0 h-px transition-all duration-200 group-hover:w-[18px]"
                      style={{
                        background: "var(--cyan)",
                        boxShadow: "0 0 6px var(--cyan)",
                        flexShrink: 0,
                      }}
                      aria-hidden="true"
                    />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* CTA column */}
        <div>
          <h5
            className="mb-4"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "10px",
              color: "var(--dim)",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
            }}
          >
            {"// Get started"}
          </h5>
          <a
            href="#contact"
            className="flex justify-between items-center px-5 py-4 transition-all duration-200 cursor-pointer"
            style={{
              background: "var(--cyan)",
              color: "#001015",
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "12px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#7CFEFF";
              e.currentTarget.style.letterSpacing = "0.28em";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--cyan)";
              e.currentTarget.style.letterSpacing = "0.22em";
            }}
          >
            <span>Start your free month</span>
            <ArrowIcon />
          </a>
          <a
            href="mailto:hello@rgdevs.com"
            className="mt-4 flex justify-between items-center px-4 py-3.5 transition-colors duration-200 cursor-pointer"
            style={{
              border: "1px solid var(--line-2)",
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "13px",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--cyan)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line-2)"; }}
          >
            <div>
              <div
                style={{
                  fontSize: "10px",
                  color: "var(--dim)",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                }}
              >
                Email
              </div>
              <div className="mt-1" style={{ color: "var(--text)" }}>
                hello@rgdevs.com
              </div>
            </div>
            <ExternalIcon />
          </a>
        </div>
      </div>
    </footer>
  );
}
