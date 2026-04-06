"use client";

const items = [
  "Inventory Systems",
  "ERP Platforms",
  "Booking Systems",
  "Client Portals",
  "Dashboards",
  "Payment Integration",
  "Employee Platforms",
  "Analytics Tools",
];

export default function Marquee() {
  const repeated = [...items, ...items];

  return (
    <div className="w-full py-4 bg-blue/10 border-y border-border overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="font-mono text-sm text-blue-light mx-8 tracking-wider uppercase"
          >
            {item} <span className="text-border mx-4">{"/"}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
