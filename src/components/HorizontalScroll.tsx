"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const panels = [
  {
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80",
    title: "Code That Scales",
    subtitle: "Enterprise-ready architecture",
    body: "Enterprise-ready architecture built to handle thousands of users. Clean, maintainable code that grows with your business without breaking.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
    title: "Always Connected",
    subtitle: "Cloud-native infrastructure",
    body: "Cloud-native infrastructure with 99.9% uptime. Real-time data sync, live dashboards, and instant notifications — your platform never sleeps.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    title: "Data Driven",
    subtitle: "Real-time analytics & reporting",
    body: "Every decision backed by real insights. Custom analytics, automated reports, and dashboards that turn raw data into clear actions.",
  },
];

export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [mobileVisible, setMobileVisible] = useState<boolean[]>(
    panels.map(() => false)
  );

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
          onUpdate: (self) => {
            // Update progress bar
            if (progressRef.current) {
              progressRef.current.style.width = `${self.progress * 100}%`;
            }
            // Update counter
            if (counterRef.current) {
              const idx =
                Math.min(
                  Math.floor(self.progress * panels.length),
                  panels.length - 1
                ) + 1;
              counterRef.current.textContent = `0${idx}`;
            }
          },
        },
      });

      // Per-panel animations
      titlesRef.current.forEach((title, i) => {
        if (!title) return;
        const img = imagesRef.current[i];
        const titleText = panels[i].title;
        const bodyEl = title.querySelector(".panel-body");

        // Image slow zoom 1.0 → 1.08 while pinned
        if (img) {
          gsap.fromTo(
            img,
            { scale: 1 },
            {
              scale: 1.08,
              ease: "none",
              scrollTrigger: {
                trigger: img,
                containerAnimation: scrollTween,
                start: "left 100%",
                end: "right 0%",
                scrub: true,
              },
            }
          );
        }

        // Title clip-path reveal
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

        // Body text fade in with delay
        if (bodyEl) {
          gsap.fromTo(
            bodyEl,
            { opacity: 0, y: 15 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
              scrollTrigger: {
                trigger: title,
                containerAnimation: scrollTween,
                start: "left 70%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      return () => scrollTween.scrollTrigger?.kill();
    });

    return () => mm.revert();
  }, [triggerGlitch]);

  // Mobile: IntersectionObserver
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth >= 768) return;

    const cards = document.querySelectorAll(".mobile-hscroll-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(
              (entry.target as HTMLElement).dataset.index || 0
            );
            setMobileVisible((prev) => {
              const next = [...prev];
              next[idx] = true;
              return next;
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
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
            <div
              ref={(el) => {
                imagesRef.current[i] = el;
              }}
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

            {/* Counter top-right */}
            <div className="absolute top-8 right-8 font-mono text-offwhite/30 text-sm tracking-widest">
              <span ref={i === 0 ? counterRef : undefined}>01</span>
              <span> / 0{panels.length}</span>
            </div>

            <div
              ref={(el) => {
                titlesRef.current[i] = el;
              }}
              className="absolute bottom-16 left-8 md:left-16 max-w-xl"
            >
              <p className="font-mono text-blue text-xs tracking-wider uppercase mb-3">
                {panel.subtitle}
              </p>
              <h3 className="font-anton text-[clamp(2rem,6vw,5rem)] uppercase leading-[0.95] text-white">
                {panel.title}
              </h3>
              <p className="panel-body text-offwhite/80 text-sm leading-relaxed mt-4 max-w-md opacity-0">
                {panel.body}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar at bottom */}
      <div className="hidden md:block fixed bottom-0 left-0 w-full h-[2px] bg-border/20 z-50 pointer-events-none hscroll-progress-wrap">
        <div
          ref={progressRef}
          className="h-full bg-blue transition-none"
          style={{ width: "0%" }}
        />
      </div>

      {/* Mobile: vertical cards */}
      <div className="md:hidden space-y-4 px-4 py-16">
        {panels.map((panel, i) => (
          <div
            key={i}
            data-index={i}
            className={`mobile-hscroll-card relative overflow-hidden transition-all duration-700 ${
              mobileVisible[i]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ height: "280px", borderRadius: "12px" }}
          >
            <Image
              src={panel.image}
              alt={panel.title}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-bg/60" />
            <div
              className="absolute inset-0"
              style={{ background: "var(--gradient-bottom)" }}
            />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-mono text-blue text-xs tracking-wider uppercase mb-2">
                {panel.subtitle}
              </p>
              <h3 className="font-anton text-2xl uppercase leading-[0.95] text-white">
                {panel.title}
              </h3>
              <p className="text-offwhite/70 text-xs leading-relaxed mt-2">
                {panel.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
