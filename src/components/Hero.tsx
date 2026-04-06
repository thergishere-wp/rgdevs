"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  // Particle network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number }[] = [];
    const count = 60;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,85,255,${0.15 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,85,255,0.6)";
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Spotlight follows cursor
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (spotlightRef.current) {
      spotlightRef.current.style.background = `radial-gradient(300px circle at ${e.clientX}px ${e.clientY}px, rgba(0,85,255,0.06), transparent 70%)`;
    }
  }, []);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );

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

      tl.fromTo(
        subtextRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.3"
      );

      tl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        "-=0.2"
      );

      tl.fromTo(
        numberRef.current,
        { opacity: 0, x: 50 },
        { opacity: 0.03, x: 0, duration: 1, ease: "power2.out" },
        "-=1"
      );

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
      onMouseMove={handleMouseMove}
    >
      {/* Video background */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          poster="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80"
        >
          <source
            src="https://videos.pexels.com/video-files/5894094/5894094-hd_1920_1080_30fps.mp4"
            type="video/mp4"
          />
        </video>
        {/* Fallback image behind video */}
        <Image
          src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80"
          alt="Code on screen"
          fill
          className="object-cover -z-10"
          priority
          sizes="100vw"
        />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-bg/50" />
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-overlay)" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-bottom)" }}
      />

      {/* Scanlines */}
      <div className="absolute inset-0 scanlines pointer-events-none" />

      {/* Particle network canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      />

      {/* Cursor spotlight */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none z-[2]"
      />

      {/* Background number */}
      <span
        ref={numberRef}
        className="absolute bottom-0 right-0 text-[30vw] font-anton leading-none text-text opacity-0 select-none pointer-events-none"
      >
        001
      </span>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-16 md:pb-24">
        <p
          ref={eyebrowRef}
          className="font-mono text-sm text-blue mb-6 opacity-0 tracking-wider"
        >
          {"// Web Platforms Built Different"}
        </p>

        <h1 className="font-anton uppercase leading-[0.9] tracking-tight">
          <div
            ref={line1Ref}
            className="text-[clamp(3rem,10vw,8rem)] text-text"
          >
            We Build
          </div>
          <div
            ref={line2Ref}
            className="text-[clamp(3rem,10vw,8rem)] text-outline-blue"
          >
            Platforms
          </div>
          <div
            ref={line3Ref}
            className="text-[clamp(3rem,10vw,8rem)] text-blue"
          >
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
