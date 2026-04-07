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
      // Reset scroll position of the modal itself
      if (backdropRef.current) backdropRef.current.scrollTop = 0;

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

  const handleGoogleLogin = async () => {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
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
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: "auto",
      }}
    >
      {/* Ambient glow — subtle */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(0,112,243,0.08) 0%, transparent 65%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(80px)",
        }}
      />

      {/* Card */}
      <div
        ref={cardRef}
        className="relative w-full max-w-md"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Fluid water-light border — 3 layers drifting at different speeds */}
        <div className="absolute -inset-[1px] overflow-hidden opacity-30">
          {/* Layer 1: slow drift top-left → bottom-right */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 120% 80% at 20% 20%, rgba(0,112,243,0.6), transparent 60%)",
              animation: "drift1 8s ease-in-out infinite alternate",
            }}
          />
          {/* Layer 2: medium drift bottom-right → top-left */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 80% 120% at 80% 80%, rgba(0,112,243,0.4), transparent 55%)",
              animation: "drift2 6s ease-in-out infinite alternate",
            }}
          />
          {/* Layer 3: gentle pulse center-ish */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 100% 60% at 50% 50%, rgba(0,112,243,0.25), transparent 50%)",
              animation: "drift3 10s ease-in-out infinite alternate",
            }}
          />
        </div>

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

            {/* Divider */}
            <div className="flex items-center gap-4 my-5">
              <div className="flex-1 h-px bg-border/50" />
              <span className="text-[10px] font-mono text-offwhite/40 tracking-wider">OR</span>
              <div className="flex-1 h-px bg-border/50" />
            </div>

            {/* Google OAuth */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 border border-border/50 text-text text-sm font-medium tracking-wide hover:border-blue/50 hover:bg-blue/5 transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="relative z-10">Continue with Google</span>
            </button>

            {/* Bottom info */}
            <div className="mt-5 pt-4 border-t border-border/50 text-center">
              <p className="text-[10px] text-offwhite/40 font-mono tracking-wider">
                SECURED BY SUPABASE AUTH · 256-BIT ENCRYPTION
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for fluid water-light drifting */}
      <style jsx>{`
        @keyframes drift1 {
          0% {
            transform: translate(-15%, -10%) scale(1);
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(15%, 10%) scale(1.15);
            opacity: 0.4;
          }
        }
        @keyframes drift2 {
          0% {
            transform: translate(10%, 15%) scale(1.1);
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: translate(-20%, -10%) scale(0.95);
            opacity: 0.7;
          }
        }
        @keyframes drift3 {
          0% {
            transform: translate(5%, -5%) scale(0.9) rotate(-3deg);
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            transform: translate(-5%, 8%) scale(1.2) rotate(3deg);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
