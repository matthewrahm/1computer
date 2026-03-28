"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";
import Image from "next/image";

const proofs = [
  { stat: "Bedroom", text: "Where Apple, Amazon, Google, and Dell all started" },
  { stat: "Zero", text: "Dollars needed to learn to code in 2026" },
  { stat: "WiFi", text: "The only barrier between you and the entire world" },
  { stat: "1", text: "Computer. That's the whole list." },
];

interface TheProofProps { activeProgress: MotionValue<number>; }

export function TheProof({ activeProgress }: TheProofProps) {
  const imgOpacity = useTransform(activeProgress, [0.05, 0.2], [0, 1]);
  const imgScale = useTransform(activeProgress, [0.05, 0.25], [1.08, 1]);
  const imgX = useTransform(activeProgress, [0.05, 0.2], [40, 0]);

  const headerOpacity = useTransform(activeProgress, [0.1, 0.25], [0, 1]);
  const headerY = useTransform(activeProgress, [0.1, 0.25], [20, 0]);

  const proofTransforms = proofs.map((_, i) => {
    const start = 0.30 + i * 0.12;
    const end = start + 0.10;
    return {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      opacity: useTransform(activeProgress, [start, end], [0, 1]),
      // eslint-disable-next-line react-hooks/rules-of-hooks
      x: useTransform(activeProgress, [start, end], [-20, 0]),
    };
  });

  return (
    <div className="flex h-screen items-center px-6 md:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-10 md:flex-row md:gap-16">
        {/* Text — left side */}
        <div className="flex w-full flex-col gap-6 md:w-1/2">
          <motion.div style={{ opacity: headerOpacity, y: headerY }}>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-muted">The Proof</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
              The internet doesn&apos;t care about your resume.
            </h2>
          </motion.div>

          <div className="flex flex-col gap-4">
            {proofs.map((proof, i) => (
              <motion.div
                key={i}
                style={{ opacity: proofTransforms[i].opacity, x: proofTransforms[i].x }}
                className="flex items-baseline gap-4 border-l-2 border-accent/20 pl-4"
              >
                <span className="font-mono text-lg font-bold text-accent">{proof.stat}</span>
                <span className="text-text-secondary">{proof.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Image — right side */}
        <motion.div
          style={{ opacity: imgOpacity, scale: imgScale, x: imgX }}
          className="relative w-full overflow-hidden rounded-2xl md:w-1/2"
        >
          <div className="relative aspect-[3/4]">
            <Image
              src="/images/gallery/book-tunnel.jpeg"
              alt="Surrounded by knowledge"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background/60 md:bg-gradient-to-l" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
