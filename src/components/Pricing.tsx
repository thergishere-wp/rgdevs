"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface PricingTier {
  name: string;
  description: string;
  price: string;
  range: string;
  features: string[];
  featured?: boolean;
  reveal: {
    label: string;
    headline: string;
    perfectFor: string;
    body: string;
  };
}

const tiers: PricingTier[] = [
  {
    name: "Starter",
    description: "For founders who just need to look real, fast.",
    price: "$25",
    range: "$20 — $30 RANGE",
    features: [
      "Marketing site, up to 6 pages",
      "CMS so you can edit copy",
      "SEO + analytics setup",
      "Hosting + SSL included",
      "Monthly content updates",
    ],
    reveal: {
      label: "Deeper look · Starter",
      headline: "A fast, SEO-ready marketing site that actually converts — not a template from 2019.",
      perfectFor: "Restaurants, consultants, service businesses, personal brands, local shops going online for the first time.",
      body: "We build the visual system, copy structure, and page flows from scratch. You get editable content, real performance scores, and analytics wired up day one.",
    },
  },
  {
    name: "Commerce",
    description: "Sell online without giving Shopify a kidney.",
    price: "$75",
    range: "$65 — $85 RANGE",
    features: [
      "Storefront + checkout",
      "Stripe / Shopify payments",
      "Inventory + abandoned-cart",
      "Email + SMS automations",
      "Everything in Starter",
    ],
    featured: true,
    reveal: {
      label: "Deeper look · Commerce",
      headline: "A storefront built for selling — fast, owned, and hooked into every channel you care about.",
      perfectFor: "Product brands, boutique retailers, creators selling digital products.",
      body: "We handle storefront, checkout, inventory, and email flows. You focus on the product. Integrates with Shopify, Stripe, Klaviyo and the rest — your data stays yours.",
    },
  },
  {
    name: "Platform",
    description: "Internal tools, ERPs, mobile apps with real backends.",
    price: "$125",
    range: "$85 — $200 RANGE",
    features: [
      "Custom platform or mobile app",
      "Auth, roles, database, APIs",
      "iOS + Android via one codebase",
      "Dedicated build channel",
      "Everything in Commerce",
    ],
    reveal: {
      label: "Deeper look · Platform",
      headline: "The full build — database, auth, roles, APIs, everything your product needs to run.",
      perfectFor: "Founders building internal tools, SaaS MVPs, client portals, ERP systems, or mobile apps for iOS and Android.",
      body: "One codebase ships to web, iOS, and Android. Production infrastructure, role-based access, audit logs, integrations — plus a dedicated build channel for rapid iteration.",
    },
  },
];

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="shrink-0 mt-0.5"
      aria-hidden="true"
    >
      <path d="M2 7l3 3 7-7" />
    </svg>
  );
}

