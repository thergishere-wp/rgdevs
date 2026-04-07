"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const tiers = [
  {
    name: "Starter",
    price: 20,
    best: "Simple company websites, landing pages, portfolios",
    features: [
      "Professional company website",
      "Up to 5 pages",
      "Contact form",
      "Mobile responsive",
      "Hosting & maintenance",
      "Monthly updates",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: 25,
    best: "Web apps, booking systems, client portals, dashboards",
    features: [
      "Everything in Starter",
      "Full web application",
      "User authentication",
      "Database integration",
      "Real-time features",
      "Payment integration",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: 30,
    best: "ERP systems, inventory management, employee platforms, complex multi-module systems",
    features: [
      "Everything in Pro",
      "Multi-module ERP systems",
      "Advanced reporting & analytics",
      "Employee & inventory management",
      "Custom integrations",
      "Dedicated support",
      "Version upgrades included",
    ],
    popular: false,
  },
];

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (spotlightRef.current) {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotlightRef.current.style.background = `radial-gradient(500px circle at ${x}px ${y}px, rgba(0,85,255,0.05), transparent 70%)`;
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.children;
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 80, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 85%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Mobile scroll snap observer
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const cardWidth = el.offsetWidth * 0.85 + 16; // 85% + gap
      const idx = Math.round(scrollLeft / cardWidth);
      setActiveDot(Math.min(idx, tiers.length - 1));
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const renderCard = (tier: (typeof tiers)[0], mobile = false) => (
    <div
      key={tier.name}
      className={`relative flex flex-col rounded-2xl p-8 ${
        mobile ? "flex-shrink-0" : ""
      } ${
        tier.popular ? "pro-glow" : ""
      }`}
      style={{
        background: "var(--glass-process-bg, rgba(255,255,255,0.03))",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: tier.popular
          ? "1px solid rgba(0,85,255,0.4)"
          : "1px solid var(--glass-process-border, rgba(255,255,255,0.08))",
        ...(mobile ? { width: "85vw", minWidth: "85vw" } : {}),
      }}
    >
      {tier.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue text-white text-xs font-mono px-3 py-1 tracking-wider uppercase rounded-sm">
          Most Popular
        </span>
      )}

      <div className="mb-6">
        <h3 className="font-barlow font-semibold text-lg text-text">
          {tier.name}
        </h3>
        <div className="flex items-baseline gap-1 mt-3">
          <span className="font-anton text-5xl text-text">${tier.price}</span>
          <span className="text-offwhite text-sm">/month</span>
        </div>
        <p className="text-offwhite text-xs mt-3 leading-relaxed">
          Best for: {tier.best}
        </p>
      </div>

      <div className="border-t border-border/30 pt-6 mb-8 flex-1">
        <p className="font-mono text-xs text-blue/60 tracking-wider uppercase mb-4">
          Includes
        </p>
        <ul className="space-y-3">
          {tier.features.map((feature, fi) => (
            <li
              key={fi}
              className="flex items-start gap-3 text-sm text-offwhite"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="mt-0.5 shrink-0 text-blue"
              >
                <path
                  d="M2 7L5.5 10.5L12 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center">
        <p className="font-mono text-xs text-blue mb-4 tracking-wider">
          FREE FIRST MONTH
        </p>
        <button
          onClick={() => scrollTo("contact")}
          className={`w-full py-3 text-sm font-medium tracking-wide transition-all duration-300 rounded-lg ${
            tier.popular
              ? "bg-blue text-white hover:bg-blue-light"
              : "border border-border/50 text-text hover:border-blue hover:text-blue"
          }`}
        >
          Get Started
        </button>
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative py-24 md:py-32"
      onMouseMove={handleMouseMove}
    >
      {/* Cursor spotlight */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="font-mono text-blue text-sm tracking-wider">
            03 / PRICING
          </span>
          <h2 className="font-anton text-[clamp(2.5rem,5vw,4rem)] uppercase leading-[0.95] mt-4 text-text">
            Simple <span className="text-blue">Pricing.</span>
          </h2>
          <p className="text-offwhite text-sm mt-4 max-w-lg mx-auto">
            All plans are 1-year contracts. First month completely free. Domain
            ($10–15/yr) is the only client-side cost.
          </p>
        </div>

        {/* Desktop: 3 columns */}
        <div
          ref={cardsRef}
          className="hidden md:grid grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {tiers.map((tier) => renderCard(tier))}
        </div>

        {/* Mobile: horizontal snap carousel */}
        <div className="md:hidden">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 -mx-2 px-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {tiers.map((tier) => (
              <div key={tier.name} className="snap-center">
                {renderCard(tier, true)}
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {tiers.map((_, i) => (
              <button
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeDot === i
                    ? "bg-blue w-6"
                    : "bg-offwhite/20"
                }`}
                onClick={() => {
                  const el = scrollContainerRef.current;
                  if (el) {
                    const cardWidth = el.offsetWidth * 0.85 + 16;
                    el.scrollTo({ left: i * cardWidth, behavior: "smooth" });
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* Custom enterprise row */}
        <div
          className="mt-12 max-w-5xl mx-auto rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{
            background: "var(--glass-process-bg, rgba(255,255,255,0.03))",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid var(--glass-process-border, rgba(255,255,255,0.08))",
          }}
        >
          <p className="text-offwhite text-sm text-center md:text-left">
            Need something more? Custom enterprise solutions are available for
            complex requirements. Pricing based on scope.
          </p>
          <button
            onClick={() => scrollTo("contact")}
            className="px-6 py-2.5 border border-blue text-blue text-sm font-medium tracking-wide hover:bg-blue hover:text-white transition-all duration-300 rounded-lg shrink-0"
          >
            Talk to Us
          </button>
        </div>
      </div>
    </section>
  );
}
