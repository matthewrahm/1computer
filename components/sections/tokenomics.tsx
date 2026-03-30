"use client";

import { motion } from "framer-motion";
import { GlitchText } from "@/components/ui/glitch-text";
import { FrostDivider } from "@/components/ui/frost-divider";

const segments = [
  { label: "Liquidity Pool", percent: 40, color: "#4d9fff" },
  { label: "Community", percent: 30, color: "#3a7fdd" },
  { label: "Marketing", percent: 20, color: "#6db3ff" },
  { label: "Team", percent: 10, color: "#2a6bbf" },
];

const bigStats = [
  { label: "Total Supply", value: "1B" },
  { label: "Locked", value: "100%" },
  { label: "Mint", value: "REVOKED" },
];

function AnimatedStat({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay, ease: "easeOut" }}>
      <div className="gradient-border">
        <div className="p-6 text-center">
          <p className="font-mono text-3xl font-bold text-accent sm:text-4xl">{value}</p>
          <p className="mt-2 text-xs uppercase tracking-wider text-text-muted">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

function DonutChart() {
  let cumulativePercent = 0;
  return (
    <div className="relative mx-auto h-64 w-64 sm:h-72 sm:w-72">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        {segments.map((seg, i) => {
          const radius = 35;
          const circumference = 2 * Math.PI * radius;
          const strokeDasharray = `${(seg.percent / 100) * circumference} ${circumference}`;
          const strokeDashoffset = -(cumulativePercent / 100) * circumference;
          cumulativePercent += seg.percent;
          return (
            <motion.circle key={seg.label} cx="50" cy="50" r={radius} fill="none" stroke={seg.color} strokeWidth="12" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.2 }} />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-xl font-bold text-accent">$DREAM</span>
      </div>
    </div>
  );
}

export function Tokenomics() {
  return (
    <div className="flex h-screen items-center justify-center px-6">
      <div className="mx-auto max-w-4xl">
        <GlitchText text="The Numbers" as="h2" className="font-display mb-8 text-left text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl" />
        <div className="mb-10 grid grid-cols-3 gap-4">
          {bigStats.map((stat, i) => (<AnimatedStat key={stat.label} label={stat.label} value={stat.value} delay={i * 0.1} />))}
        </div>
        <FrostDivider />
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
          <DonutChart />
          <div className="flex flex-col gap-4">
            {segments.map((seg) => (
              <div key={seg.label} className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: seg.color }} />
                <span className="text-text-secondary">{seg.label}</span>
                <span className="ml-auto font-mono text-text-primary">{seg.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
