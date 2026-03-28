"use client";

import { useEffect, useRef } from "react";

const layers = [
  {
    gradient: "radial-gradient(ellipse 90% 30% at 20% 75%, rgba(255,255,255,0.04) 0%, transparent 70%)",
    blur: 80,
    parallax: 0.02,
    drift: "nebula-drift-1",
    driftDuration: "30s",
  },
  {
    gradient: "radial-gradient(ellipse 80% 25% at 70% 68%, rgba(255,255,255,0.035) 0%, transparent 65%)",
    blur: 100,
    parallax: 0.03,
    drift: "nebula-drift-2",
    driftDuration: "38s",
  },
  {
    gradient: "radial-gradient(ellipse 100% 20% at 40% 80%, rgba(200,220,240,0.03) 0%, transparent 70%)",
    blur: 120,
    parallax: 0.015,
    drift: "nebula-drift-3",
    driftDuration: "42s",
  },
  {
    gradient: "radial-gradient(ellipse 70% 35% at 85% 72%, rgba(255,255,255,0.025) 0%, transparent 60%)",
    blur: 90,
    parallax: 0.04,
    drift: "nebula-drift-1",
    driftDuration: "35s",
  },
  {
    gradient: "radial-gradient(ellipse 95% 22% at 30% 85%, rgba(200,215,235,0.03) 0%, transparent 75%)",
    blur: 110,
    parallax: 0.025,
    drift: "nebula-drift-4",
    driftDuration: "48s",
  },
  {
    gradient: "radial-gradient(ellipse 85% 28% at 55% 70%, rgba(255,255,255,0.02) 0%, transparent 65%)",
    blur: 100,
    parallax: 0.035,
    drift: "nebula-drift-2",
    driftDuration: "45s",
  },
];

export function FogField() {
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
              const offset = Math.sin(scrollY * layers[i].parallax * 0.02) * 40;
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
          style={{
            background: layer.gradient,
            filter: `blur(${layer.blur}px)`,
            willChange: "transform",
            animation: `${layer.drift} ${layer.driftDuration} ease-in-out infinite`,
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
