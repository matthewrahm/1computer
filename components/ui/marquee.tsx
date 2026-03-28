"use client";

import { WarpStreaks } from "@/components/ui/warp-streaks";

interface MarqueeProps {
  text: string;
  reverse?: boolean;
  speed?: number;
  className?: string;
}

export function Marquee({ text, reverse = false, speed = 20, className = "" }: MarqueeProps) {
  const repeated = Array(6).fill(text).join(" ");
  return (
    <div className={`relative z-10 overflow-hidden border-y border-accent/5 py-4 ${className}`}>
      <WarpStreaks count={15} />
      <div
        className={`marquee-track flex whitespace-nowrap ${reverse ? "marquee-reverse" : ""}`}
        style={{ "--marquee-speed": `${speed}s` } as React.CSSProperties}
      >
        <span className="marquee-content font-mono text-sm uppercase tracking-[0.3em] text-accent/50">{repeated}</span>
        <span className="marquee-content font-mono text-sm uppercase tracking-[0.3em] text-accent/50">{repeated}</span>
      </div>
    </div>
  );
}
