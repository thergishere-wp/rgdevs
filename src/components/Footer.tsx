"use client";

export default function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <button onClick={() => scrollTo("hero")} className="text-lg font-bold tracking-tight">
          <span className="text-white">RG</span>
          <span className="text-blue">.</span>
          <span className="text-white">DEVS</span>
        </button>

        {/* Links */}
        <div className="flex items-center gap-6">
          {["services", "process", "pricing", "contact"].map((id) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-xs text-offwhite hover:text-white transition-colors font-mono tracking-wider uppercase"
            >
              {id}
            </button>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs text-offwhite/40 font-mono">
          &copy; {new Date().getFullYear()} RG Devs. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
