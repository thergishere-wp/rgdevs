"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import gsap from "gsap";

const platformTypes = [
  {
    id: "website",
    label: "Company Website",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="5" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 24h10M14 21v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "webapp",
    label: "Web Application",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="3" width="22" height="22" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 9h22" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="6.5" cy="6" r="1" fill="currentColor" />
        <circle cx="9.5" cy="6" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "erp",
    label: "ERP / Business Platform",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 8h20M4 14h20M4 20h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="18" y="16" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: "custom",
    label: "Something Custom",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4l3 6 6.5 1-4.7 4.6 1.1 6.5L14 19l-5.9 3.1 1.1-6.5L4.5 11l6.5-1L14 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const plans = [
  { id: "starter", name: "Starter", price: 20, desc: "Websites & landing pages" },
  { id: "pro", name: "Pro", price: 25, desc: "Web apps & portals" },
  { id: "enterprise", name: "Enterprise", price: 30, desc: "ERP & complex systems" },
];

interface StartProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StartProjectModal({ isOpen, onClose }: StartProjectModalProps) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [quickMode, setQuickMode] = useState(false);

  const backdropRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Animate open/close
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (backdropRef.current) backdropRef.current.scrollTop = 0;
      setStep(1);
      setSelectedType("");
      setSelectedPlan("");
      setFormData({ name: "", email: "", company: "", message: "" });
      setQuickMode(false);

      const tl = gsap.timeline();
      tl.set(backdropRef.current, { display: "flex" });
      tl.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
      tl.fromTo(
        cardRef.current,
        { scale: 0.95, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
        "-=0.15"
      );
    } else {
      const tl = gsap.timeline({
        onComplete: () => {
          if (backdropRef.current) gsap.set(backdropRef.current, { display: "none" });
          document.body.style.overflow = "";
        },
      });
      tl.to(cardRef.current, { scale: 0.95, opacity: 0, y: 20, duration: 0.25, ease: "power2.in" });
      tl.to(backdropRef.current, { opacity: 0, duration: 0.2, ease: "power2.in" }, "-=0.1");
    }
  }, [isOpen]);

  // Animate step transitions
  useEffect(() => {
    if (contentRef.current && isOpen) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [step, quickMode, isOpen]);

  // ESC key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const canProceed = () => {
    if (step === 1) return !!selectedType;
    if (step === 2) return !!selectedPlan;
    if (step === 3) return formData.name && formData.email && formData.message;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (url && key) {
        const supabase = createClient(url, key);
        await supabase.from("contacts").insert([{
          name: formData.name,
          email: formData.email,
          company: formData.company || null,
          message: formData.message,
          platform_type: quickMode ? null : selectedType,
          selected_plan: quickMode ? null : selectedPlan,
          status: "new",
        }]);
      }
      setStep(4);
    } catch {
      setStep(4);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await handleSubmit();
  };

  const next = () => {
    if (step === 3) {
      handleSubmit();
    } else {
      setStep((s) => Math.min(s + 1, 4));
    }
  };

  const back = () => setStep((s) => Math.max(s - 1, 1));

  const progress = quickMode ? 100 : (step / 4) * 100;

  return (
    <div
      ref={backdropRef}
      onClick={(e) => e.target === backdropRef.current && onClose()}
      className="fixed inset-0 z-[200] hidden items-center justify-center px-4"
      style={{
        background: "rgba(6,6,8,0.92)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: "auto",
      }}
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-[560px] rounded-3xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Progress bar */}
        <div className="h-[2px] bg-border/20">
          <div
            className="h-full bg-blue transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-offwhite hover:text-text transition-colors group z-10"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform group-hover:rotate-90 duration-300">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>

        <div ref={contentRef} className="p-8 md:p-10">
          {quickMode ? (
            /* Quick contact form */
            <form onSubmit={handleQuickSubmit}>
              <h3 className="font-anton text-2xl uppercase text-text mb-1">
                Quick <span className="text-blue">Contact.</span>
              </h3>
              <p className="text-offwhite text-xs font-mono mb-6">Just the essentials</p>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((s) => ({ ...s, name: e.target.value }))}
                  className="w-full px-4 py-3 text-sm rounded-lg"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((s) => ({ ...s, email: e.target.value }))}
                  className="w-full px-4 py-3 text-sm rounded-lg"
                />
                <textarea
                  placeholder="What do you need?"
                  required
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData((s) => ({ ...s, message: e.target.value }))}
                  className="w-full px-4 py-3 text-sm rounded-lg resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-6 py-3 bg-blue text-white text-sm font-medium rounded-lg hover:bg-blue-light transition-colors disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>

              <button
                type="button"
                onClick={() => { setQuickMode(false); setStep(1); }}
                className="w-full mt-3 text-xs text-offwhite hover:text-blue transition-colors font-mono"
              >
                ← Back to full form
              </button>
            </form>
          ) : step === 1 ? (
            /* Step 1: Platform type */
            <>
              <p className="font-mono text-blue text-xs tracking-wider mb-2">STEP 1 OF 4</p>
              <h3 className="font-anton text-2xl uppercase text-text mb-8">
                What do you <span className="text-blue">need?</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {platformTypes.map((pt) => (
                  <button
                    key={pt.id}
                    onClick={() => setSelectedType(pt.id)}
                    className={`flex flex-col items-center justify-center gap-3 p-5 rounded-xl text-center transition-all duration-300 ${
                      selectedType === pt.id
                        ? "border-blue bg-blue/10 text-blue"
                        : "border-border/30 text-offwhite hover:text-text hover:border-offwhite/20"
                    }`}
                    style={{
                      border: `1px solid ${selectedType === pt.id ? "rgba(0,85,255,0.5)" : "rgba(255,255,255,0.08)"}`,
                      background: selectedType === pt.id ? "rgba(0,85,255,0.1)" : "rgba(255,255,255,0.03)",
                    }}
                  >
                    {pt.icon}
                    <span className="text-xs font-mono tracking-wide">{pt.label}</span>
                  </button>
                ))}
              </div>
            </>
          ) : step === 2 ? (
            /* Step 2: Plan */
            <>
              <p className="font-mono text-blue text-xs tracking-wider mb-2">STEP 2 OF 4</p>
              <h3 className="font-anton text-2xl uppercase text-text mb-8">
                Which plan <span className="text-blue">fits?</span>
              </h3>

              <div className="space-y-3">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300`}
                    style={{
                      border: `1px solid ${selectedPlan === plan.id ? "rgba(0,85,255,0.5)" : "rgba(255,255,255,0.08)"}`,
                      background: selectedPlan === plan.id ? "rgba(0,85,255,0.1)" : "rgba(255,255,255,0.03)",
                    }}
                  >
                    <div className="text-left">
                      <p className={`font-barlow font-semibold ${selectedPlan === plan.id ? "text-blue" : "text-text"}`}>
                        {plan.name}
                      </p>
                      <p className="text-offwhite text-xs mt-0.5">{plan.desc}</p>
                    </div>
                    <span className={`font-anton text-2xl ${selectedPlan === plan.id ? "text-blue" : "text-text"}`}>
                      ${plan.price}
                    </span>
                  </button>
                ))}
              </div>

              <p className="text-offwhite/40 text-xs font-mono text-center mt-4">
                Not sure? We&apos;ll help you decide.
              </p>
            </>
          ) : step === 3 ? (
            /* Step 3: Details */
            <>
              <p className="font-mono text-blue text-xs tracking-wider mb-2">STEP 3 OF 4</p>
              <h3 className="font-anton text-2xl uppercase text-text mb-8">
                Tell us about <span className="text-blue">you.</span>
              </h3>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((s) => ({ ...s, name: e.target.value }))}
                  className="w-full px-4 py-3 text-sm rounded-lg"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((s) => ({ ...s, email: e.target.value }))}
                  className="w-full px-4 py-3 text-sm rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Your business / company name"
                  value={formData.company}
                  onChange={(e) => setFormData((s) => ({ ...s, company: e.target.value }))}
                  className="w-full px-4 py-3 text-sm rounded-lg"
                />
                <textarea
                  placeholder="Briefly describe what you need..."
                  required
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData((s) => ({ ...s, message: e.target.value }))}
                  className="w-full px-4 py-3 text-sm rounded-lg resize-none"
                />
              </div>
            </>
          ) : (
            /* Step 4: Success */
            <div className="text-center py-4">
              {/* Animated checkmark */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue/15 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="check-draw">
                  <path
                    d="M8 16l6 6 10-12"
                    stroke="#0055FF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      strokeDasharray: 30,
                      strokeDashoffset: 0,
                      animation: "drawCheck 0.6s ease forwards",
                    }}
                  />
                </svg>
              </div>

              <h3 className="font-anton text-2xl uppercase text-text">
                You&apos;re all <span className="text-blue">set!</span>
              </h3>
              <p className="text-offwhite text-sm mt-2">
                We&apos;ll reach out within 24 hours.
              </p>

              <div className="mt-6 text-left rounded-xl p-5" style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}>
                <p className="text-offwhite text-xs font-mono tracking-wider uppercase mb-3">
                  What to expect:
                </p>
                <ul className="space-y-2 text-sm text-offwhite">
                  <li className="flex items-start gap-2">
                    <span className="text-blue mt-0.5">→</span>
                    A quick intro call or chat to align on scope
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue mt-0.5">→</span>
                    Design mockups within 48 hours of kickoff
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue mt-0.5">→</span>
                    Your platform live and ready within days
                  </li>
                </ul>
              </div>

              <button
                onClick={onClose}
                className="mt-6 px-8 py-3 bg-blue text-white text-sm font-medium rounded-lg hover:bg-blue-light transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {/* Navigation buttons (steps 1-3) */}
          {!quickMode && step < 4 && (
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={back}
                className={`text-sm font-mono text-offwhite hover:text-text transition-colors ${
                  step === 1 ? "invisible" : ""
                }`}
              >
                ← Back
              </button>
              <button
                onClick={next}
                disabled={!canProceed() || submitting}
                className="px-6 py-2.5 bg-blue text-white text-sm font-medium rounded-lg hover:bg-blue-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {step === 3 ? (submitting ? "Sending..." : "Submit") : "Next →"}
              </button>
            </div>
          )}

          {/* Quick contact toggle */}
          {!quickMode && step < 4 && (
            <div className="mt-6 pt-4 border-t border-border/20 text-center">
              <button
                onClick={() => setQuickMode(true)}
                className="text-xs text-offwhite/50 hover:text-blue transition-colors font-mono"
              >
                Prefer to keep it simple? → <span className="text-blue/70">quick contact</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes drawCheck {
          from { stroke-dashoffset: 30; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
