"use client";

const badgeStyles: Record<
  string,
  { dot: string; text: string; bg: string; animate?: string }
> = {
  // Platform status
  live: {
    dot: "bg-[#00FF78]",
    text: "text-[#00FF78]",
    bg: "rgba(0,255,120,0.12)",
    animate: "animate-pulse",
  },
  building: {
    dot: "bg-[#4488FF]",
    text: "text-[#4488FF]",
    bg: "rgba(0,85,255,0.12)",
    animate: "animate-spin",
  },
  maintenance: {
    dot: "bg-[#FFA500]",
    text: "text-[#FFA500]",
    bg: "rgba(255,165,0,0.12)",
  },
  // Ticket status
  open: { dot: "bg-[#4488FF]", text: "text-[#4488FF]", bg: "rgba(0,85,255,0.12)" },
  in_progress: { dot: "bg-[#FFA500]", text: "text-[#FFA500]", bg: "rgba(255,165,0,0.12)" },
  resolved: { dot: "bg-[#00FF78]", text: "text-[#00FF78]", bg: "rgba(0,255,120,0.12)" },
  closed: { dot: "bg-gray-500", text: "text-gray-400", bg: "rgba(128,128,128,0.12)" },
  // Priority
  low: { dot: "bg-gray-400", text: "text-gray-400", bg: "rgba(128,128,128,0.12)" },
  normal: { dot: "bg-[#4488FF]", text: "text-[#4488FF]", bg: "rgba(0,85,255,0.12)" },
  high: { dot: "bg-orange-500", text: "text-orange-400", bg: "rgba(255,165,0,0.12)" },
  urgent: { dot: "bg-red-500", text: "text-red-400", bg: "rgba(239,68,68,0.12)" },
  // Contact status
  new: { dot: "bg-[#4488FF]", text: "text-[#4488FF]", bg: "rgba(0,85,255,0.12)" },
  replied: { dot: "bg-[#00FF78]", text: "text-[#00FF78]", bg: "rgba(0,255,120,0.12)" },
  read: { dot: "bg-gray-500", text: "text-gray-400", bg: "rgba(128,128,128,0.12)" },
};

export default function StatusBadge({ status }: { status: string }) {
  const style = badgeStyles[status] || badgeStyles.normal;
  const label = status.replace(/_/g, " ");

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase rounded-lg ${style.text}`}
      style={{
        background: style.bg,
        border: `1px solid ${style.bg}`,
      }}
    >
      {status === "building" ? (
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className="animate-spin shrink-0"
        >
          <circle
            cx="5"
            cy="5"
            r="4"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="12 12"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <span className="relative w-1.5 h-1.5 shrink-0">
          <span className={`absolute inset-0 rounded-full ${style.dot}`} />
          {(status === "live" || style.animate === "animate-pulse") && (
            <span
              className={`absolute inset-0 rounded-full ${style.dot} animate-ping opacity-50`}
            />
          )}
        </span>
      )}
      {label}
    </span>
  );
}
