"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Floating particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    const count = 40;

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
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,85,255,0.3)";
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

  // Section animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta-heading",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your_supabase")) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from("contacts").insert([
          {
            name: formState.name,
            email: formState.email,
            message: formState.message,
          },
        ]);
      }

      setSubmitted(true);
      setFormState({ name: "", email: "", message: "" });
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Giant background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[20vw] font-anton text-outline leading-none">
          START
        </span>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <div className="cta-heading">
          <span className="font-mono text-blue text-sm tracking-wider">
            04 / CONTACT
          </span>
          <h2 className="font-anton text-[clamp(2.5rem,6vw,4.5rem)] uppercase leading-[0.95] mt-4 text-text">
            Ready To Get
            <br />
            <span className="text-blue">Started?</span>
          </h2>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <a
              href="#contact-form"
              className="px-8 py-3 bg-blue text-white text-sm font-medium tracking-wide hover:bg-blue-light transition-colors duration-300"
            >
              Contact Us
            </a>
            <button
              onClick={() =>
                document
                  .getElementById("services")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-3 border border-border text-text text-sm font-medium tracking-wide hover:border-blue hover:text-blue transition-all duration-300"
            >
              See What We Build
            </button>
          </div>
        </div>

        {/* Contact form */}
        <div id="contact-form" className="mt-16">
          {submitted ? (
            <div className="bg-card border border-blue/30 p-8">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue/20 flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-blue"
                >
                  <path
                    d="M5 12L10 17L20 7"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3 className="font-barlow font-semibold text-lg text-text">
                Message Sent
              </h3>
              <p className="text-offwhite text-sm mt-2">
                We&apos;ll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={formState.name}
                  onChange={(e) =>
                    setFormState((s) => ({ ...s, name: e.target.value }))
                  }
                  className="w-full bg-card border border-border px-4 py-3 text-sm text-text placeholder:text-offwhite/40 focus:border-blue focus:outline-none transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={formState.email}
                  onChange={(e) =>
                    setFormState((s) => ({ ...s, email: e.target.value }))
                  }
                  className="w-full bg-card border border-border px-4 py-3 text-sm text-text placeholder:text-offwhite/40 focus:border-blue focus:outline-none transition-colors"
                />
              </div>
              <textarea
                placeholder="What do you need?"
                required
                rows={4}
                value={formState.message}
                onChange={(e) =>
                  setFormState((s) => ({ ...s, message: e.target.value }))
                }
                className="w-full bg-card border border-border px-4 py-3 text-sm text-text placeholder:text-offwhite/40 focus:border-blue focus:outline-none transition-colors resize-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-blue text-white text-sm font-medium tracking-wide hover:bg-blue-light transition-colors duration-300 disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
