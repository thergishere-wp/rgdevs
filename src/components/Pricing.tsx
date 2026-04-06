"use client";

import { useEffect, useRef } from "react";
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

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-mono text-blue text-sm tracking-wider">
            03 / PRICING
          </span>
          <h2 className="font-anton text-[clamp(2.5rem,5vw,4rem)] uppercase leading-[0.95] mt-4 text-white">
            Simple <span className="text-blue">Pricing.</span>
          </h2>
          <p className="text-offwhite text-sm mt-4 max-w-lg mx-auto">
            1 year contract. First month free. Domain cost ($10-15/yr) paid by
            client.
          </p>
        </div>

        {/* Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative bg-card border p-8 flex flex-col ${
                tier.popular
                  ? "border-blue shadow-[0_0_40px_-10px_rgba(0,85,255,0.3)]"
                  : "border-border"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue text-white text-xs font-mono px-3 py-1 tracking-wider uppercase">
                  Most Popular
                </span>
              )}

              <div className="mb-6">
                <h3 className="font-barlow font-semibold text-lg text-white">
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1 mt-3">
                  <span className="font-anton text-5xl text-white">
                    ${tier.price}
                  </span>
                  <span className="text-offwhite text-sm">/month</span>
                </div>
                <p className="text-offwhite text-xs mt-3 leading-relaxed">
                  Best for: {tier.best}
                </p>
              </div>

              <div className="border-t border-border pt-6 mb-8 flex-1">
                <p className="font-mono text-xs text-blue/60 tracking-wider uppercase mb-4">
                  Includes
                </p>
                <ul className="space-y-3">
                  {tier.features.map((feature, i) => (
                    <li
                      key={i}
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
                  className={`w-full py-3 text-sm font-medium tracking-wide transition-all duration-300 ${
                    tier.popular
                      ? "bg-blue text-white hover:bg-blue-light"
                      : "border border-border text-white hover:border-blue hover:text-blue"
                  }`}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
