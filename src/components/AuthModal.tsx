"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import gsap from "gsap";

type Mode = "login" | "signup";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const backdropRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Animate open/close
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      const tl = gsap.timeline();
      tl.set(backdropRef.current, { display: "flex" });
      tl.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      tl.fromTo(
        cardRef.current,
        {
          scale: 0.85,
          opacity: 0,
          y: 60,
          rotateX: 15,
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.5,
          ease: "back.out(1.4)",
        },
        "-=0.15"
      );
      tl.fromTo(
        glowRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );
      tl.fromTo(
        contentRef.current?.children || [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" },
        "-=0.2"
      );
    } else {
      const tl = gsap.timeline({
        onComplete: () => {
          if (backdropRef.current) {
            gsap.set(backdropRef.current, { display: "none" });
          }
          document.body.style.overflow = "";
        },
      });
      tl.to(cardRef.current, {
        scale: 0.9,
        opacity: 0,
        y: 40,
        duration: 0.3,
        ease: "power2.in",
      });
      tl.to(
        backdropRef.current,
        { opacity: 0, duration: 0.2, ease: "power2.in" },
        "-=0.15"
      );
    }
  }, [isOpen]);

  // Animate mode switch
  useEffect(() => {
    if (contentRef.current && isOpen) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: mode === "signup" ? 30 : -30 },
        { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" }
      );
    }
    setError("");
    setEmail("");
    setPassword("");
    setFullName("");
  }, [mode]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = getSupabaseBrowser();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      // Shake animation on error
      gsap.fromTo(
        cardRef.current,
        { x: -8 },
        { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" }
      );
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      // Success pulse
      gsap.to(glowRef.current, {
        opacity: 0.8,
        scale: 1.3,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          onClose();
          if (profile?.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        },
      });
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = getSupabaseBrowser();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      gsap.fromTo(
        cardRef.current,
        { x: -8 },
        { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" }
      );
      return;
    }

    // Success animation then redirect
    gsap.to(glowRef.current, {
      opacity: 0.8,
      scale: 1.3,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        onClose();
        router.push("/onboarding");
      },
    });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[200] hidden items-center justify-center px-6"
      style={{
        background: "radial-gradient(ellipse at center, rgba(0,112,243,0.06) 0%, rgba(0,0,0,0.85) 100%)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        perspective: "1200px",
      }}
    >
      {/* Ambient glow */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none"
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(0,112,243,0.15) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(60px)",
        }}
      />

      {/* Card */}
      <div
        ref={cardRef}
        className="relative w-full max-w-md"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Animated border glow */}
        <div
          className="absolute -inset-[1px] opacity-60"
          style={{
            background: "linear-gradient(135deg, var(--color-blue), transparent 40%, transparent 60%, var(--color-blue))",
            animation: "borderRotate 4s linear infinite",
          }}
        />

        <div className="relative bg-card/95 backdrop-blur-xl border border-border/50 p-8 overflow-hidden">
          {/* Scanline effect */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
            }}
          />

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-offwhite hover:text-text transition-colors group"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="transition-transform group-hover:rotate-90 duration-300"
            >
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>

          {/* Tab switcher */}
          <div className="flex gap-0 mb-8 border-b border-border relative">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 pb-3 text-xs font-mono tracking-wider uppercase transition-colors ${
                mode === "login" ? "text-blue" : "text-offwhite hover:text-text"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 pb-3 text-xs font-mono tracking-wider uppercase transition-colors ${
                mode === "signup" ? "text-blue" : "text-offwhite hover:text-text"
              }`}
            >
              Sign Up
            </button>
            {/* Animated underline */}
            <div
              className="absolute bottom-0 h-[2px] bg-blue transition-all duration-300 ease-out"
              style={{
                left: mode === "login" ? "0%" : "50%",
                width: "50%",
              }}
            />
          </div>

          <div ref={contentRef}>
            {mode === "login" ? (
              <>
                <div className="mb-6">
                  <h2 className="font-anton text-2xl uppercase text-text">
                    Welcome <span className="text-blue">Back.</span>
                  </h2>
                  <p className="text-offwhite text-xs mt-1 font-mono">
                    Access your client portal
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block font-mono text-[10px] text-offwhite tracking-wider uppercase mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-bg/80 border border-border px-4 py-3 text-sm text-text placeholder:text-offwhite/20 focus:border-blue focus:outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(0,112,243,0.1)]"
                      placeholder="you@email.com"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-offwhite tracking-wider uppercase mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-bg/80 border border-border px-4 py-3 text-sm text-text placeholder:text-offwhite/20 focus:border-blue focus:outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(0,112,243,0.1)]"
                      placeholder="••••••••"
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-xs font-mono flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue text-white text-sm font-medium tracking-wide hover:bg-blue-light transition-all duration-300 disabled:opacity-50 relative overflow-hidden group"
                  >
                    <span className="relative z-10">
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Signing in...
                        </span>
                      ) : (
                        "Sign In"
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-light to-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="font-anton text-2xl uppercase text-text">
                    Get <span className="text-blue">Started.</span>
                  </h2>
                  <p className="text-offwhite text-xs mt-1 font-mono">
                    Create your account to access your portal
                  </p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="block font-mono text-[10px] text-offwhite tracking-wider uppercase mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-bg/80 border border-border px-4 py-3 text-sm text-text placeholder:text-offwhite/20 focus:border-blue focus:outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(0,112,243,0.1)]"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-offwhite tracking-wider uppercase mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-bg/80 border border-border px-4 py-3 text-sm text-text placeholder:text-offwhite/20 focus:border-blue focus:outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(0,112,243,0.1)]"
                      placeholder="you@email.com"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-offwhite tracking-wider uppercase mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-bg/80 border border-border px-4 py-3 text-sm text-text placeholder:text-offwhite/20 focus:border-blue focus:outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(0,112,243,0.1)]"
                      placeholder="Min 6 characters"
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-xs font-mono flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue text-white text-sm font-medium tracking-wide hover:bg-blue-light transition-all duration-300 disabled:opacity-50 relative overflow-hidden group"
                  >
                    <span className="relative z-10">
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating account...
                        </span>
                      ) : (
                        "Create Account"
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-light to-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </form>
              </>
            )}

            {/* Bottom info */}
            <div className="mt-6 pt-4 border-t border-border/50 text-center">
              <p className="text-[10px] text-offwhite/40 font-mono tracking-wider">
                SECURED BY SUPABASE AUTH · 256-BIT ENCRYPTION
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for border animation */}
      <style jsx>{`
        @keyframes borderRotate {
          0% {
            background: linear-gradient(
              0deg,
              var(--color-blue),
              transparent 40%,
              transparent 60%,
              var(--color-blue)
            );
          }
          25% {
            background: linear-gradient(
              90deg,
              var(--color-blue),
              transparent 40%,
              transparent 60%,
              var(--color-blue)
            );
          }
          50% {
            background: linear-gradient(
              180deg,
              var(--color-blue),
              transparent 40%,
              transparent 60%,
              var(--color-blue)
            );
          }
          75% {
            background: linear-gradient(
              270deg,
              var(--color-blue),
              transparent 40%,
              transparent 60%,
              var(--color-blue)
            );
          }
          100% {
            background: linear-gradient(
              360deg,
              var(--color-blue),
              transparent 40%,
              transparent 60%,
              var(--color-blue)
            );
          }
        }
      `}</style>
    </div>
  );
}
