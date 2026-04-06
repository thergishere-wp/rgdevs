"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    num: "01",
    title: "Web Applications",
    desc: "Full-stack web apps with authentication, real-time data, and seamless UX.",
  },
  {
    num: "02",
    title: "ERP Systems",
    desc: "Multi-module enterprise platforms for inventory, HR, and operations.",
  },
  {
    num: "03",
    title: "Client Portals",
    desc: "Branded portals where your customers manage accounts, orders, and support.",
  },
  {
    num: "04",
    title: "Booking & Scheduling",
    desc: "Reservation systems with calendar sync, payments, and notifications.",
  },
  {
    num: "05",
    title: "Dashboards & Analytics",
    desc: "Real-time dashboards with charts, reports, and data-driven insights.",
  },
  {
    num: "06",
    title: "Payment Integration",
    desc: "Stripe, PayPal, and custom billing flows built into your platform.",
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        headingRef.current,
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

      // Cards stagger animation
      const cards = cardsRef.current?.children;
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 80, rotateX: 8 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.7,
            stagger: 0.1,
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

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.04]">
        <Image
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=60"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left side */}
          <div ref={headingRef} className="lg:w-1/3 lg:sticky lg:top-32 lg:self-start">
            <span className="font-mono text-blue text-sm tracking-wider">
              01 / SERVICES
            </span>
            <h2 className="font-anton text-[clamp(2.5rem,5vw,4rem)] uppercase leading-[0.95] mt-4 text-white">
              What We
              <br />
              <span className="text-blue">Build.</span>
            </h2>
            <p className="text-offwhite mt-6 leading-relaxed text-sm">
              From simple websites to complex enterprise systems — everything
              custom, nothing templated.
            </p>
          </div>

          {/* Right: Cards grid */}
          <div
            ref={cardsRef}
            className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {services.map((service) => (
              <div
                key={service.num}
                className="group bg-card border border-border p-6 hover:border-blue/30 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="text-blue"
                  >
                    <path
                      d="M5 15L15 5M15 5H5M15 5V15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>

                <span className="font-mono text-blue/40 text-xs">
                  {service.num}
                </span>
                <h3 className="font-barlow font-semibold text-lg mt-3 text-white group-hover:text-blue transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-offwhite text-sm mt-2 leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
