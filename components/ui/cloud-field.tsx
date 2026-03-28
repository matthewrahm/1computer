"use client";

import { useEffect, useRef } from "react";

interface CloudBlob { x: number; y: number; radius: number; opacity: number; }
interface Cloud { cx: number; cy: number; depth: number; blobs: CloudBlob[]; }

function generateCloud(cx: number, cy: number, depth: number, seed: number, sizeScale: number = 1.0): Cloud {
  const baseRadius = (120 + depth * 200) * sizeScale;
  const blobs: CloudBlob[] = [];

  for (let i = 0; i < 6; i++) {
    const spread = baseRadius * 1.2;
    const t = (i / 5) - 0.5;
    blobs.push({ x: t * spread * 2, y: baseRadius * 0.15, radius: baseRadius * (0.5 + ((seed * 3 + i * 0.5) % 1) * 0.3), opacity: 0.12 + depth * 0.06 });
  }

  const bumpCount = 8 + Math.floor(seed * 5);
  for (let i = 0; i < bumpCount; i++) {
    const t = (i / (bumpCount - 1)) - 0.5;
    const spread = baseRadius * 1.1;
    const archY = -Math.cos(t * Math.PI) * baseRadius * 0.4;
    const jitterX = ((seed * 7 + i * 0.37) % 1 - 0.5) * baseRadius * 0.4;
    const jitterY = ((seed * 11 + i * 0.53) % 1 - 0.5) * baseRadius * 0.15;
    blobs.push({ x: t * spread * 1.8 + jitterX, y: archY + jitterY, radius: baseRadius * (0.35 + ((seed * 5 + i * 0.7) % 1) * 0.35), opacity: 0.14 + ((seed * 3 + i * 0.2) % 1) * 0.08 });
  }

  for (let i = 0; i < 4; i++) {
    const ox = ((seed * 13 + i * 1.7) % 1 - 0.5) * baseRadius * 0.5;
    const oy = ((seed * 17 + i * 1.3) % 1 - 0.5) * baseRadius * 0.2;
    blobs.push({ x: ox, y: oy - baseRadius * 0.05, radius: baseRadius * (0.5 + ((seed * 7 + i) % 1) * 0.3), opacity: 0.16 + depth * 0.06 });
  }

  return { cx, cy, depth, blobs };
}

export function CloudField() {
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

    const resize = () => { width = window.innerWidth; height = window.innerHeight; canvas.width = width; canvas.height = height; };
    const handleScroll = () => { scrollY = window.scrollY; };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    const wrapHeight = height * 3;
    const clouds: Cloud[] = [];
    const seeds = [0.12, 0.87, 0.34, 0.65, 0.23, 0.91, 0.45, 0.78, 0.56, 0.03, 0.67, 0.29, 0.84, 0.41, 0.72, 0.18, 0.93, 0.52, 0.38, 0.75, 0.09, 0.61, 0.44, 0.82];

    for (let i = 0; i < 16; i++) {
      const s = seeds[i % seeds.length];
      const s2 = seeds[(i + 7) % seeds.length];
      const edgeBias = i < 4 ? 0.15 + s * 0.7 : (s < 0.5 ? s * 0.4 : 0.6 + s * 0.4);
      const cx = edgeBias * width;
      const cy = (i / 16) * wrapHeight + s2 * wrapHeight * 0.04;
      const depth = 0.3 + seeds[(i + 3) % seeds.length] * 0.7;
      const sizeScale = i < 4 ? 1.4 : 1.0;
      clouds.push(generateCloud(cx, cy, depth, s, sizeScale));
    }

    let time = 0;
    const render = () => {
      time += 0.005;
      ctx.clearRect(0, 0, width, height);

      for (const cloud of clouds) {
        const scrollSpeed = 0.03 + cloud.depth * 0.05;
        const rawY = cloud.cy - scrollY * scrollSpeed;
        const viewY = ((rawY % wrapHeight) + wrapHeight) % wrapHeight - height;
        if (viewY < -500 || viewY > height + 500) continue;

        const driftX = prefersReduced ? 0 : Math.sin(time + cloud.cx * 0.008) * 18;
        const driftY = prefersReduced ? 0 : Math.cos(time * 0.6 + cloud.cy * 0.003) * 8;

        for (const blob of cloud.blobs) {
          const bx = cloud.cx + blob.x + driftX;
          const by = viewY + blob.y + driftY;
          if (bx + blob.radius < -50 || bx - blob.radius > width + 50 || by + blob.radius < -50 || by - blob.radius > height + 50) continue;

          const grad = ctx.createRadialGradient(bx, by, 0, bx, by, blob.radius);
          grad.addColorStop(0, `rgba(255, 255, 255, ${blob.opacity})`);
          grad.addColorStop(0.3, `rgba(240, 240, 245, ${blob.opacity * 0.7})`);
          grad.addColorStop(0.6, `rgba(220, 220, 230, ${blob.opacity * 0.3})`);
          grad.addColorStop(1, "rgba(200, 200, 210, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(bx, by, blob.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => { cancelAnimationFrame(animationId); window.removeEventListener("resize", resize); window.removeEventListener("scroll", handleScroll); };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[1]" aria-hidden="true" />;
}
