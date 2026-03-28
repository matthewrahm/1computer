"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";
import Image from "next/image";

interface InterstitialProps {
  quote: string;
  activeProgress: MotionValue<number>;
  bgImage?: string;
}

export function Interstitial({ quote, activeProgress, bgImage }: InterstitialProps) {
  const contentOpacity = useTransform(activeProgress, [0, 0.3], [0, 1]);
  const contentY = useTransform(activeProgress, [0, 0.3], [40, 0]);
  const contentScale = useTransform(activeProgress, [0, 0.3], [0.9, 1]);
  const contentBlur = useTransform(activeProgress, [0, 0.25], [6, 0]);
  const lineWidth = useTransform(activeProgress, [0.1, 0.5], [0, 96]);
  const bgScale = useTransform(activeProgress, [0, 1], [1.05, 1]);

  return (
    <div className="relative flex h-screen items-center justify-center px-6">
      {/* Optional background image */}
      {bgImage && (
        <motion.div className="absolute inset-0 overflow-hidden" style={{ scale: bgScale }}>
          <Image src={bgImage} alt="" fill className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/50" />
          <div className="absolute inset-0 bg-radial-[at_50%_50%] from-transparent via-background/30 to-background/80" />
        </motion.div>
      )}

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+120px)] h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"
        style={{ width: lineWidth }}
      />

      <motion.div
        className="relative max-w-4xl text-center"
        style={{
          scale: contentScale,
          opacity: contentOpacity,
          y: contentY,
          filter: useTransform(contentBlur, (v) => `blur(${v}px)`),
        }}
      >
        <p className="text-glow font-serif text-3xl font-light leading-snug text-text-primary sm:text-4xl md:text-5xl lg:text-6xl">
          &ldquo;{quote}&rdquo;
        </p>
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[calc(-50%+120px)] h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"
        style={{ width: lineWidth }}
      />
    </div>
  );
}
