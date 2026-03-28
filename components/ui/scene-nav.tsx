"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

export function SceneNav() {
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const spacers = () =>
      Array.from(document.querySelectorAll<HTMLElement>("[data-scene-index]"))
        .sort((a, b) => Number(a.dataset.sceneIndex) - Number(b.dataset.sceneIndex));

    const update = () => {
      const els = spacers();
      setTotal(els.length);
      if (!els.length) return;
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      let idx = 0;
      for (let i = els.length - 1; i >= 0; i--) {
        if (scrollY >= els[i].offsetTop - vh * 0.3) { idx = i; break; }
      }
      setCurrent(idx);
      const lastSpacer = els[els.length - 1];
      const bottomOfScenes = lastSpacer.offsetTop + lastSpacer.offsetHeight;
      setVisible(scrollY < bottomOfScenes - vh * 0.5);
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    const t = setTimeout(update, 500);
    return () => { window.removeEventListener("scroll", update); clearTimeout(t); };
  }, []);

  const scrollTo = useCallback((index: number) => {
    const el = document.querySelector<HTMLElement>(`[data-scene-index="${index}"]`);
    if (el) {
      const target = el.offsetTop + el.offsetHeight * 0.25;
      window.scrollTo({ top: target, behavior: "smooth" });
    }
  }, []);

  const goNext = useCallback(() => { if (current < total - 1) scrollTo(current + 1); }, [current, total, scrollTo]);
  const goPrev = useCallback(() => { if (current > 0) scrollTo(current - 1); }, [current, scrollTo]);

  return (
    <AnimatePresence>
      {visible && total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2"
        >
          <div className="flex items-center gap-2 rounded-full border border-accent/10 bg-background/60 px-3 py-1.5 backdrop-blur-xl">
            <button onClick={goPrev} disabled={current === 0} className="rounded-full p-1.5 text-text-secondary transition-colors hover:text-accent disabled:opacity-20 disabled:hover:text-text-secondary" aria-label="Previous section">
              <ChevronUp className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: total }, (_, i) => (
                <button key={i} onClick={() => scrollTo(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-4 bg-accent" : "w-1.5 bg-text-muted/30 hover:bg-text-muted/60"}`} aria-label={`Go to scene ${i + 1}`} />
              ))}
            </div>
            <button onClick={goNext} disabled={current >= total - 1} className="rounded-full p-1.5 text-text-secondary transition-colors hover:text-accent disabled:opacity-20 disabled:hover:text-text-secondary" aria-label="Next section">
              <motion.div animate={{ y: [0, 3, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
