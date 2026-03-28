"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";
import Image from "next/image";

interface CosmicOrbProps { scrollProgress?: MotionValue<number>; }

export function CosmicOrb({ scrollProgress }: CosmicOrbProps) {
  const fallback = { get: () => 0, on: () => () => {} } as unknown as MotionValue<number>;
  const progress = scrollProgress ?? fallback;

  const borderRadius = useTransform(progress, [0.07, 0.36], ["50%", "50%"]);
  const containerSize = 280;
  const effectsOpacity = useTransform(progress, [0.07, 0.29], [1, 0]);
  const overlayOpacity = useTransform(progress, [0.07, 0.36], [1, 0]);

  return (
    <motion.div className="relative flex items-center justify-center">
      {[0, 1, 2].map((i) => (
        <motion.div key={i} className="sonar-ring absolute rounded-full border border-white/15" style={{ width: "140%", height: "140%", animationDelay: `${i * 1}s`, opacity: effectsOpacity }} />
      ))}
      <motion.div className="orb-glow-pulse absolute rounded-full" style={{ width: "130%", height: "130%", background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 40%, transparent 70%)", opacity: effectsOpacity }} />
      <motion.div className="relative overflow-hidden" style={{ width: containerSize, height: containerSize, borderRadius, background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.15) 0%, rgba(3,5,16,0.9) 60%, #020308 100%)", boxShadow: "0 0 60px rgba(255,255,255,0.08), 0 0 120px rgba(255,255,255,0.03), inset 0 0 80px rgba(0,0,0,0.6)" }}>
        <Image src="/images/1computer-hero.jpeg" alt="1 Computer 1 Dream" width={280} height={280} className="h-full w-full object-cover" priority />
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(3,5,16,0.6) 70%, rgba(3,5,16,1) 100%)" }} />
        <motion.div className="pointer-events-none absolute inset-0" style={{ mixBlendMode: "luminosity", background: "rgba(3,5,16,0.5)", opacity: overlayOpacity }} />
        <motion.div className="pointer-events-none absolute left-[15%] top-[10%] rounded-full" style={{ width: "35%", height: "20%", background: "radial-gradient(ellipse, rgba(255,255,255,0.18) 0%, transparent 70%)", filter: "blur(4px)", opacity: effectsOpacity }} />
      </motion.div>
    </motion.div>
  );
}
