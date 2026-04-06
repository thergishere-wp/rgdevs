"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const panels = [
  {
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    title: "Code That Scales",
    subtitle: "Enterprise-ready architecture",
  },
  {
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    title: "Cloud Native",
    subtitle: "Built for modern infrastructure",
  },
  {
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    title: "Data Driven",
    subtitle: "Real-time analytics & reporting",
  },
  {
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    title: "Always On",
    subtitle: "99.9% uptime guarantee",
  },
];

export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titlesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    // Only enable horizontal scroll on desktop
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const totalWidth = container.scrollWidth - window.innerWidth;

      const scrollTween = gsap.to(container, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.8,
          end: () => `+=${totalWidth}`,
          invalidateOnRefresh: true,
        },
      });

      // Animate each title as its panel enters viewport
      titlesRef.current.forEach((title) => {
        if (!title) return;
        gsap.fromTo(
          title,
          { clipPath: "inset(100% 0 0 0)", opacity: 0 },
          {
            clipPath: "inset(0% 0 0 0)",
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: title,
              containerAnimation: scrollTween,
              start: "left 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      return () => scrollTween.scrollTrigger?.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Desktop: horizontal scroll */}
      <div
        ref={containerRef}
        className="hidden md:flex horizontal-scroll-container"
      >
        {panels.map((panel, i) => (
          <div
            key={i}
            className="relative w-screen h-screen flex-shrink-0 overflow-hidden"
          >
            <Image
              src={panel.image}
              alt={panel.title}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-bg/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />

            {/* Panel number */}
            <span className="absolute top-8 left-8 font-mono text-blue/30 text-sm tracking-widest">
              0{i + 1} / 04
            </span>

            {/* Title overlay */}
            <div
              ref={(el) => { titlesRef.current[i] = el; }}
              className="absolute bottom-16 left-8 md:left-16"
            >
              <p className="font-mono text-blue text-xs tracking-wider uppercase mb-3">
                {panel.subtitle}
              </p>
              <h3 className="font-anton text-[clamp(2rem,6vw,5rem)] uppercase leading-[0.95] text-white">
                {panel.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: vertical stack */}
      <div className="md:hidden space-y-4 px-4 py-16">
        {panels.map((panel, i) => (
          <div
            key={i}
            className="relative aspect-[4/3] overflow-hidden"
          >
            <Image
              src={panel.image}
              alt={panel.title}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-bg/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="font-mono text-blue text-xs tracking-wider uppercase mb-2">
                {panel.subtitle}
              </p>
              <h3 className="font-anton text-3xl uppercase leading-[0.95] text-white">
                {panel.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
