"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      // Eyebrow
      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );

      // Headline lines with clip-path
      [line1Ref, line2Ref, line3Ref].forEach((ref) => {
        tl.fromTo(
          ref.current,
          { clipPath: "inset(100% 0 0 0)", y: 60 },
          {
            clipPath: "inset(0% 0 0 0)",
            y: 0,
            duration: 0.8,
            ease: "power4.out",
          },
          `-=0.5`
        );
      });

      // Subtext
      tl.fromTo(
        subtextRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.3"
      );

      // Scroll indicator
      tl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        "-=0.2"
      );

      // Image parallax
      gsap.to(imageRef.current, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      // Background number
      tl.fromTo(
        numberRef.current,
        { opacity: 0, x: 50 },
        { opacity: 0.03, x: 0, duration: 1, ease: "power2.out" },
        "-=1"
      );

      // Scroll indicator line animation
      gsap.to(".scroll-line", {
        scaleY: 1,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen w-full overflow-hidden flex items-end"
    >
      {/* Background number */}
      <span
        ref={numberRef}
        className="absolute bottom-0 right-0 text-[30vw] font-anton leading-none text-white opacity-0 select-none pointer-events-none"
      >
        001
      </span>

      {/* Parallax image */}
      <div
        ref={imageRef}
        className="absolute top-0 right-0 w-1/2 h-[120%] max-md:w-full max-md:opacity-20"
      >
        <Image
          src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80"
          alt="Code on screen"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-16 md:pb-24">
        <p
          ref={eyebrowRef}
          className="font-mono text-sm text-blue mb-6 opacity-0 tracking-wider"
        >
          {"// Web Platforms Built Different"}
        </p>

        <h1 className="font-anton uppercase leading-[0.9] tracking-tight">
          <div ref={line1Ref} className="text-[clamp(3rem,10vw,8rem)] text-white">
            We Build
          </div>
          <div
            ref={line2Ref}
            className="text-[clamp(3rem,10vw,8rem)] text-outline-blue"
          >
            Platforms
          </div>
          <div ref={line3Ref} className="text-[clamp(3rem,10vw,8rem)] text-blue">
            That Work.
          </div>
        </h1>

        <div className="flex items-end justify-between mt-12">
          <p
            ref={subtextRef}
            className="text-offwhite text-sm md:text-base max-w-md leading-relaxed opacity-0"
          >
            Custom web platforms, ERP systems, and dashboards — built fast,
            priced fair, maintained forever.
          </p>

          {/* Scroll indicator */}
          <div
            ref={scrollIndicatorRef}
            className="hidden md:flex flex-col items-center gap-2 opacity-0"
          >
            <span className="text-xs font-mono text-offwhite tracking-widest uppercase">
              Scroll
            </span>
            <div className="w-px h-12 bg-border relative overflow-hidden">
              <div className="scroll-line absolute top-0 left-0 w-full h-full bg-blue origin-top scale-y-0" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