function TierCard({ tier }: { tier: PricingTier }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="tier-card-wrap relative flex flex-col cursor-pointer"
      style={{ perspective: "1400px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered((v) => !v)}
    >
      {tier.featured && (
        <div
          className="absolute z-30"
          style={{
            top: "-1px",
            right: "24px",
            background: "var(--cyan)",
            color: "#001015",
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "10px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            padding: "6px 12px",
            fontWeight: 600,
          }}
          aria-label="Most picked tier"
        >
          Most picked
        </div>
      )}

      {/* Front panel */}
      <AnimatePresence>
        {!hovered && (
          <motion.div
            key="front"
            initial={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 0.8, 0.2, 1] }}
            className="absolute inset-0 flex flex-col p-8 md:p-9"
            style={{ pointerEvents: hovered ? "none" : "auto" }}
          >
            <h3
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontWeight: 600,
                fontSize: "22px",
                letterSpacing: "-0.01em",
              }}
            >
              {tier.name}
            </h3>
            <p
              className="mt-1.5"
              style={{ color: "var(--muted)", fontSize: "13px", lineHeight: 1.5 }}
            >
              {tier.description}
            </p>
            <div className="mt-7 flex items-baseline gap-1.5">
              <span
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontWeight: 700,
                  fontSize: "54px",
                  letterSpacing: "-0.03em",
                  color: tier.featured ? "var(--cyan)" : "var(--text)",
                  textShadow: tier.featured ? "0 0 28px rgba(0,245,255,0.35)" : "none",
                }}
              >
                {tier.price}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: "13px",
                  color: "var(--muted)",
                }}
              >
                /month
              </span>
            </div>
            <div
              className="mt-1.5"
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "11px",
                color: "var(--dim)",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              {tier.range}
            </div>
            <ul className="mt-7 flex flex-col gap-3 flex-1">
              {tier.features.map((f, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3"
                  style={{ fontSize: "14px", color: "#C8CCE0" }}
                >
                  <span style={{ color: "var(--cyan)" }}>
                    <CheckIcon />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className="mt-7 block py-3.5 text-center transition-all duration-200 cursor-pointer"
              style={
                tier.featured
                  ? {
                      background: "var(--cyan)",
                      color: "#001015",
                      fontFamily: "var(--font-jetbrains), monospace",
                      fontSize: "11px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }
                  : {
                      border: "1px solid var(--line-2)",
                      fontFamily: "var(--font-jetbrains), monospace",
                      fontSize: "11px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "var(--text)",
                    }
              }
              onMouseEnter={(e) => {
                if (!tier.featured) {
                  e.currentTarget.style.borderColor = "var(--cyan)";
                  e.currentTarget.style.color = "var(--cyan)";
                  e.currentTarget.style.boxShadow = "var(--glow)";
                }
              }}
              onMouseLeave={(e) => {
                if (!tier.featured) {
                  e.currentTarget.style.borderColor = "var(--line-2)";
                  e.currentTarget.style.color = "var(--text)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              Start free month →
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reveal panel */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.45, ease: [0.22, 0.8, 0.2, 1] }}
            className="absolute inset-0 flex flex-col gap-4 z-20"
            style={{
              padding: tier.featured ? "52px 32px 32px" : "32px",
              background: "linear-gradient(180deg, #0C0C1F 0%, #070714 100%)",
              boxShadow: "inset 0 0 0 1px var(--cyan), 0 30px 80px rgba(0,0,0,0.5), inset 0 0 80px rgba(0,245,255,0.08)",
            }}
          >
            <div
              className="flex items-center gap-2.5"
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "10px",
                color: "var(--cyan)",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
              }}
            >
              <span
                className="w-5 h-px shrink-0"
                style={{ background: "var(--cyan)", boxShadow: "0 0 8px var(--cyan)" }}
                aria-hidden="true"
              />
              {tier.reveal.label}
            </div>
            <h4
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontWeight: 600,
                fontSize: "22px",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
                color: "var(--text)",
              }}
            >
              {tier.reveal.headline}
            </h4>
            <div
              className="p-3.5"
              style={{
                border: "1px dashed var(--line-2)",
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "11px",
                color: "var(--muted)",
                letterSpacing: "0.08em",
                lineHeight: 1.65,
              }}
            >
              <b
                style={{
                  color: "var(--cyan)",
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginRight: "8px",
                }}
              >
                Perfect for
              </b>
              {tier.reveal.perfectFor}
            </div>
            <p style={{ fontSize: "14px", color: "#C8CCE0", lineHeight: 1.65 }}>
              {tier.reveal.body}
            </p>
            <a
              href="#contact"
              className="mt-auto block py-3.5 text-center cursor-pointer transition-all duration-200"
              style={{
                background: "var(--cyan)",
                color: "#001015",
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "11px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#7CFEFF";
                e.currentTarget.style.letterSpacing = "0.28em";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--cyan)";
                e.currentTarget.style.letterSpacing = "0.22em";
              }}
            >
              Start free month →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Pricing() {
  const revealRefs = useRef<(HTMLElement | null)[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Auto-scroll loop on mobile only
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || window.innerWidth >= 768) return;

    let paused = false;
    let timer: ReturnType<typeof setTimeout>;

    const pause = () => { paused = true; clearTimeout(timer); timer = setTimeout(() => { paused = false; }, 3000); };
    grid.addEventListener("touchstart", pause, { passive: true });
    grid.addEventListener("touchend", pause, { passive: true });

    const tick = () => {
      if (!paused) {
        const cardW = (grid.querySelector<HTMLElement>(":scope > *")?.offsetWidth ?? 0) + 1;
        const maxScroll = grid.scrollWidth - grid.clientWidth;
        const next = grid.scrollLeft + cardW > maxScroll - 10 ? 0 : grid.scrollLeft + cardW;
        grid.scrollTo({ left: next, behavior: "smooth" });
      }
      timer = setTimeout(tick, 3200);
    };

    timer = setTimeout(tick, 3200);
    return () => { clearTimeout(timer); grid.removeEventListener("touchstart", pause); grid.removeEventListener("touchend", pause); };
  }, []);

  return (
    <section
      id="pricing"
      className="section-pad relative z-10"
      style={{ borderTop: "1px solid var(--line)" }}
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Header row */}
        <div
          ref={(el) => { revealRefs.current[0] = el; }}
          className="flex items-end justify-between gap-12 flex-wrap opacity-0 translate-y-7 transition-all duration-700"
        >
          <div>
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
              <span style={{ color: "var(--dim)" }}>04 ▍</span>
              Pricing
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
              }}
            >
              Subscribe.
              <br />
              Don&apos;t{" "}
              <em style={{ fontStyle: "normal", color: "var(--cyan)", textShadow: "0 0 32px rgba(0,245,255,0.35)" }}>
                commit
              </em>
              .
            </h2>
          </div>

          {/* Free badge */}
          <div
            className="relative px-5 py-3.5"
            style={{
              border: "1px solid var(--cyan)",
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "12px",
              color: "var(--cyan)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              boxShadow: "var(--glow)",
            }}
          >
            {/* Corner decorators */}
            <span
              className="absolute -left-px -top-px w-3 h-3"
              style={{ borderTop: "1px solid var(--cyan)", borderLeft: "1px solid var(--cyan)" }}
              aria-hidden="true"
            />
            <span
              className="absolute -right-px -bottom-px w-3 h-3"
              style={{ borderBottom: "1px solid var(--cyan)", borderRight: "1px solid var(--cyan)" }}
              aria-hidden="true"
            />
            First month — free, no card
          </div>
        </div>

        {/* Tier cards */}
        <div
          ref={(el) => { revealRefs.current[1] = el; }}
          ref={gridRef}
          className="pricing-grid mt-16 opacity-0 translate-y-7 transition-all duration-700 delay-150"
        >
          {tiers.map((tier, i) => (
            <div
              key={i}
              className="relative"
              style={{
                background: tier.featured ? "#0B0B1B" : "var(--surface)",
                outline: tier.featured ? "1px solid var(--cyan)" : "none",
                outlineOffset: "-1px",
                boxShadow: tier.featured ? "var(--glow)" : "none",
                zIndex: tier.featured ? 1 : 0,
              }}
            >
              <TierCard tier={tier} />
            </div>
          ))}
        </div>

        {/* Upfront note */}
        <div
          ref={(el) => { revealRefs.current[2] = el; }}
          className="mt-8 flex items-center gap-4 opacity-0 translate-y-7 transition-all duration-700 delay-200"
          style={{
            padding: "18px 22px",
            border: "1px dashed var(--line-2)",
            color: "var(--muted)",
            fontSize: "13px",
            fontFamily: "var(--font-jetbrains), monospace",
            letterSpacing: "0.05em",
          }}
        >
          <span
            style={{
              color: "var(--cyan)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontSize: "11px",
              flexShrink: 0,
            }}
          >
            Upfront cost
          </span>
          <span style={{ color: "var(--dim)" }}>/</span>
          <span>
            You only pay your domain (~
            <span style={{ color: "var(--text)" }}>$10–15</span>) once. Everything else is the monthly subscription. No setup fees, no design retainers, no contracts.
          </span>
        </div>
      </div>
    </section>
  );
}
