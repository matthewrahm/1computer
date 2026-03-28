"use client";

import { useEffect, useRef } from "react";

interface TrailPoint { x: number; y: number; time: number; }

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let points: TrailPoint[] = [];
    let animationId = 0;
    let lastMoveTime = 0;
    let loopRunning = false;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const last = points[points.length - 1];
      if (last) {
        const dx = e.clientX - last.x;
        const dy = e.clientY - last.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 20) {
          const steps = Math.min(Math.floor(dist / 10), 6);
          for (let i = 1; i < steps; i++) {
            const t = i / steps;
            points.push({ x: last.x + dx * t, y: last.y + dy * t, time: last.time + (now - last.time) * t });
          }
        }
      }
      points.push({ x: e.clientX, y: e.clientY, time: now });
      if (points.length > 50) points = points.slice(-50);
      lastMoveTime = now;
      if (!loopRunning) { loopRunning = true; animationId = requestAnimationFrame(render); }
    };

    const render = () => {
      const now = performance.now();
      if (now - lastMoveTime > 500) { ctx.clearRect(0, 0, canvas.width, canvas.height); points = []; loopRunning = false; return; }
      points = points.filter((p) => now - p.time < 300);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (points.length < 2) { animationId = requestAnimationFrame(render); return; }

      const tip = points[points.length - 1];
      const prev = points[points.length - 2];
      const dt = tip.time - prev.time || 1;
      const vx = (tip.x - prev.x) / dt;
      const vy = (tip.y - prev.y) / dt;
      const velocity = Math.sqrt(vx * vx + vy * vy);
      const velocityNorm = Math.min(velocity / 1.5, 1);
      const masterOpacity = 0.08 + velocityNorm * 0.52;
      const visibleCount = Math.floor(5 + velocityNorm * 25);

      const active = points.slice(-Math.min(visibleCount, points.length));
      if (active.length < 2) { animationId = requestAnimationFrame(render); return; }

      for (let pass = 0; pass < 2; pass++) {
        const isGlow = pass === 0;
        const baseWidth = isGlow ? 6 : 2;
        const passOpacity = isGlow ? masterOpacity * 0.25 : masterOpacity;

        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (let i = 1; i < active.length; i++) {
          const t = i / (active.length - 1);
          const age = (now - active[i].time) / 300;
          const ageFade = 1 - age;
          const width = baseWidth * t;
          if (width < 0.1) continue;
          const segmentOpacity = passOpacity * t * ageFade;
          if (segmentOpacity < 0.01) continue;

          // Blue-tinted tip (changed from green)
          const r = Math.round(232 + (77 - 232) * t * t * 0.15);
          const g = Math.round(228 + (159 - 228) * t * t * 0.15);
          const b = Math.round(223 + (255 - 223) * t * t * 0.15);

          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${segmentOpacity})`;
          ctx.lineWidth = width;
          ctx.beginPath();

          if (i === 1) { ctx.moveTo(active[0].x, active[0].y); ctx.lineTo(active[1].x, active[1].y); }
          else {
            const p0 = active[i - 2];
            const p1 = active[i - 1];
            const p2 = active[i];
            const mx1 = (p0.x + p1.x) / 2;
            const my1 = (p0.y + p1.y) / 2;
            const mx2 = (p1.x + p2.x) / 2;
            const my2 = (p1.y + p2.y) / 2;
            ctx.moveTo(mx1, my1);
            ctx.quadraticCurveTo(p1.x, p1.y, mx2, my2);
          }
          ctx.stroke();
        }
        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => { window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("resize", resize); cancelAnimationFrame(animationId); };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[60]" style={{ willChange: "transform" }} aria-hidden="true" />;
}
