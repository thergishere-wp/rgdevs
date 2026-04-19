"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const monitorWrapRef = useRef<HTMLDivElement>(null);
  const monitorRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const screenChromeRef = useRef<HTMLDivElement>(null);
  const standRef = useRef<HTMLDivElement>(null);
  const t1Ref = useRef<HTMLDivElement>(null);
  const t2Ref = useRef<HTMLDivElement>(null);
  const heroMetaLRef = useRef<HTMLDivElement>(null);
  const heroMetaRRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const entryFxRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const aberrationRef = useRef<HTMLDivElement>(null);
  const crtFlashRef = useRef<HTMLDivElement>(null);
  const glyphRainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
    const easeInOut = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    // Populate glyph rain
    if (glyphRainRef.current && !glyphRainRef.current.textContent?.trim()) {
      const glyphs = "01{}<>/*=;→│─┤├┐└┘┌▓▒░█";
      let txt = "";
      for (let r = 0; r < 28; r++) {
        let line = "";
        for (let c = 0; c < 140; c++)
          line +=
            Math.random() < 0.6
              ? glyphs[Math.floor(Math.random() * glyphs.length)]
              : " ";
        txt += line + "\n";
      }
      glyphRainRef.current.textContent = txt;
    }

    function requiredScale() {
      const wrap = monitorWrapRef.current;
      if (!wrap) return 6;
      const wrapW = wrap.getBoundingClientRect().width || 640;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      return Math.max(vw / wrapW, vh / (wrapW * (10 / 16))) * 1.25;
    }

    let finalScale = requiredScale();
    const onResize = () => {
      finalScale = requiredScale();
    };
    window.addEventListener("resize", onResize);

    let cleanup: (() => void) | undefined;

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const st = ScrollTrigger.create({
        trigger: "#hero",
        start: "top top",
        end: "+=260%",
        pin: true,
        pinSpacing: true,
        scrub: 1.4,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          const pe = easeInOut(p);

          // Phase A: camera push in
          const phaseA = clamp(pe / 0.55);
          const scaleA = 1 + phaseA * (finalScale - 1);

          if (monitorWrapRef.current) {
            monitorWrapRef.current.style.transform = `translate(-50%, -55%) scale(${scaleA.toFixed(4)})`;
          }

          const bezel = clamp(1 - phaseA * 1.15);
          if (monitorRef.current) {
            monitorRef.current.style.borderColor = `rgba(31,31,54,${(bezel * 0.9).toFixed(3)})`;
            monitorRef.current.style.padding = `${18 * bezel}px`;
            monitorRef.current.style.borderRadius = `${14 * bezel}px`;
            monitorRef.current.style.boxShadow = `
              0 0 0 1px rgba(0,245,255,${(0.06 * bezel).toFixed(3)}),
              0 30px 80px rgba(0,0,0,${(0.7 * bezel).toFixed(3)}),
              0 0 ${80 * bezel}px rgba(0,245,255,${(0.22 * bezel).toFixed(3)}),
              inset 0 0 1px rgba(255,255,255,${(0.04 * bezel).toFixed(3)})
            `;
          }
          if (screenRef.current) {
            screenRef.current.style.borderRadius = `${6 * bezel}px`;
          }
          if (screenChromeRef.current) {
            screenChromeRef.current.style.opacity = clamp(1 - phaseA * 2).toString();
          }
          if (standRef.current) {
            standRef.current.style.opacity = clamp(1 - phaseA * 1.6).toString();
          }
          if (heroMetaLRef.current)
            heroMetaLRef.current.style.opacity = clamp(1 - phaseA * 2).toString();
          if (heroMetaRRef.current)
            heroMetaRRef.current.style.opacity = clamp(1 - phaseA * 2).toString();
          if (scrollCueRef.current)
            scrollCueRef.current.style.opacity = clamp(1 - phaseA * 3).toString();

          // Phase B: content swap t1 → t2
          const phaseB = clamp((pe - 0.35) / 0.45);
          const phaseBe = easeOut(phaseB);

          if (t1Ref.current) {
            const t1Scale = 1 + phaseBe * 0.2;
            t1Ref.current.style.transform = `scale(${t1Scale.toFixed(4)})`;
            t1Ref.current.style.opacity = clamp(1 - phaseB * 2.2).toString();
          }
          if (t2Ref.current) {
            const t2Scale = 0.88 + phaseBe * 0.32;
            t2Ref.current.style.transform = `scale(${t2Scale.toFixed(4)})`;
            t2Ref.current.style.opacity = clamp((phaseB - 0.05) * 2.2).toString();
          }

          // Entry FX
          const entry = clamp((pe - 0.5) / 0.25);
          const entryBell = Math.sin(entry * Math.PI);
          if (entryFxRef.current)
            entryFxRef.current.style.opacity = entryBell.toFixed(3);
          if (sweepRef.current) {
            sweepRef.current.style.transform = `translateY(${(entry * 280).toFixed(1)}%)`;
            sweepRef.current.style.opacity = entryBell.toFixed(3);
          }
          if (crtFlashRef.current)
            crtFlashRef.current.style.opacity = (entryBell * 0.65).toFixed(3);
          if (aberrationRef.current)
            aberrationRef.current.style.opacity = (entryBell * 0.9).toFixed(3);
          if (glyphRainRef.current)
            glyphRainRef.current.style.opacity = (entryBell * 0.4).toFixed(3);

          // Ambient cyan wash
          const wash = clamp((pe - 0.4) / 0.35);
          if (screenRef.current) {
            screenRef.current.style.boxShadow = `
              inset 0 0 ${60 + wash * 220}px rgba(0,245,255,${(0.08 + wash * 0.22).toFixed(3)}),
              inset 0 0 1px rgba(0,245,255,${(0.4 + wash * 0.4).toFixed(3)})
            `;
          }

          // Nav dim during hero
          const topnav = document.getElementById("topnav");
          if (topnav) topnav.style.opacity = clamp(1 - pe * 0.7).toString();
        },
      });

      cleanup = () => {
        st.kill();
        window.removeEventListener("resize", onResize);
      };
    };

    init();

    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{
        height: "100vh",
        minHeight: "680px",
        perspective: "1400px",
        perspectiveOrigin: "50% 45%",
        zIndex: 1,
      }}
    >
      {/* Room */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 60%, rgba(0,245,255,0.10), transparent 70%),
            radial-gradient(ellipse 80% 70% at 50% 100%, rgba(0,102,255,0.08), transparent 70%)
          `,
        }}
      >
        <div
          className="absolute left-0 right-0 bottom-0"
          style={{
            height: "50%",
            background: `
              linear-gradient(to top, rgba(0,245,255,0.04), transparent 60%),
              repeating-linear-gradient(to right, transparent 0 79px, rgba(255,255,255,0.02) 79px 80px),
              repeating-linear-gradient(to bottom, transparent 0 79px, rgba(255,255,255,0.02) 79px 80px)
            `,
            transform: "rotateX(70deg)",
            transformOrigin: "center top",
            opacity: 0.7,
          }}
          aria-hidden="true"
        />
        <div
          className="absolute left-0 right-0"
          style={{
            top: "64%",
            height: "1px",
            background: "linear-gradient(to right, transparent, rgba(0,245,255,0.4), transparent)",
            boxShadow: "0 0 20px rgba(0,245,255,0.25)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Reflection */}
      <div
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={{
          left: "50%",
          top: "calc(50% + 22vh)",
          transform: "translate(-50%, 0) scaleY(-1)",
          width: "min(540px, 60vw)",
          height: "160px",
          background: "radial-gradient(ellipse at top, rgba(0,245,255,0.18), transparent 70%)",
          filter: "blur(20px)",
          opacity: 0.7,
        }}
      />

      {/* Left meta */}
      <div
        ref={heroMetaLRef}
        className="absolute z-10 hidden sm:block"
        aria-hidden="true"
        style={{
          left: "32px",
          bottom: "80px",
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: "11px",
          color: "var(--muted)",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          lineHeight: 1.8,
        }}
      >
        <div>
          <span style={{ color: "var(--dim)" }}>STUDIO/</span>{" "}
          <span style={{ color: "var(--text)" }}>RG·DEVS</span>
        </div>
        <div>
          <span style={{ color: "var(--dim)" }}>LOC/</span>{" "}
          <span style={{ color: "var(--text)" }}>BANGKOK · TH</span>
        </div>
        <div>
          <span style={{ color: "var(--dim)" }}>EST/</span>{" "}
          <span style={{ color: "var(--text)" }}>2025</span>
        </div>
      </div>

      {/* Right meta */}
      <div
        ref={heroMetaRRef}
        className="absolute z-10 text-right hidden sm:block"
        aria-hidden="true"
        style={{
          right: "32px",
          bottom: "80px",
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: "11px",
          color: "var(--muted)",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          lineHeight: 1.8,
        }}
      >
        <div>
          <span style={{ color: "var(--dim)" }}>STACK/</span>{" "}
          <span style={{ color: "var(--text)" }}>CLAUDE · STITCH · VERCEL</span>
        </div>
        <div>
          <span style={{ color: "var(--dim)" }}>CYCLE/</span>{" "}
          <span style={{ color: "var(--text)" }}>7–14 DAYS</span>
        </div>
        <div>
          <span style={{ color: "var(--dim)" }}>MODE/</span>{" "}
          <span style={{ color: "var(--text)" }}>SUBSCRIPTION</span>
        </div>
      </div>

      {/* Monitor wrap */}
      <div
        ref={monitorWrapRef}
        id="monitorWrap"
        className="absolute"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -55%)",
          width: "min(640px, 70vw)",
          aspectRatio: "16 / 10",
          willChange: "transform",
        }}
      >
        <div
          ref={monitorRef}
          id="monitor"
          className="relative w-full h-full"
          style={{
            background: "#05050C",
            border: "1px solid #1F1F36",
            borderRadius: "14px",
            padding: "18px",
            boxShadow: `
              0 0 0 1px rgba(0,245,255,0.06),
              0 30px 80px rgba(0,0,0,0.7),
              0 0 60px rgba(0,245,255,0.18),
              inset 0 0 1px rgba(255,255,255,0.04)
            `,
          }}
        >
          {/* Bezel top highlight */}
          <div
            className="absolute pointer-events-none"
            aria-hidden="true"
            style={{
              left: "14%",
              right: "14%",
              top: 0,
              height: "1px",
              background: "linear-gradient(to right, transparent, rgba(0,245,255,0.5), transparent)",
            }}
          />

          {/* Screen */}
          <div
            ref={screenRef}
            id="screen"
            className="relative w-full h-full flex flex-col overflow-hidden"
            style={{
              background: "#02020A",
              borderRadius: "6px",
              boxShadow: "inset 0 0 60px rgba(0,245,255,0.08), inset 0 0 1px rgba(0,245,255,0.4)",
            }}
          >
            {/* Scanlines */}
            <div
              className="absolute inset-0 pointer-events-none"
              aria-hidden="true"
              style={{
                background: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.018) 0 1px, transparent 1px 3px)",
                mixBlendMode: "overlay",
              }}
            />
            {/* Vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              aria-hidden="true"
              style={{
                background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
              }}
            />

            {/* Chrome bar */}
            <div
              ref={screenChromeRef}
              className="flex items-center justify-between px-3 py-2"
              style={{
                borderBottom: "1px solid rgba(0,245,255,0.1)",
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "9px",
                color: "var(--dim)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
              aria-hidden="true"
            >
              <div className="flex gap-[5px]">
                <span
                  className="w-[7px] h-[7px] rounded-full"
                  style={{
                    background: "var(--cyan)",
                    boxShadow: "0 0 6px var(--cyan)",
                    border: "1px solid var(--cyan)",
                  }}
                />
                <span
                  className="w-[7px] h-[7px] rounded-full"
                  style={{ background: "#1A1A2E", border: "1px solid #262640" }}
                />
                <span
                  className="w-[7px] h-[7px] rounded-full"
                  style={{ background: "#1A1A2E", border: "1px solid #262640" }}
                />
              </div>
              <div>~/rg-devs/index.tsx</div>
              <div>02:14:07</div>
            </div>

            {/* Screen body */}
            <div className="flex-1 grid place-items-center relative p-5">
              {/* T1: Boot screen */}
              <div
                ref={t1Ref}
                className="absolute inset-0 grid place-items-center text-center p-6"
                style={{ transformOrigin: "center center", willChange: "transform, opacity" }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      fontSize: "11px",
                      color: "var(--cyan)",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                    }}
                  >
                    {"// boot sequence"}
                  </div>
                  <h1
                    className="mt-3.5"
                    style={{
                      fontFamily: "var(--font-space-grotesk), sans-serif",
                      fontWeight: 700,
                      fontSize: "clamp(38px, 6vw, 88px)",
                      letterSpacing: "-0.02em",
                      lineHeight: 0.95,
                      color: "var(--text)",
                      textShadow: "0 0 24px rgba(0,245,255,0.45)",
                    }}
                  >
                    RG&nbsp;DEVS
                    <span
                      className="inline-block"
                      aria-hidden="true"
                      style={{
                        width: "0.5ch",
                        background: "var(--cyan)",
                        boxShadow: "0 0 12px var(--cyan)",
                        marginLeft: "0.15ch",
                        animation: "blink 1.05s steps(1) infinite",
                        verticalAlign: "-0.08em",
                        height: "0.85em",
                      }}
                    />
                  </h1>
                  <div
                    className="mt-4"
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      fontSize: "11px",
                      color: "var(--muted)",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                    }}
                  >
                    Built by AI · Delivered fast · Worldwide
                  </div>
                </div>
              </div>

              {/* T2: Crossfade headline */}
              <div
                ref={t2Ref}
                className="absolute inset-0 grid place-items-center text-center p-6"
                style={{
                  opacity: 0,
                  transform: "scale(0.55)",
                  transformOrigin: "center center",
                  willChange: "transform, opacity",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      fontSize: "11px",
                      color: "var(--cyan)",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                    }}
                  >
                    {"// section_01 · what we build"}
                  </div>
                  <p
                    className="mt-3.5"
                    style={{
                      fontFamily: "var(--font-space-grotesk), sans-serif",
                      fontWeight: 700,
                      fontSize: "clamp(28px, 4.4vw, 64px)",
                      letterSpacing: "-0.025em",
                      lineHeight: 0.95,
                      color: "var(--text)",
                      textShadow: "0 0 24px rgba(0,245,255,0.35)",
                    }}
                  >
                    Five things.
                    <br />
                    Done{" "}
                    <em style={{ fontStyle: "normal", color: "var(--cyan)" }}>
                      properly
                    </em>
                    .
                  </p>
                </div>
              </div>

              {/* Entry FX */}
              <div
                ref={entryFxRef}
                className="absolute inset-0 pointer-events-none overflow-hidden"
                aria-hidden="true"
                style={{ opacity: 0, mixBlendMode: "screen", willChange: "opacity" }}
              >
                <div
                  ref={sweepRef}
                  className="absolute"
                  style={{
                    left: "-20%",
                    right: "-20%",
                    top: "-80%",
                    height: "60%",
                    background: `linear-gradient(180deg,
                      transparent 0%,
                      rgba(0,245,255,0) 40%,
                      rgba(0,245,255,0.35) 48%,
                      rgba(240,244,255,0.85) 50%,
                      rgba(0,245,255,0.35) 52%,
                      rgba(0,245,255,0) 60%,
                      transparent 100%)`,
                    filter: "blur(2px)",
                    willChange: "transform, opacity",
                  }}
                />
                <div
                  ref={aberrationRef}
                  className="absolute inset-0"
                  style={{ opacity: 0 }}
                />
                <div
                  ref={crtFlashRef}
                  className="absolute inset-0"
                  style={{
                    background: "radial-gradient(ellipse at center, rgba(240,244,255,0.9) 0%, rgba(0,245,255,0.4) 30%, transparent 60%)",
                    opacity: 0,
                  }}
                />
                <div
                  ref={glyphRainRef}
                  className="absolute inset-0 overflow-hidden p-3"
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "11px",
                    color: "rgba(0,245,255,0.55)",
                    letterSpacing: "0.1em",
                    lineHeight: 1.2,
                    opacity: 0,
                    whiteSpace: "pre",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Stand */}
          <div
            ref={standRef}
            id="monitorStand"
            className="absolute"
            style={{
              left: "50%",
              top: "100%",
              transform: "translate(-50%, 0)",
              width: "10%",
              height: "18%",
              background: "linear-gradient(to bottom, #0E0E1C, #05050C)",
              borderLeft: "1px solid #1A1A2E",
              borderRight: "1px solid #1A1A2E",
            }}
            aria-hidden="true"
          >
            <div
              className="absolute"
              style={{
                left: "-200%",
                right: "-200%",
                top: "100%",
                height: "6px",
                background: "#0A0A14",
                borderTop: "1px solid #1A1A2E",
                borderRadius: "2px",
                boxShadow: "0 8px 30px rgba(0,245,255,0.15)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        ref={scrollCueRef}
        className="absolute flex flex-col items-center gap-2.5"
        aria-hidden="true"
        style={{
          left: "50%",
          bottom: "64px",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: "10px",
          color: "var(--muted)",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
        }}
      >
        <span>Scroll to enter</span>
        <div
          className="w-px h-9"
          style={{
            background: "linear-gradient(to bottom, var(--cyan), transparent)",
            animation: "drop 2s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}
