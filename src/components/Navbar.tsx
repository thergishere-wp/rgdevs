"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        scrolled
          ? "bg-bg/70 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollTo("hero")}
          className="flex items-center gap-0 text-xl font-bold tracking-tight"
        >
          <span className="text-text">RG</span>
          <span className="text-blue">.</span>
          <span className="text-text">DEVS</span>
        </button>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollTo("services")}
            className="text-sm text-offwhite hover:text-text transition-colors font-barlow tracking-wide"
          >
            Services
          </button>
          <button
            onClick={() => scrollTo("process")}
            className="text-sm text-offwhite hover:text-text transition-colors font-barlow tracking-wide"
          >
            Process
          </button>
          <button
            onClick={() => scrollTo("pricing")}
            className="text-sm text-offwhite hover:text-text transition-colors font-barlow tracking-wide"
          >
            Pricing
          </button>
          <Link
            href="/portfolio"
            className="text-sm text-offwhite hover:text-text transition-colors font-barlow tracking-wide"
          >
            Portfolio
          </Link>
          <Link
            href="/status"
            className="text-sm text-offwhite hover:text-text transition-colors font-barlow tracking-wide"
          >
            Status
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 text-offwhite hover:text-text transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 8.5A6.5 6.5 0 017.5 2 5.5 5.5 0 1014 8.5z" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            )}
            <span className="hidden lg:inline font-mono text-xs tracking-wider">
              {theme === "dark" ? "LIGHT" : "DARK"}
            </span>
          </button>

          {/* Login */}
          <Link
            href="/login"
            className="hidden md:inline text-sm text-offwhite hover:text-text transition-colors font-mono tracking-wide"
          >
            Login
          </Link>

          {/* CTA */}
          <button
            onClick={() => scrollTo("contact")}
            className="px-5 py-2 text-sm border border-blue text-blue hover:bg-blue hover:text-white transition-all duration-300 tracking-wide"
          >
            Start Free
          </button>
        </div>
      </div>
    </nav>
  );
}
