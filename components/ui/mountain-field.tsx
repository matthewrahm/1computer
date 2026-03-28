"use client";

import { useEffect, useRef } from "react";

interface MountainLayer {
  points: { x: number; y: number }[];
  color: string;
  parallaxSpeed: number;
}

function generateRidge(width: number, height: number, baseY: number, amplitude: number, seed: number, segments: number): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const step = width / segments;

  for (let i = 0; i <= segments; i++) {
    const x = i * step;
    const t = x / width;

    // Layer multiple frequencies for natural-looking mountains
    let y = baseY;
    y -= Math.sin(t * Math.PI * 2 * 1.3 + seed) * amplitude * 0.5;
    y -= Math.sin(t * Math.PI * 2 * 2.7 + seed * 2.1) * amplitude * 0.25;
    y -= Math.sin(t * Math.PI * 2 * 5.1 + seed * 3.7) * amplitude * 0.12;
    y -= Math.sin(t * Math.PI * 2 * 0.4 + seed * 0.5) * amplitude * 0.35;
    // Sharp peaks
    y -= Math.max(0, Math.sin(t * Math.PI * 2 * 1.8 + seed * 1.3) * amplitude * 0.3);

    points.push({ x, y });
  }

  return points;
}

export function MountainField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationId: number;
    let scrollY = 0;
    let width = 0;
    let height = 0;
    let layers: MountainLayer[] = [];

    const buildLayers = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      const layerConfigs = [
        { baseY: height * 0.45, amplitude: height * 0.12, seed: 0.7, color: "rgba(12, 22, 50, 0.35)", speed: 0.015, segments: 60 },
        { baseY: height * 0.52, amplitude: height * 0.15, seed: 2.3, color: "rgba(10, 20, 48, 0.5)", speed: 0.025, segments: 50 },
        { baseY: height * 0.60, amplitude: height * 0.18, seed: 4.1, color: "rgba(8, 17, 42, 0.65)", speed: 0.04, segments: 45 },
        { baseY: height * 0.70, amplitude: height * 0.14, seed: 6.7, color: "rgba(6, 14, 36, 0.8)", speed: 0.06, segments: 40 },
        { baseY: height * 0.82, amplitude: height * 0.10, seed: 9.2, color: "rgba(4, 10, 28, 0.92)", speed: 0.08, segments: 35 },
      ];

      layers = layerConfigs.map((cfg) => ({
        points: generateRidge(width + 200, height, cfg.baseY, cfg.amplitude, cfg.seed, cfg.segments),
        color: cfg.color,
        parallaxSpeed: cfg.speed,
      }));
    };

    buildLayers();

    const handleScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", buildLayers);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (const layer of layers) {
        const offsetY = prefersReduced ? 0 : -scrollY * layer.parallaxSpeed;

        ctx.fillStyle = layer.color;
        ctx.beginPath();

        const pts = layer.points;
        if (pts.length < 2) continue;

        ctx.moveTo(pts[0].x - 100, pts[0].y + offsetY);

        for (let i = 1; i < pts.length; i++) {
          const prev = pts[i - 1];
          const curr = pts[i];
          const cpx = (prev.x + curr.x) / 2;
          const cpy1 = prev.y + offsetY;
          const cpy2 = curr.y + offsetY;
          ctx.quadraticCurveTo(prev.x, cpy1, cpx, (cpy1 + cpy2) / 2);
        }

        // Close the shape down to the bottom
        ctx.lineTo(width + 100, height + 10);
        ctx.lineTo(-100, height + 10);
        ctx.closePath();
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", buildLayers);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
