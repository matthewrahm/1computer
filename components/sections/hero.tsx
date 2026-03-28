"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { CosmicOrb } from "@/components/ui/cosmic-orb";

const titleWords = ["1 Computer,", "1 Dream"];

interface HeroProps { activeProgress: MotionValue<number>; }

export function Hero({ activeProgress }: HeroProps) {
  const orbScale = useTransform(activeProgress, [0, 0.36], [1.1, 1]);
  const orbBlur = useTransform(activeProgress, [0, 0.29], [6, 0]);
  const orbY = useTransform(activeProgress, [0, 0.71], [0, -60]);

  const word1Opacity = useTransform(activeProgress, [0.21, 0.50], [0, 1]);
  const word1Blur = useTransform(activeProgress, [0.21, 0.50], [12, 0]);
  const word2Opacity = useTransform(activeProgress, [0.43, 0.71], [0, 1]);
  const word2Blur = useTransform(activeProgress, [0.43, 0.71], [12, 0]);

  const wordOpacities = [word1Opacity, word2Opacity];
  const wordBlurs = [word1Blur, word2Blur];

  const ctaOpacity = useTransform(activeProgress, [0.64, 0.86], [0, 1]);
  const ctaY = useTransform(activeProgress, [0.64, 0.86], [30, 0]);
  const indicatorOpacity = useTransform(activeProgress, [0, 0.14], [0.4, 0]);

  return (
    <div className="flex h-screen flex-col items-center justify-center overflow-hidden px-6">
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat" }} />

      {/* Mountain background */}
      <div className="absolute inset-0 overflow-hidden">
        <Image src="/images/gallery/mountain-peaks.jpeg" alt="" fill className="object-cover opacity-15" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </div>

      <div className="relative flex w-full max-w-4xl flex-col items-center">
        <motion.div style={{ scale: orbScale, y: orbY, filter: useTransform(orbBlur, (v) => `blur(${v}px)`) }} className="mb-12">
          <CosmicOrb scrollProgress={activeProgress} />
        </motion.div>

        <h1 className="text-glow mb-8 py-2 text-center font-display font-bold leading-[1.2] tracking-tight">
          {titleWords.map((word, i) => (
            <motion.span key={word} style={{ opacity: wordOpacities[i], filter: useTransform(wordBlurs[i], (v) => `blur(${v}px)`) }} className={`animate-gradient-text inline-block pb-[0.15em] text-5xl sm:text-6xl md:text-7xl lg:text-8xl${i < titleWords.length - 1 ? " mr-[0.3em]" : ""}`}>
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.div style={{ opacity: ctaOpacity, y: ctaY }} className="flex flex-col items-center">
          <p className="mb-4 font-mono text-sm tracking-[0.3em] text-accent-muted">$1COMPUTER</p>
          <p className="mb-6 font-serif text-lg text-text-muted italic">WiFi and a vision. That&apos;s the whole playbook.</p>
          <div className="mb-6 h-px w-32 bg-gradient-to-r from-transparent via-accent-muted/40 to-transparent" />
          <div className="flex gap-4">
            <button onClick={() => document.getElementById("manifesto")?.scrollIntoView({ behavior: "smooth" })} className="btn-secondary">Explore</button>
            <button onClick={() => document.getElementById("buy")?.scrollIntoView({ behavior: "smooth" })} className="btn-primary px-8 ring-1 ring-accent/20">Buy $1COMPUTER</button>
          </div>
        </motion.div>
      </div>

      <motion.div style={{ opacity: indicatorOpacity }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown className="h-5 w-5 text-text-muted" />
        </motion.div>
      </motion.div>
    </div>
  );
}
