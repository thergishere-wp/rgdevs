"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const panels = [
  {
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&q=90",
    title: "Code That Scales",
    subtitle: "Enterprise-ready architecture",
  },
  {
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=90",
    title: "Cloud Native",
    subtitle: "Built for modern infrastructure",
  },
  {
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&q=90",
    title: "Data Driven",
    subtitle: "Real-time analytics & reporting",
  },
  {
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&q=90",
    title: "Cyber Secure",
    subtitle: "Zero-trust security model",
  },
  {
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1920&q=90",
    title: "AI Powered",
    subtitle: "Intelligent automation built in",
  },
  {
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=90",
    title: "Always On",
    subtitle: "99.9% uptime guarantee",
  },
  {
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&q=90",
    title: "Team Sync",
    subtitle: "Real-time collaboration tools",
  },
  {
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1920&q=90",
    title: "Ship Fast",
    subtitle: "From concept to production in days",
  },
];

export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);

  const triggerGlitch = useCallback((el: HTMLElement, text: string) => {
    el.setAttribute("data-text", text);
    el.classList.add("glitch-active");
    setTimeout(() => el.classList.remove("glitch-active"), 400);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

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

      // Title reveals with glitch + image zoom
      titlesRef.current.forEach((title, i) => {
        if (!title) return;
        const img = imagesRef.current[i];
        const titleText = panels[i].title;

        // Image zoom on enter
        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.2 },
            {
              scale: 1,
              duration: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: img,
                containerAnimation: scrollTween,
                start: "left 90%",
                end: "left 20%",
                scrub: 0.5,
              },
            }
          );
        }

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
              onEnter: () => {
                const h3 = title.querySelector("h3");
                if (h3) triggerGlitch(h3 as HTMLElement, titleText);
              },
              onEnterBack: () => {
                const h3 = title.querySelector("h3");
                if (h3) triggerGlitch(h3 as HTMLElement, titleText);
              },
            },
          }
        );
      });

      return () => scrollTween.scrollTrigger?.kill();
    });

    return () => mm.revert();
  }, [triggerGlitch]);

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
            <div
              ref={(el) => { imagesRef.current[i] = el; }}
              className="absolute inset-0"
            >
              <Image
                src={panel.image}
                alt={panel.title}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
            <div className="absolute inset-0 bg-bg/60" />
            <div
              className="absolute inset-0"
              style={{ background: "var(--gradient-bottom)" }}
            />

            <span className="absolute top-8 left-8 font-mono text-blue/30 text-sm tracking-widest">
              0{i + 1} / 0{panels.length}
            </span>

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
          <div key={i} className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={panel.image}
              alt={panel.title}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-bg/50" />
            <div
              className="absolute inset-0"
              style={{ background: "var(--gradient-bottom)" }}
            />
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
