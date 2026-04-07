"use client";

import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function GlassCard({ children, className = "", noPadding = false }: GlassCardProps) {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden ${noPadding ? "" : "p-6"} ${className}`}
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 0 40px rgba(0,0,0,0.4)",
      }}
    >
      {children}
    </div>
  );
}
