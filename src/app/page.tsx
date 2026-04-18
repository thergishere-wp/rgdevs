"use client";

import { useEffect } from "react";
import BgGrid from "@/components/BgGrid";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatsTrustBar from "@/components/StatsTrustBar";
import WhatWeBuild from "@/components/WhatWeBuild";
import HowItWorks from "@/components/HowItWorks";
import WhySubscription from "@/components/WhySubscription";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Portfolio from "@/components/Portfolio";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import StatusBar from "@/components/StatusBar";

export default function Home() {
  useEffect(() => {
    // Smooth scroll for anchor links
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      const href = target.closest("a")?.getAttribute("href");
      if (!href?.startsWith("#")) return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      <BgGrid />
      <Nav />
      <Hero />
      <StatsTrustBar />
      <WhatWeBuild />
      <HowItWorks />
      <WhySubscription />
      <Pricing />
      <FAQ />
      <Portfolio />
      <Contact />
      <Footer />
      <StatusBar />
      {/* Bottom padding for fixed status bar */}
      <div className="h-10" />
    </main>
  );
}
