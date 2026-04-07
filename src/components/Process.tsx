"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: "01",
    label: "UNDERSTAND",
    title: "Discovery",
    desc: "We learn about your business, your goals, and exactly what you need your platform to do. No technical knowledge required from your side.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M22 22l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: "02",
    label: "BLUEPRINT",
    title: "Design & Plan",
    desc: "We architect the full solution, design the interface, and agree on exact scope and timeline before a single line of code is written.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="4" width="24" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 12h24M12 12v16" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    num: "03",
    label: "DEVELOP",
    title: "Build",
    desc: "We develop your platform — fast, clean, fully tested. You get weekly progress updates and can give feedback at any point.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M12 8L4 16l8 8M20 8l8 8-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "04",
    label: "DEPLOY",
    title: "Launch",
    desc: "We deploy your platform, run it through full QA, and go live. Your domain, your brand, your platform.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 28V4M16 4l-8 8M16 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "05",
    label: "MAINTAIN",
    title: "Ongoing Support",
    desc: "Hosting, maintenance, updates, and changes are all included in your monthly subscription. We're always here.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12 12-5.4 12-12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M28 4v8h-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      const cardHeight = cards[0]?.offsetHeight || 500;
      const stackOffset = 30; // pixels each card peeks from behind
      const scaleStep = 0.04;

      cards.forEach((card, i) => {
        // Pin each card and stack
        ScrollTrigger.create({
          trigger: card,
          start: `top ${80 + i * 0}px`,
          end: `+=${cardHeight + 100}`,
          pin: i < cards.length - 1, // Don't pin the last card
          pinSpacing: i < cards.length - 1,
          onUpdate: (self) => {
            // Scale down cards as they get stacked behind
            if (i < cards.length - 1) {
              const progress = self.progress;
              const scale = 1 - progress * scaleStep;
              const yOffset = progress * stackOffset;
              gsap.set(card, {
                scale,
                y: yOffset,
                filter: `brightness(${1 - progress * 0.15})`,
              });
            }
          },
        });

        // Animate card entrance
        gsap.fromTo(
          card,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="process" className="py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <span className="font-mono text-blue text-sm tracking-wider">
            02 / PROCESS
          </span>
          <h2 className="font-anton text-[clamp(2.5rem,5vw,4rem)] uppercase leading-[0.95] mt-4 text-text">
            How We <span className="text-blue">Work.</span>
          </h2>
        </div>

        {/* Stacking cards */}
        <div className="space-y-6">
          {steps.map((step, i) => (
            <div
              key={step.num}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="process-card relative rounded-[20px] p-8 md:p-12"
              style={{
                background: "var(--glass-process-bg, rgba(255,255,255,0.04))",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border:
                  "1px solid var(--glass-process-border, rgba(255,255,255,0.08))",
                willChange: "transform",
              }}
            >
              {/* Top row: number + label */}
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-blue text-lg md:text-xl font-bold">
                  {step.num}
                </span>
                <span className="font-mono text-offwhite/50 text-[10px] md:text-xs tracking-[0.2em] uppercase">
                  {step.label}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-anton text-[clamp(2rem,4vw,3.5rem)] uppercase leading-[0.95] text-text">
                {step.title}
                <span className="text-blue">.</span>
              </h3>

              {/* Description */}
              <p className="text-offwhite text-sm md:text-base leading-relaxed mt-4 max-w-xl">
                {step.desc}
              </p>

              {/* Icon bottom-right */}
              <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 text-blue/20">
                {step.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
