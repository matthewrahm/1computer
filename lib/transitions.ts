function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export type TransitionType =
  | "ZOOM_OUT_TO_COSMOS"
  | "DEPTH_DIVE"
  | "CINEMATIC_WIPE"
  | "FOLD_AWAY"
  | "SETTLE_DOWN"
  | "SHATTER";

export interface TransitionStyles {
  transform: string;
  opacity: string;
  filter: string;
  clipPath: string;
  transformOrigin: string;
}

interface TransitionResult {
  exit: TransitionStyles;
  enter: TransitionStyles;
}

const IDENTITY: TransitionStyles = {
  transform: "translate3d(0,0,0)",
  opacity: "1",
  filter: "",
  clipPath: "",
  transformOrigin: "",
};

export function getTransition(
  type: TransitionType,
  exitProgress: number,
  enterProgress: number,
  options?: { isMobile?: boolean; reducedMotion?: boolean }
): TransitionResult {
  const { isMobile = false, reducedMotion = false } = options ?? {};

  if (reducedMotion) {
    return {
      exit: { ...IDENTITY, opacity: `${1 - exitProgress}` },
      enter: { ...IDENTITY, opacity: "1" },
    };
  }

  switch (type) {
    case "ZOOM_OUT_TO_COSMOS":
      return {
        exit: {
          transform: `scale(${lerp(1, 0.6, exitProgress)}) translate3d(0,0,0)`,
          opacity: `${1 - exitProgress}`,
          filter: `blur(${lerp(0, 8, exitProgress)}px)`,
          clipPath: "", transformOrigin: "",
        },
        enter: {
          transform: `scale(${lerp(1.2, 1, enterProgress)}) translate3d(0,0,0)`,
          opacity: "1",
          filter: `blur(${lerp(4, 0, enterProgress)}px)`,
          clipPath: "", transformOrigin: "",
        },
      };

    case "DEPTH_DIVE":
      return {
        exit: {
          transform: `scale(${lerp(1, 0.95, exitProgress)}) translate3d(0,0,0)`,
          opacity: `${1 - exitProgress}`,
          filter: `blur(${lerp(0, 4, exitProgress)}px)`,
          clipPath: "", transformOrigin: "",
        },
        enter: isMobile
          ? {
              transform: `scale(${lerp(0.85, 1, enterProgress)}) translate3d(0,0,0)`,
              opacity: "1", filter: "", clipPath: "", transformOrigin: "",
            }
          : {
              transform: `scale(${lerp(0.85, 1, enterProgress)}) translate3d(0,0,0)`,
              opacity: enterProgress > 0.01 ? "1" : "0",
              filter: "",
              clipPath: `circle(${lerp(0, 75, enterProgress)}% at 50% 50%)`,
              transformOrigin: "",
            },
      };

    case "CINEMATIC_WIPE":
      return {
        exit: {
          transform: `translateX(${lerp(0, -100, exitProgress)}%) scale(${lerp(1, 0.95, exitProgress)}) translate3d(0,0,0)`,
          opacity: `${1 - exitProgress}`,
          filter: "", clipPath: "", transformOrigin: "",
        },
        enter: {
          transform: `translateX(${lerp(100, 0, enterProgress)}%) translate3d(0,0,0)`,
          opacity: "1", filter: "", clipPath: "", transformOrigin: "",
        },
      };

    case "FOLD_AWAY":
      if (isMobile) {
        return {
          exit: {
            transform: `translateX(${lerp(0, -50, exitProgress)}%) translate3d(0,0,0)`,
            opacity: `${lerp(1, 0, exitProgress)}`,
            filter: "", clipPath: "", transformOrigin: "",
          },
          enter: {
            transform: `translateX(${lerp(50, 0, enterProgress)}%) translate3d(0,0,0)`,
            opacity: "1", filter: "", clipPath: "", transformOrigin: "",
          },
        };
      }
      return {
        exit: {
          transform: `rotateY(${lerp(0, 90, exitProgress)}deg) translate3d(0,0,0)`,
          opacity: `${1 - exitProgress}`,
          filter: "", clipPath: "", transformOrigin: "left",
        },
        enter: {
          transform: `rotateY(${lerp(-90, 0, enterProgress)}deg) translate3d(0,0,0)`,
          opacity: "1", filter: "", clipPath: "", transformOrigin: "right",
        },
      };

    case "SETTLE_DOWN":
      return {
        exit: {
          transform: `translateY(${lerp(0, -40, exitProgress)}px) translate3d(0,0,0)`,
          opacity: `${1 - exitProgress}`,
          filter: "", clipPath: "", transformOrigin: "",
        },
        enter: {
          transform: `translateY(${lerp(60, 0, enterProgress)}px) translate3d(0,0,0)`,
          opacity: "1", filter: "", clipPath: "", transformOrigin: "",
        },
      };

    case "SHATTER":
      if (isMobile) {
        return {
          exit: {
            transform: `scale(${lerp(1, 0.95, exitProgress)}) translate3d(0,0,0)`,
            opacity: "1",
            filter: `blur(${lerp(0, 2, exitProgress)}px)`,
            clipPath: `circle(${lerp(75, 0, exitProgress)}% at 50% 50%)`,
            transformOrigin: "",
          },
          enter: {
            transform: `scale(${lerp(0.95, 1, enterProgress)}) translate3d(0,0,0)`,
            opacity: enterProgress > 0.01 ? "1" : "0",
            filter: `blur(${lerp(2, 0, enterProgress)}px)`,
            clipPath: `circle(${lerp(0, 75, enterProgress)}% at 50% 50%)`,
            transformOrigin: "",
          },
        };
      }
      return {
        exit: {
          transform: `scale(${lerp(1, 0.95, exitProgress)}) translate3d(0,0,0)`,
          opacity: "1",
          filter: `blur(${lerp(0, 2, exitProgress)}px)`,
          clipPath: shatterPolygon(exitProgress),
          transformOrigin: "",
        },
        enter: {
          transform: `scale(${lerp(0.95, 1, enterProgress)}) translate3d(0,0,0)`,
          opacity: enterProgress > 0.01 ? "1" : "0",
          filter: `blur(${lerp(2, 0, enterProgress)}px)`,
          clipPath: shatterPolygon(1 - enterProgress),
          transformOrigin: "",
        },
      };
  }
}

function shatterPolygon(progress: number): string {
  const cx = 50;
  const cy = 50;
  const baseRadius = 72;
  const angles = [0, 60, 120, 180, 240, 300];
  const jag = [1.0, 0.7, 1.1, 0.65, 0.95, 0.8];

  const r = baseRadius * (1 - progress);
  const points = angles.map((angle, i) => {
    const rad = (angle * Math.PI) / 180;
    const jr = r * jag[i];
    const x = cx + Math.cos(rad) * jr;
    const y = cy + Math.sin(rad) * jr;
    return `${x}% ${y}%`;
  });

  return `polygon(${points.join(", ")})`;
}
