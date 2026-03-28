"use client";

import { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface WarpStreaksProps { count?: number; }
interface Streak { id: number; top: string; left: string; width: number; opacity: number; }

export function WarpStreaks({ count = 20 }: WarpStreaksProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => { setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);

  const streaks: Streak[] = useMemo(() => {
    const seed = [0.08, 0.92, 0.23, 0.67, 0.41, 0.85, 0.14, 0.56, 0.73, 0.31, 0.96, 0.19, 0.62, 0.44, 0.77, 0.05, 0.88, 0.35, 0.51, 0.69];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      top: `${seed[i % seed.length] * 90 + 5}%`,
      left: `${seed[(i + 7) % seed.length] * 80 + 10}%`,
      width: seed[(i + 3) % seed.length] * 40 + 20,
      opacity: seed[(i + 5) % seed.length] * 0.4 + 0.2,
    }));
  }, [count]);

  if (reducedMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      {streaks.map((streak) => (
        <motion.div
          key={streak.id}
          className="absolute h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
          style={{ top: streak.top, left: streak.left, width: streak.width }}
          initial={{ scaleX: 1, opacity: 0 }}
          animate={{ scaleX: [1, 8, 1], opacity: [0, streak.opacity * 0.6, streak.opacity, streak.opacity * 0.6, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: streak.id * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
