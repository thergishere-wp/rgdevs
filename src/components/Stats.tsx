"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 48, suffix: "H", label: "Average Build Time" },
  { value: 100, suffix: "%", label: "Custom Built" },
  { value: 3, suffix: "", label: "Platform Tiers" },
];

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const numbersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const meshRef = useRef<HTMLDivElement>(null);
  const [displayed, setDisplayed] = useState(stats.map((s) => s.value));

  useEffect(() => {
    const els = numbersRef.current.filter(Boolean);
    if (els.length === 0) return;

    // Fallback: IntersectionObserver in case GSAP ScrollTrigger misses
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCountUp();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    let hasRun = false;
    const runCountUp = () => {
      if (hasRun) return;
      hasRun = true;

      numbersRef.current.forEach((el, i) => {
        if (!el) return;
        const target = stats[i].value;
        const obj = { val: 0 };

        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            const v = Math.round(obj.val);
            el.textContent = String(v);
            setDisplayed((prev) => {
              const next = [...prev];
              next[i] = v;
              return next;
            });
          },
          onComplete: () => {
            el.textContent = String(target);
            if (el.parentElement) {
              gsap.to(el.parentElement, {
                textShadow:
                  "0 0 40px rgba(0,85,255,0.4), 0 0 80px rgba(0,85,255,0.15)",
                duration: 0.5,
                ease: "power2.out",
              });
            }
          },
        });
      });
    };

    // Also try GSAP ScrollTrigger
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 85%",
        onEnter: runCountUp,
      });

      if (meshRef.current) {
        gsap.to(meshRef.current, {
          backgroundPosition: "100% 50%",
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Animated gradient mesh */}
      <div
        ref={meshRef}
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(0,85,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(0,85,255,0.1) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(0,85,255,0.08) 0%, transparent 50%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Giant background numbers */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[30vw] font-anton text-outline leading-none">
          48H
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="flex items-baseline justify-center gap-1">
                <span
                  ref={(el) => {
                    numbersRef.current[i] = el;
                  }}
                  className="font-anton text-[clamp(4rem,10vw,7rem)] text-text leading-none"
                >
                  {displayed[i]}
                </span>
                <span className="font-anton text-[clamp(2rem,5vw,4rem)] text-blue leading-none">
                  {stat.suffix}
                </span>
              </div>
              <p className="font-mono text-offwhite text-xs tracking-wider uppercase mt-4">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
