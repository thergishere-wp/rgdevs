"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

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
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-0 text-xl font-bold tracking-tight">
          <span className="text-white">RG</span>
          <span className="text-blue">.</span>
          <span className="text-white">DEVS</span>
        </button>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollTo("services")}
            className="text-sm text-offwhite hover:text-white transition-colors font-barlow tracking-wide"
          >
            Services
          </button>
          <button
            onClick={() => scrollTo("process")}
            className="text-sm text-offwhite hover:text-white transition-colors font-barlow tracking-wide"
          >
            Process
          </button>
          <button
            onClick={() => scrollTo("pricing")}
            className="text-sm text-offwhite hover:text-white transition-colors font-barlow tracking-wide"
          >
            Pricing
          </button>
        </div>

        {/* CTA */}
        <button
          onClick={() => scrollTo("contact")}
          className="px-5 py-2 text-sm border border-blue text-blue hover:bg-blue hover:text-white transition-all duration-300 tracking-wide"
        >
          Start Free
        </button>
      </div>
    </nav>
  );
}
