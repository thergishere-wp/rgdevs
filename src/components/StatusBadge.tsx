"use client";

const badgeStyles: Record<string, { dot: string; text: string; bg: string }> = {
  // Platform status
  live: { dot: "bg-green-500", text: "text-green-400", bg: "bg-green-500/10" },
  building: { dot: "bg-blue", text: "text-blue-light", bg: "bg-blue/10" },
  maintenance: { dot: "bg-yellow-500", text: "text-yellow-400", bg: "bg-yellow-500/10" },
  // Ticket status
  open: { dot: "bg-blue", text: "text-blue-light", bg: "bg-blue/10" },
  in_progress: { dot: "bg-yellow-500", text: "text-yellow-400", bg: "bg-yellow-500/10" },
  resolved: { dot: "bg-green-500", text: "text-green-400", bg: "bg-green-500/10" },
  closed: { dot: "bg-gray-500", text: "text-gray-400", bg: "bg-gray-500/10" },
  // Priority
  low: { dot: "bg-gray-400", text: "text-gray-400", bg: "bg-gray-400/10" },
  normal: { dot: "bg-blue", text: "text-blue-light", bg: "bg-blue/10" },
  high: { dot: "bg-orange-500", text: "text-orange-400", bg: "bg-orange-500/10" },
  urgent: { dot: "bg-red-500", text: "text-red-400", bg: "bg-red-500/10" },
  // Contact status
  new: { dot: "bg-blue", text: "text-blue-light", bg: "bg-blue/10" },
  read: { dot: "bg-gray-500", text: "text-gray-400", bg: "bg-gray-500/10" },
};

export default function StatusBadge({ status }: { status: string }) {
  const style = badgeStyles[status] || badgeStyles.normal;
  const label = status.replace(/_/g, " ");

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase ${style.text} ${style.bg} rounded-sm`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot} shrink-0`} />
      {label}
    </span>
  );
}
