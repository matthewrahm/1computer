"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpaceSectionProps { children: React.ReactNode; className?: string; id?: string; scrollHeight?: string; }

export function SpaceSection({ children, className, id, scrollHeight = "150vh" }: SpaceSectionProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: outerRef, offset: ["start end", "end start"] });

  const scale = useTransform(scrollYProgress, [0, 0.2, 0.75, 1], [0.8, 1, 1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.78, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.78, 1], [60, 0, 0, -30]);
  const blur = useTransform(scrollYProgress, [0, 0.15, 0.82, 1], [6, 0, 0, 3]);

  return (
    <div ref={outerRef} style={{ minHeight: scrollHeight }}>
      <motion.section id={id} style={{ scale, opacity, y, filter: useTransform(blur, (v) => `blur(${v}px)`) }} className={cn("relative", className)}>
        {children}
      </motion.section>
    </div>
  );
}

export { SpaceSection as SectionWrapper };
