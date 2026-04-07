"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: "How long does it take to build my platform?",
    a: "Most platforms are built and live within 48–72 hours for standard builds. Complex ERP systems may take 1–2 weeks. You get weekly progress updates throughout.",
  },
  {
    q: "What do I actually need to provide?",
    a: "Just your domain (website address, ~$10–15/yr) and a conversation about what you need. No technical knowledge or assets required unless you have them.",
  },
  {
    q: "What happens after the free first month?",
    a: "You move onto your chosen plan — Starter ($20), Pro ($25), or Enterprise ($30) per month on a 1-year contract. Everything is included: hosting, updates, support.",
  },
  {
    q: "Can I request changes after launch?",
    a: "Yes. Unlimited change requests are included in your subscription. Submit them through your client portal and we handle them.",
  },
  {
    q: "What if I need something not in the standard plans?",
    a: "We offer fully custom solutions for complex requirements. Contact us and we'll scope it specifically for you.",
  },
  {
    q: "Do you work with clients outside Thailand?",
    a: "Yes. We work remotely with clients globally. Communication is via your client portal and chat.",
  },
  {
    q: "What happens when my 1-year contract ends?",
    a: "We'll reach out before renewal. You can continue, upgrade your plan, or we can discuss your next phase.",
  },
];

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item, i) => {
        if (!item) return;
        gsap.fromTo(
          item,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              toggleActions: "play none none none",
            },
            delay: i * 0.05,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section ref={sectionRef} id="faq" className="py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <span className="font-mono text-blue text-sm tracking-wider">
            05 / FAQ
          </span>
          <h2 className="font-anton text-[clamp(2.5rem,5vw,4rem)] uppercase leading-[0.95] mt-4 text-text">
            Questions <span className="text-blue">Answered.</span>
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                ref={(el) => {
                  itemsRef.current[i] = el;
                }}
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background:
                    "var(--glass-process-bg, rgba(255,255,255,0.03))",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: isOpen
                    ? "1px solid rgba(0,85,255,0.3)"
                    : "1px solid var(--glass-process-border, rgba(255,255,255,0.08))",
                  borderLeft: isOpen
                    ? "3px solid rgba(0,85,255,0.8)"
                    : "1px solid var(--glass-process-border, rgba(255,255,255,0.08))",
                }}
              >
                {/* Question */}
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left group"
                >
                  <span
                    className={`font-barlow font-medium text-sm md:text-base pr-4 transition-colors duration-300 ${
                      isOpen ? "text-text" : "text-offwhite"
                    } group-hover:text-text`}
                  >
                    {faq.q}
                  </span>
                  <span
                    className={`shrink-0 w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 ${
                      isOpen
                        ? "bg-blue/20 text-blue rotate-45"
                        : "bg-surface text-blue"
                    }`}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M6 1v10M1 6h10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>

                {/* Answer */}
                <div
                  className="overflow-hidden transition-all duration-400 ease-in-out"
                  style={{
                    maxHeight: isOpen ? "200px" : "0px",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <p className="px-6 pb-5 text-offwhite text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
