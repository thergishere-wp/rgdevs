"use client";

import { usePathname, useRouter } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

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
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <button onClick={goHome} className="text-lg font-bold tracking-tight">
          <span className="text-text">RG</span>
          <span className="text-blue">.</span>
          <span className="text-text">DEVS</span>
        </button>

        {/* Links */}
        <div className="flex items-center gap-6">
          {["services", "process", "pricing", "contact"].map((id) => (
            <button
              key={id}
              onClick={() => navigateTo(id)}
              className="text-xs text-offwhite hover:text-text transition-colors font-mono tracking-wider uppercase"
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
