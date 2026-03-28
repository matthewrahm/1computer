"use client";

import { useEffect, useRef } from "react";

const layers = [
  { gradient: "radial-gradient(ellipse 60% 50% at 20% 30%, rgba(77,159,255,0.05) 0%, transparent 70%)", blur: 60, parallax: 0.02, drift: "nebula-drift-1", driftDuration: "25s" },
  { gradient: "radial-gradient(ellipse 50% 60% at 75% 60%, rgba(58,127,221,0.045) 0%, transparent 70%)", blur: 80, parallax: 0.04, drift: "nebula-drift-2", driftDuration: "32s" },
  { gradient: "radial-gradient(ellipse 70% 40% at 50% 20%, rgba(77,159,255,0.035) 0%, transparent 70%)", blur: 50, parallax: 0.06, drift: "nebula-drift-3", driftDuration: "28s" },
  { gradient: "radial-gradient(circle at 30% 70%, rgba(109,179,255,0.045) 0%, transparent 60%)", blur: 70, parallax: 0.03, drift: "nebula-drift-2", driftDuration: "35s" },
  { gradient: "radial-gradient(ellipse 40% 80% at 80% 25%, rgba(77,159,255,0.045) 0%, transparent 65%)", blur: 55, parallax: 0.05, drift: "nebula-drift-1", driftDuration: "40s" },
  { gradient: "radial-gradient(ellipse 55% 45% at 65% 55%, rgba(42,107,191,0.035) 0%, transparent 70%)", blur: 65, parallax: 0.035, drift: "nebula-drift-3", driftDuration: "38s" },
  { gradient: "radial-gradient(ellipse 80% 40% at 25% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)", blur: 100, parallax: 0.015, drift: "nebula-drift-1", driftDuration: "45s" },
  { gradient: "radial-gradient(ellipse 70% 50% at 70% 40%, rgba(255,255,255,0.025) 0%, transparent 65%)", blur: 120, parallax: 0.025, drift: "nebula-drift-4", driftDuration: "50s" },
  { gradient: "radial-gradient(ellipse 90% 35% at 50% 65%, rgba(255,255,255,0.02) 0%, transparent 75%)", blur: 90, parallax: 0.03, drift: "nebula-drift-3", driftDuration: "55s" },
];

export function NebulaField() {
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let scrollY = 0;
    let ticking = false;

    const handleScroll = () => {
      scrollY = window.scrollY;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          for (let i = 0; i < layers.length; i++) {
            const el = layerRefs.current[i];
            if (el) {
              const offset = Math.sin(scrollY * layers[i].parallax * 0.02) * 60;
              el.style.transform = `translateY(${offset}px)`;
            }
          }
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {layers.map((layer, i) => (
        <div
          key={i}
          ref={(el) => { layerRefs.current[i] = el; }}
          className="pointer-events-none fixed inset-0 z-[1]"
          style={{ background: layer.gradient, filter: `blur(${layer.blur}px)`, willChange: "transform", animation: `${layer.drift} ${layer.driftDuration} ease-in-out infinite` }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
