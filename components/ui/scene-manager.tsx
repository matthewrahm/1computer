"use client";

import {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { type MotionValue } from "framer-motion";
import { type TransitionType, type TransitionStyles, getTransition } from "@/lib/transitions";

interface SceneRegistration {
  index: number;
  spacerRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  overlayRef: React.RefObject<HTMLDivElement | null>;
  activeProgress: MotionValue<number>;
  transition: TransitionType;
  renderAlways?: boolean;
}

interface SceneManagerContextType {
  register: (config: SceneRegistration) => void;
  unregister: (index: number) => void;
  reducedMotion: boolean;
  isMobile: boolean;
}

const SceneManagerContext = createContext<SceneManagerContextType | null>(null);

export function useSceneManager() {
  const ctx = useContext(SceneManagerContext);
  if (!ctx) throw new Error("useSceneManager must be used within SceneManager");
  return ctx;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function applyStyles(el: HTMLElement, styles: TransitionStyles) {
  el.style.transform = styles.transform;
  el.style.opacity = styles.opacity;
  el.style.filter = styles.filter;
  el.style.clipPath = styles.clipPath;
  el.style.transformOrigin = styles.transformOrigin;
}

const RESET: TransitionStyles = {
  transform: "translate3d(0,0,0)",
  opacity: "1",
  filter: "",
  clipPath: "",
  transformOrigin: "",
};

export function SceneManager({ children }: { children: ReactNode }) {
  const scenesRef = useRef<
    Map<number, SceneRegistration & { cachedTop: number; cachedHeight: number }>
  >(new Map());
  const scrollYRef = useRef(0);
  const rafRef = useRef<number>(0);
  const reducedMotionRef = useRef(false);
  const isMobileRef = useRef(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mob = window.innerWidth < 768;
    reducedMotionRef.current = rm;
    isMobileRef.current = mob;
    setReducedMotion(rm);
    setIsMobile(mob);

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
      setReducedMotion(e.matches);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const cachePositions = useCallback(() => {
    for (const [, scene] of scenesRef.current) {
      const el = scene.spacerRef.current;
      if (el) {
        scene.cachedTop = el.offsetTop;
        scene.cachedHeight = el.offsetHeight;
      }
    }
  }, []);

  const register = useCallback(
    (config: SceneRegistration) => {
      scenesRef.current.set(config.index, { ...config, cachedTop: 0, cachedHeight: 0 });
      requestAnimationFrame(cachePositions);
    },
    [cachePositions]
  );

  const unregister = useCallback((index: number) => {
    scenesRef.current.delete(index);
  }, []);

  useEffect(() => {
    const onScroll = () => { scrollYRef.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });
    scrollYRef.current = window.scrollY;
    cachePositions();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cachePositions();
        const mob = window.innerWidth < 768;
        isMobileRef.current = mob;
        setIsMobile(mob);
      }, 150);
    };
    window.addEventListener("resize", onResize);

    const loop = () => {
      const scrollY = scrollYRef.current;
      const scenes = Array.from(scenesRef.current.entries()).sort(([a], [b]) => a - b);
      if (scenes.length === 0) { rafRef.current = requestAnimationFrame(loop); return; }

      const options = { isMobile: isMobileRef.current, reducedMotion: reducedMotionRef.current };

      const exitProgresses: number[] = [];
      for (const [, scene] of scenes) {
        if (!scene.cachedHeight) { exitProgresses.push(0); continue; }
        const raw = (scrollY - scene.cachedTop) / scene.cachedHeight;
        const ep = raw > 0.5 ? clamp((raw - 0.5) / 0.5, 0, 1) : 0;
        exitProgresses.push(ep);
      }

      for (let i = 0; i < scenes.length; i++) {
        const [, scene] = scenes[i];
        const el = scene.contentRef.current;
        if (!el || !scene.cachedHeight) continue;

        const raw = (scrollY - scene.cachedTop) / scene.cachedHeight;
        const exitProgress = exitProgresses[i];
        const enterProgress = i === 0 ? 1 : exitProgresses[i - 1];

        const ap = raw <= 0 ? 0 : raw >= 0.5 ? 1 : clamp(raw / 0.5, 0, 1);
        scene.activeProgress.set(ap);

        const isBeforeEnter = i > 0 && enterProgress < 0.001 && raw < 0;
        const isAfterExit = exitProgress >= 0.999 && raw >= 1;

        if ((isBeforeEnter || isAfterExit) && !scene.renderAlways) {
          el.style.visibility = "hidden";
          el.style.pointerEvents = "none";
          el.style.willChange = "auto";
          continue;
        }

        el.style.visibility = "visible";
        const isEntering = i > 0 && enterProgress < 1;
        const isExiting = exitProgress > 0;
        const isActive = !isEntering && !isExiting;

        el.style.pointerEvents = isActive ? "auto" : "none";
        el.style.willChange = isEntering || isExiting ? "transform, opacity" : "auto";

        if (isEntering) {
          const enterType = i > 0 ? scenes[i - 1][1].transition : scene.transition;
          const styles = getTransition(enterType, 0, enterProgress, options);
          applyStyles(el, styles.enter);
        } else if (isExiting) {
          const styles = getTransition(scene.transition, exitProgress, 0, options);
          applyStyles(el, styles.exit);
        } else {
          applyStyles(el, RESET);
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [cachePositions]);

  return (
    <SceneManagerContext.Provider value={{ register, unregister, reducedMotion, isMobile }}>
      {children}
    </SceneManagerContext.Provider>
  );
}
