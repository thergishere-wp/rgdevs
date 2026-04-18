"use client";

import { useEffect, useState } from "react";

const sections: [string, string][] = [
  ["#hero", "SECTION_00 · HERO"],
  ["#trust", "SECTION_01 · TRUST"],
  ["#build", "SECTION_02 · WHAT WE BUILD"],
  ["#how", "SECTION_03 · PIPELINE"],
  ["#benefits", "SECTION_04 · WHY SUBSCRIPTION"],
  ["#pricing", "SECTION_05 · PRICING"],
  ["#faq", "SECTION_06 · FAQ"],
  ["#work", "SECTION_07 · WORK"],
  ["#contact", "SECTION_08 · CONTACT"],
];

export default function StatusBar() {
  const [activeSection, setActiveSection] = useState("SECTION_00 · HERO");
  const [time, setTime] = useState("");

  useEffect(() => {
    // Time
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setTime(`${h}:${m}:${s} ICT · v2.0`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);

    // Section tracking
    const observers: IntersectionObserver[] = [];
    sections.forEach(([id, label]) => {
      const el = document.querySelector(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActiveSection(label);
          });
        },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => {
      clearInterval(timer);
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-between items-center"
      style={{
        padding: "10px 32px",
        fontFamily: "var(--font-jetbrains), monospace",
        fontSize: "10px",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--dim)",
        borderTop: "1px solid var(--line)",
        background: "rgba(8,8,16,0.6)",
        backdropFilter: "blur(8px)",
      }}
      aria-hidden="true"
    >
      <div className="flex items-center">
        <span
          className="inline-block w-1.5 h-1.5 rounded-full mr-2"
          style={{
            background: "var(--cyan)",
            boxShadow: "0 0 8px var(--cyan)",
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
        SYSTEM · ONLINE
      </div>
      <div className="hidden sm:block">{activeSection}</div>
      <div className="hidden md:block">{time}</div>
    </div>
  );
}
