"use client";

import { useEffect, useRef, useState } from "react";

const links = [
  { href: "#build", label: "What we build" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
  { href: "#work", label: "Work" },
];

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current) return;
      const scrolled = window.scrollY > 40;
      navRef.current.style.background = scrolled
        ? "rgba(8,8,16,0.92)"
        : "linear-gradient(to bottom, rgba(8,8,16,0.7), rgba(8,8,16,0))";
      navRef.current.style.backdropFilter = scrolled ? "blur(16px)" : "blur(10px)";
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      id="topnav"
      aria-label="Main navigation"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-[18px] transition-all duration-300"
      style={{
        background: "linear-gradient(to bottom, rgba(8,8,16,0.7), rgba(8,8,16,0))",
        backdropFilter: "blur(10px)",
        fontFamily: "var(--font-jetbrains), monospace",
        fontSize: "11px",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--muted)",
      }}
    >
      {/* Brand */}
      <a href="#hero" className="flex items-center gap-2.5" style={{ color: "var(--text)" }}>
        <span
          className="w-[22px] h-[22px] grid place-items-center relative"
          style={{
            border: "1px solid var(--cyan)",
            color: "var(--cyan)",
            fontWeight: 600,
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
        <span>RG&nbsp;DEVS</span>
      </a>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-7" role="list">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            role="listitem"
            className="transition-colors duration-200 hover:text-[var(--cyan)] cursor-pointer"
          >
            {l.label}
          </a>
        ))}
      </div>

      {/* CTA */}
      <a
        href="#contact"
        className="hidden md:inline-block px-[14px] py-2 transition-all duration-200 cursor-pointer"
        style={{
          border: "1px solid var(--line-2)",
          color: "var(--text)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--cyan)";
          e.currentTarget.style.color = "var(--cyan)";
          e.currentTarget.style.boxShadow = "var(--glow)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--line-2)";
          e.currentTarget.style.color = "var(--text)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        Start free month →
      </a>

      {/* Mobile menu button */}
      <button
        className="md:hidden flex flex-col gap-[5px] p-2 cursor-pointer"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle menu"
        aria-expanded={mobileOpen}
      >
        <span
          className="block w-5 h-px transition-all duration-200"
          style={{
            background: "var(--text)",
            transform: mobileOpen ? "translateY(6px) rotate(45deg)" : "none",
          }}
        />
        <span
          className="block w-5 h-px transition-all duration-200"
          style={{
            background: "var(--text)",
            opacity: mobileOpen ? 0 : 1,
          }}
        />
        <span
          className="block w-5 h-px transition-all duration-200"
          style={{
            background: "var(--text)",
            transform: mobileOpen ? "translateY(-6px) rotate(-45deg)" : "none",
          }}
        />
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="absolute top-full left-0 right-0 flex flex-col gap-0 md:hidden"
          style={{
            background: "rgba(8,8,16,0.97)",
            backdropFilter: "blur(16px)",
            borderTop: "1px solid var(--line)",
          }}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="px-8 py-4 transition-colors duration-200 hover:text-[var(--cyan)] cursor-pointer"
              style={{ borderBottom: "1px solid var(--line)" }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="mx-8 my-4 px-4 py-3 text-center cursor-pointer transition-all duration-200"
            style={{
              background: "var(--cyan)",
              color: "#001015",
              fontWeight: 600,
            }}
          >
            Start free month →
          </a>
        </div>
      )}
    </nav>
  );
}
