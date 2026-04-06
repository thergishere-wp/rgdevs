"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const moveDot = (e: MouseEvent) => {
      gsap.set(dot, { x: e.clientX - 6, y: e.clientY - 6 });
    };

    const moveRing = (e: MouseEvent) => {
      gsap.to(ring, {
        x: e.clientX - 20,
        y: e.clientY - 20,
        duration: 0.15,
        ease: "power2.out",
      });
    };

    const grow = () => {
      gsap.to(dot, { scale: 1.5, duration: 0.2 });
      gsap.to(ring, { scale: 1.4, duration: 0.2, borderColor: "#0055FF" });
    };

    const shrink = () => {
      gsap.to(dot, { scale: 1, duration: 0.2 });
      gsap.to(ring, {
        scale: 1,
        duration: 0.2,
        borderColor: "rgba(0,85,255,0.4)",
      });
    };

    window.addEventListener("mousemove", moveDot);
    window.addEventListener("mousemove", moveRing);

    const interactiveEls = document.querySelectorAll(
      "a, button, [role='button'], input, textarea, select"
    );
    interactiveEls.forEach((el) => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    return () => {
      window.removeEventListener("mousemove", moveDot);
      window.removeEventListener("mousemove", moveRing);
      interactiveEls.forEach((el) => {
        el.removeEventListener("mouseenter", grow);
        el.removeEventListener("mouseleave", shrink);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-3 h-3 rounded-full bg-blue pointer-events-none z-[10000] mix-blend-difference max-md:hidden"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-blue/40 pointer-events-none z-[10000] mix-blend-difference max-md:hidden"
      />
    </>
  );
}
