"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface FAQItem {
  num: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    num: "Q.01",
    question: "Do I own my website?",
    answer:
      "You always own your domain — it's registered in your name from day one. The platform we build runs on enterprise infrastructure (Vercel, Supabase) and stays live as long as you subscribe. If you ever leave, we hand you the full codebase.",
  },
  {
    num: "Q.02",
    question: "What does \"AI-built\" actually mean?",
    answer:
      "We use Claude (Anthropic's AI) to handle the development heavy lifting — writing code, designing components, debugging. A human (us) writes the brief, reviews every output, and makes sure it's right. You get agency-quality results in a fraction of the time.",
  },
  {
    num: "Q.03",
    question: "How fast is fast?",
    answer:
      "We can have a first draft live within 48 hours of a clear brief. Full builds typically take 3–7 days. Complex platforms, 2–3 weeks. We'll always give you a timeline before we start.",
  },
  {
    num: "Q.04",
    question: "What if I want to cancel?",
    answer:
      "Cancel anytime, no questions asked. There are no contracts, no cancellation fees, no lock-in. Your domain stays yours forever.",
  },
  {
    num: "Q.05",
    question: "Do you work with clients outside Thailand?",
    answer:
      "Yes — we're based in Bangkok but fully remote and work with clients globally. All communication is async-friendly and we work across timezones.",
  },
  {
    num: "Q.06",
    question: "Is this just a template?",
    answer:
      "Never. Every project is designed and built from scratch for your brand. We use AI to build faster, not to recycle layouts.",
  },
];

function FAQItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div
      style={{ borderTop: "1px solid var(--line)" }}
    >
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center gap-8 px-8 py-6 text-left cursor-pointer transition-colors duration-200"
        style={{
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: "20px",
          fontWeight: 500,
          letterSpacing: "-0.01em",
          color: isOpen ? "var(--cyan)" : "var(--text)",
          background: "transparent",
        }}
        aria-expanded={isOpen}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--surface-2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        <span className="flex items-center">
          <span
            className="mr-5"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "11px",
              color: "var(--dim)",
              letterSpacing: "0.22em",
            }}
          >
            {item.num}
          </span>
          {item.question}
        </span>

        {/* Plus/minus icon */}
        <span
          className="w-7 h-7 shrink-0 grid place-items-center relative transition-all duration-300"
          style={{
            border: isOpen ? "1px solid var(--cyan)" : "1px solid var(--line-2)",
            color: isOpen ? "var(--cyan)" : "var(--muted)",
            boxShadow: isOpen ? "0 0 12px rgba(0,245,255,0.4)" : "none",
          }}
          aria-hidden="true"
        >
          {/* Horizontal bar */}
          <span
            className="absolute w-2.5 h-px"
            style={{ background: "currentColor" }}
          />
          {/* Vertical bar */}
          <span
            className="absolute w-px h-2.5 transition-transform duration-300"
            style={{
              background: "currentColor",
              transform: isOpen ? "scaleY(0)" : "scaleY(1)",
            }}
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 0.8, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-8 pb-7">
              <div
                className="pl-[68px] pt-1"
                style={{
                  borderLeft: "1px solid var(--line-2)",
                  color: "#C8CCE0",
                  lineHeight: 1.65,
                  fontSize: "15px",
                  maxWidth: "72ch",
                }}
              >
                {item.answer}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const revealRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!revealRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("opacity-100", "translate-y-0");
            e.target.classList.remove("opacity-0", "translate-y-7");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(revealRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="faq"
      className="section-pad relative z-10"
      style={{ borderTop: "1px solid var(--line)" }}
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div
          ref={(el) => { revealRef.current = el; }}
          className="opacity-0 translate-y-7 transition-all duration-700"
        >
          <div
            className="flex items-center gap-2.5"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "11px",
              color: "var(--cyan)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: "var(--dim)" }}>05 ▍</span>
            FAQ
            <span className="flex-1 h-px max-w-[80px]" style={{ background: "var(--line)" }} aria-hidden="true" />
          </div>
          <h2
            className="mt-4"
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontWeight: 700,
              fontSize: "clamp(40px, 5.4vw, 76px)",
              lineHeight: 0.98,
              letterSpacing: "-0.025em",
              maxWidth: "14ch",
            }}
          >
            Questions we get a{" "}
            <em style={{ fontStyle: "normal", color: "var(--cyan)", textShadow: "0 0 32px rgba(0,245,255,0.35)" }}>
              lot
            </em>
            .
          </h2>
        </div>

        {/* FAQ list */}
        <div
          className="mt-16"
          style={{
            border: "1px solid var(--line)",
            background: "var(--surface)",
          }}
        >
          {faqs.map((item, i) => (
            <FAQItem
              key={i}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
