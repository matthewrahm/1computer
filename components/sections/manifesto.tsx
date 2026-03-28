"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";
import Image from "next/image";

const lines = [
  "They said you need connections.",
  "You need money.",
  "You need luck.",
];

const punchline = "All you needed was one computer.";

interface ManifestoProps { activeProgress: MotionValue<number>; }

export function Manifesto({ activeProgress }: ManifestoProps) {
  const imgOpacity = useTransform(activeProgress, [0, 0.15], [0, 1]);
  const imgScale = useTransform(activeProgress, [0, 0.2], [1.1, 1]);
  const imgX = useTransform(activeProgress, [0, 0.15], [-40, 0]);

  const lineTransforms = lines.map((_, i) => {
    const start = 0.15 + i * 0.12;
    const end = start + 0.12;
    return {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      opacity: useTransform(activeProgress, [start, end], [0, 1]),
      // eslint-disable-next-line react-hooks/rules-of-hooks
      y: useTransform(activeProgress, [start, end], [25, 0]),
    };
  });

  const punchOpacity = useTransform(activeProgress, [0.60, 0.75], [0, 1]);
  const punchBlur = useTransform(activeProgress, [0.60, 0.75], [10, 0]);
  const punchY = useTransform(activeProgress, [0.60, 0.75], [20, 0]);
  const punchScale = useTransform(activeProgress, [0.60, 0.75], [0.95, 1]);

  return (
    <div className="flex h-screen items-center px-6 md:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 md:flex-row md:gap-16">
        {/* Image — left side */}
        <motion.div
          style={{ opacity: imgOpacity, scale: imgScale, x: imgX }}
          className="relative w-full overflow-hidden rounded-2xl md:w-1/2"
        >
          <div className="relative aspect-[4/5]">
            <Image
              src="/images/gallery/green-field.jpeg"
              alt="One computer in an open field"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/60 md:bg-gradient-to-r" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>
        </motion.div>

        {/* Text — right side */}
        <div className="flex w-full flex-col gap-5 md:w-1/2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-muted">The Doubt</p>

          {lines.map((line, i) => (
            <motion.p
              key={i}
              style={{ opacity: lineTransforms[i].opacity, y: lineTransforms[i].y }}
              className="font-serif text-2xl font-light text-text-secondary sm:text-3xl md:text-4xl"
            >
              {line}
            </motion.p>
          ))}

          <div className="my-2 h-px w-24 bg-accent/20" />

          <motion.p
            style={{
              opacity: punchOpacity,
              y: punchY,
              scale: punchScale,
              filter: useTransform(punchBlur, (v) => `blur(${v}px)`),
            }}
            className="text-glow font-serif text-3xl font-light text-accent sm:text-4xl md:text-5xl"
          >
            {punchline}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
