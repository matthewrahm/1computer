"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number; y: number; size: number; speed: number; opacity: number;
  twinkleSpeed: number; twinklePhase: number; isFourPoint: boolean;
  isDust: boolean; driftPhase: number; color: string; isSupergiant: boolean;
}

interface ShootingStar {
  x: number; y: number; originX: number; originY: number;
  angle: number; speed: number; lifetime: number; elapsed: number; length: number;
}

interface StarBloom {
  starIndex: number; elapsed: number; duration: number; peakMultiplier: number;
}

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let scrollY = 0;
    let prevScrollY = 0;
    let velocity = 0;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    const handleScroll = () => { scrollY = window.scrollY; };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    const totalHeight = document.documentElement.scrollHeight;
    const stars: Star[] = [];

    const starColors = (): string => {
      const r = Math.random();
      if (r < 0.70) return "#ffffff";
      if (r < 0.85) return "#e6f0ff";
      if (r < 0.95) return "#c0dfff";
      return "#cce5ff";
    };

    const layerConfigs = [
      { count: 120, speedMult: 0.02, sizeRange: [0.5, 1.2], dustLayer: false, supergiant: false },
      { count: 80, speedMult: 0.05, sizeRange: [1, 2], dustLayer: false, supergiant: false },
      { count: 40, speedMult: 0.1, sizeRange: [1.5, 3], dustLayer: false, supergiant: false },
      { count: 200, speedMult: 0.01, sizeRange: [0.2, 0.6], dustLayer: true, supergiant: false },
      { count: 10, speedMult: 0.03, sizeRange: [3, 4.5], dustLayer: false, supergiant: true },
    ];

    for (const layer of layerConfigs) {
      for (let i = 0; i < layer.count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * totalHeight,
          size: layer.sizeRange[0] + Math.random() * (layer.sizeRange[1] - layer.sizeRange[0]),
          speed: layer.speedMult,
          opacity: layer.dustLayer ? 0.1 + Math.random() * 0.3 : 0.5 + Math.random() * 0.5,
          twinkleSpeed: layer.supergiant ? 0.3 + Math.random() * 0.2 : 0.5 + Math.random() * 2,
          twinklePhase: Math.random() * Math.PI * 2,
          isFourPoint: !layer.dustLayer && !layer.supergiant && Math.random() < 0.1 && layer.speedMult > 0.02,
          isDust: layer.dustLayer,
          driftPhase: Math.random() * Math.PI * 2,
          color: layer.dustLayer ? "#ffffff" : starColors(),
          isSupergiant: layer.supergiant,
        });
      }
    }

    const drawStar = (x: number, y: number, size: number, opacity: number, isFourPoint: boolean, stretchY: number, color: string, isSupergiant: boolean) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      if (isFourPoint) {
        ctx.fillStyle = "#4d9fff";
        ctx.beginPath();
        ctx.moveTo(x - size * 2, y);
        ctx.lineTo(x - size * 0.3, y - size * 0.3);
        ctx.lineTo(x, y - size * 2 * stretchY);
        ctx.lineTo(x + size * 0.3, y - size * 0.3);
        ctx.lineTo(x + size * 2, y);
        ctx.lineTo(x + size * 0.3, y + size * 0.3);
        ctx.lineTo(x, y + size * 2 * stretchY);
        ctx.lineTo(x - size * 0.3, y + size * 0.3);
        ctx.closePath();
        ctx.fill();
      } else {
        if (isSupergiant) {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 4);
          glow.addColorStop(0, `rgba(255,255,255,${opacity * 0.12})`);
          glow.addColorStop(0.5, `rgba(255,255,255,${opacity * 0.04})`);
          glow.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, size * 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = color;
        ctx.beginPath();
        if (stretchY > 1.05) { ctx.ellipse(x, y, size, size * stretchY, 0, 0, Math.PI * 2); }
        else { ctx.arc(x, y, size, 0, Math.PI * 2); }
        ctx.fill();
      }
      ctx.restore();
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shootingStars: ShootingStar[] = [];
    const isMobile = window.innerWidth < 640;
    const maxShooters = isMobile ? 2 : 4;
    let nextSpawnTime = 800 + Math.random() * 700;
    let spawnTimer = 0;

    function spawnShootingStar() {
      if (shootingStars.length >= maxShooters || !canvas) return;
      const edge = Math.random();
      let sx: number, sy: number;
      if (edge < 0.5) { sx = Math.random() * canvas.width; sy = -10; }
      else { sx = canvas.width + 10; sy = Math.random() * canvas.height * 0.5; }
      const angle = (15 + Math.random() * 30) * (Math.PI / 180);
      shootingStars.push({
        x: sx, y: sy, originX: sx, originY: sy,
        angle: Math.PI - angle + (edge < 0.5 ? Math.PI * 0.5 : 0),
        speed: 1000 + Math.random() * 800,
        lifetime: 500 + Math.random() * 500,
        elapsed: 0, length: 100 + Math.random() * 80,
      });
    }

    const starBlooms: StarBloom[] = [];
    const bloomMap = new Map<number, StarBloom>();
    let bloomSpawnTimer = 0;
    let nextBloomTime = 3000 + Math.random() * 2000;

    let time = 0;
    const render = () => {
      const dt = 16;
      time += 0.016;
      const deltaScroll = Math.abs(scrollY - prevScrollY);
      prevScrollY = scrollY;
      velocity = velocity * 0.85 + deltaScroll * 0.15;
      const stretchFactor = Math.min(1 + velocity * 0.1, 3);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!reducedMotion) {
        bloomSpawnTimer += dt;
        if (bloomSpawnTimer >= nextBloomTime) {
          const candidates: number[] = [];
          for (let si = 0; si < stars.length; si++) {
            if (!stars[si].isDust && !stars[si].isSupergiant && !bloomMap.has(si)) candidates.push(si);
          }
          if (candidates.length > 0) {
            const idx = candidates[Math.floor(Math.random() * candidates.length)];
            const bloom: StarBloom = { starIndex: idx, elapsed: 0, duration: 3000 + Math.random() * 1000, peakMultiplier: 3 + Math.random() };
            starBlooms.push(bloom);
            bloomMap.set(idx, bloom);
          }
          bloomSpawnTimer = 0;
          nextBloomTime = 3000 + Math.random() * 2000;
        }
        for (let bi = starBlooms.length - 1; bi >= 0; bi--) {
          const b = starBlooms[bi];
          b.elapsed += dt;
          if (b.elapsed >= b.duration) { bloomMap.delete(b.starIndex); starBlooms.splice(bi, 1); }
        }
      }

      for (let si = 0; si < stars.length; si++) {
        const star = stars[si];
        const parallaxY = star.y - scrollY * star.speed;
        const screenY = ((parallaxY % totalHeight) + totalHeight) % totalHeight;
        const viewY = screenY - scrollY;
        if (viewY < -50 || viewY > canvas.height + 50) continue;

        let drawX = star.x;
        if (star.isDust) drawX += Math.sin(time * 0.3 + star.driftPhase) * 8;

        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
        let finalOpacity = star.opacity * twinkle;
        let drawSize = star.size;

        const bloom = bloomMap.get(si);
        if (bloom) {
          const p = bloom.elapsed / bloom.duration;
          let bloomEnvelope: number;
          if (p < 0.3) { bloomEnvelope = p / 0.3; bloomEnvelope = bloomEnvelope * bloomEnvelope; }
          else if (p < 0.6) { bloomEnvelope = 1.0; }
          else { bloomEnvelope = 1 - (p - 0.6) / 0.4; bloomEnvelope = bloomEnvelope * bloomEnvelope; }
          const bloomMultiplier = 1 + (bloom.peakMultiplier - 1) * bloomEnvelope;
          finalOpacity = Math.min(finalOpacity * bloomMultiplier, 1);
          drawSize *= 1 + 0.3 * bloomEnvelope;

          if (bloomMultiplier > 1.5) {
            const haloAlpha = 0.15 * bloomEnvelope;
            const haloRadius = drawSize * 6;
            const halo = ctx.createRadialGradient(drawX, viewY, 0, drawX, viewY, haloRadius);
            halo.addColorStop(0, `rgba(77,159,255,${haloAlpha})`);
            halo.addColorStop(0.4, `rgba(77,159,255,${haloAlpha * 0.3})`);
            halo.addColorStop(1, "rgba(77,159,255,0)");
            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(drawX, viewY, haloRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        const stretch = star.isDust ? 1 : stretchFactor;
        drawStar(drawX, viewY, drawSize, finalOpacity, star.isFourPoint, stretch, star.color, star.isSupergiant);
      }

      if (!reducedMotion) {
        spawnTimer += dt;
        if (spawnTimer >= nextSpawnTime) { spawnShootingStar(); spawnTimer = 0; nextSpawnTime = 800 + Math.random() * 700; }

        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const s = shootingStars[i];
          s.elapsed += dt;
          if (s.elapsed >= s.lifetime) { shootingStars.splice(i, 1); continue; }

          const progress = s.elapsed / s.lifetime;
          const fadeIn = Math.min(progress * 4, 1);
          const fadeOut = 1 - Math.max((progress - 0.5) * 2, 0);
          const alpha = fadeIn * fadeOut;

          const dx = Math.cos(s.angle) * s.speed * (s.elapsed / 1000);
          const dy = Math.sin(s.angle) * s.speed * (s.elapsed / 1000);
          const hx = s.x + dx;
          const hy = s.y + dy;
          const tailX = hx - Math.cos(s.angle) * s.length;
          const tailY = hy - Math.sin(s.angle) * s.length;

          ctx.save();
          ctx.lineWidth = 6;
          const glow = ctx.createLinearGradient(tailX, tailY, hx, hy);
          glow.addColorStop(0, "rgba(77,159,255,0)");
          glow.addColorStop(1, `rgba(77,159,255,${0.3 * alpha})`);
          ctx.strokeStyle = glow;
          ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(hx, hy); ctx.stroke();

          ctx.lineWidth = 1.5;
          const core = ctx.createLinearGradient(tailX, tailY, hx, hy);
          core.addColorStop(0, "rgba(255,255,255,0)");
          core.addColorStop(1, `rgba(255,255,255,${1.0 * alpha})`);
          ctx.strokeStyle = core;
          ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(hx, hy); ctx.stroke();

          const flashProgress = Math.min(s.elapsed / 150, 1);
          const flashAlpha = (1 - flashProgress) * alpha;
          if (flashAlpha > 0.01) {
            const flashRadius = 8 + flashProgress * 20;
            const flash = ctx.createRadialGradient(s.originX, s.originY, 0, s.originX, s.originY, flashRadius);
            flash.addColorStop(0, `rgba(255,255,255,${0.8 * flashAlpha})`);
            flash.addColorStop(0.3, `rgba(77,159,255,${0.4 * flashAlpha})`);
            flash.addColorStop(1, "rgba(77,159,255,0)");
            ctx.fillStyle = flash;
            ctx.beginPath(); ctx.arc(s.originX, s.originY, flashRadius, 0, Math.PI * 2); ctx.fill();
          }
          ctx.restore();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => { cancelAnimationFrame(animationId); window.removeEventListener("resize", resize); window.removeEventListener("scroll", handleScroll); };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden="true" />;
}
