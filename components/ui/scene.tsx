"use client";

import { useRef, useEffect, useState } from "react";
import { type MotionValue, useMotionValue } from "framer-motion";
import { useSceneManager } from "./scene-manager";
import { type TransitionType } from "@/lib/transitions";

interface SceneProps {
  index: number;
  id?: string;
  scrollHeight?: string;
  transition: TransitionType;
  children: (activeProgress: MotionValue<number>) => React.ReactNode;
  renderAlways?: boolean;
}

export function Scene({ index, id, scrollHeight = "200vh", transition, children, renderAlways }: SceneProps) {
  const { register, unregister } = useSceneManager();
  const spacerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const activeProgress = useMotionValue(0);
  const [hasBeenVisible, setHasBeenVisible] = useState(index === 0);

  useEffect(() => {
    register({ index, spacerRef, contentRef, overlayRef, activeProgress, transition, renderAlways });
    return () => unregister(index);
  }, [index, transition, renderAlways, register, unregister, activeProgress]);

  useEffect(() => {
    if (hasBeenVisible || renderAlways) return;
    const unsub = activeProgress.on("change", (v) => {
      if (v > 0) { setHasBeenVisible(true); unsub(); }
    });
    return unsub;
  }, [hasBeenVisible, renderAlways, activeProgress]);

  return (
    <>
      <div ref={spacerRef} id={id} data-scene-index={index} style={{ height: scrollHeight }} aria-hidden="true" />
      <div
        ref={contentRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 20 - index,
          overflow: "hidden",
          perspective: transition === "FOLD_AWAY" ? "1200px" : undefined,
          visibility: index === 0 ? "visible" : "hidden",
        }}
      >
        <div style={{ width: "100%", height: "100%" }}>
          {(hasBeenVisible || renderAlways) && children(activeProgress)}
        </div>
        {transition === "DEPTH_DIVE" && (
          <div ref={overlayRef} style={{ position: "absolute", inset: 0, background: "#030510", opacity: 0, pointerEvents: "none" }} />
        )}
      </div>
    </>
  );
}
