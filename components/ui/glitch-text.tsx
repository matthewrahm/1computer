"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#@*!";
const STAGGER = 30;
const SCRAMBLE_DURATION = 200;

interface GlitchTextProps { text: string; className?: string; as?: "h2" | "h3" | "span" | "p"; }

export function GlitchText({ text, className = "", as: Tag = "h2" }: GlitchTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [displayed, setDisplayed] = useState(text);
  const hasPlayed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasPlayed.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || hasPlayed.current) return;
      hasPlayed.current = true;
      observer.disconnect();
      runScramble();
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [text]);

  function runScramble() {
    const chars = text.split("");
    const startTimes = chars.map((_, i) => i * STAGGER);
    const t0 = performance.now();

    function tick() {
      const elapsed = performance.now() - t0;
      let allDone = true;
      const output = chars.map((ch, i) => {
        if (ch === " ") return " ";
        const charElapsed = elapsed - startTimes[i];
        if (charElapsed < 0) { allDone = false; return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]; }
        if (charElapsed >= SCRAMBLE_DURATION) return ch;
        allDone = false;
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      });
      setDisplayed(output.join(""));
      if (!allDone) requestAnimationFrame(tick);
    }

    setDisplayed(chars.map((ch) => ch === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join(""));
    requestAnimationFrame(tick);
  }

  return (
    // @ts-expect-error — dynamic tag
    <Tag ref={ref} className={className}>
      {displayed.split("").map((ch, i) => (
        <span key={i} className={hasPlayed.current && ch === text[i] ? "" : "text-accent"} style={hasPlayed.current && ch !== text[i] ? { animation: "glitch-flicker 0.1s step-end infinite" } : undefined}>
          {ch}
        </span>
      ))}
    </Tag>
  );
}
