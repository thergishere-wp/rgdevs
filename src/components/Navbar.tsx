"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import AuthModal from "./AuthModal";
import StartProjectModal from "./StartProjectModal";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigateTo = (sectionId: string) => {
    if (pathname === "/") {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${sectionId}`);
    }
  };

  const goHome = () => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
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
          onClick={goHome}
          className="flex items-center gap-0 text-xl font-bold tracking-tight"
        >
          <span className="text-text">RG</span>
          <span className="text-blue">.</span>
          <span className="text-text">DEVS</span>
        </button>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => navigateTo("services")}
            className="text-sm text-offwhite hover:text-text transition-colors font-barlow tracking-wide"
          >
            Services
          </button>
          <button
            onClick={() => navigateTo("process")}
            className="text-sm text-offwhite hover:text-text transition-colors font-barlow tracking-wide"
          >
            Process
          </button>
          <button
            onClick={() => navigateTo("pricing")}
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
          <button
            onClick={() => setAuthOpen(true)}
            className="hidden md:inline text-sm text-offwhite hover:text-text transition-colors font-mono tracking-wide"
          >
            Login
          </button>

          {/* Start a Project CTA */}
          <button
            onClick={() => setProjectOpen(true)}
            className="px-5 py-2 text-sm border border-blue text-blue hover:bg-blue hover:text-white transition-all duration-300 tracking-wide rounded-lg"
          >
            Start a Project
          </button>
        </div>
      </div>

      {/* Modals */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <StartProjectModal isOpen={projectOpen} onClose={() => setProjectOpen(false)} />
    </nav>
  );
}
