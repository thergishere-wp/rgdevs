"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: "01",
    title: "Discovery",
    desc: "We learn about your business, goals, and what you need the platform to do.",
  },
  {
    num: "02",
    title: "Design & Plan",
    desc: "We architect the solution, design the interface, and agree on scope.",
  },
  {
    num: "03",
    title: "Build",
    desc: "We develop your platform — fast, clean, tested. You see progress weekly.",
  },
  {
    num: "04",
    title: "Launch & Support",
    desc: "We deploy, monitor, and maintain. Updates and support included.",
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      stepsRef.current.forEach((step) => {
        if (!step) return;

        const line = step.querySelector(".step-line");
        const content = step.querySelector(".step-content");

        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.8,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
            },
          }
        );

        gsap.fromTo(
          content,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            delay: 0.3,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left */}
          <div className="lg:w-1/3">
            <span className="font-mono text-blue text-sm tracking-wider">
              02 / PROCESS
            </span>
            <h2 className="font-anton text-[clamp(2.5rem,5vw,4rem)] uppercase leading-[0.95] mt-4 text-white">
              Simple.
              <br />
              Fast.
              <br />
              <span className="text-blue">Done.</span>
            </h2>
          </div>

          {/* Right: Steps */}
          <div className="lg:w-2/3 space-y-0">
            {steps.map((step, i) => (
              <div
                key={step.num}
                ref={(el) => { stepsRef.current[i] = el; }}
                className="py-8"
              >
                {/* Animated line */}
                <div className="step-line h-px bg-border origin-left mb-8" />

                <div className="step-content flex gap-6 items-start">
                  <span className="font-mono text-blue/40 text-sm mt-1 shrink-0">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="font-barlow font-semibold text-xl text-white">
                      {step.title}
                    </h3>
                    <p className="text-offwhite text-sm mt-2 leading-relaxed max-w-md">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
