"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { Sparkles, Terminal, Rocket, Trophy } from "lucide-react";

const steps = [
  { num: "01", label: "Dream", sublabel: "It starts with a thought", icon: Sparkles, description: "One idea. One spark that won't let you sleep. You don't need permission, funding, or a team. You need a screen, a keyboard, and the audacity to believe you can build something from nothing." },
  { num: "02", label: "Code", sublabel: "Late nights, early mornings", icon: Terminal, description: "The grind nobody sees. Tabs on tabs. Stack Overflow at 3am. You teach yourself what nobody taught you \u2014 because the computer doesn't care about your resume. It only cares if the code runs." },
  { num: "03", label: "Ship", sublabel: "Put it in the world", icon: Rocket, description: "Perfection is the enemy. You hit deploy. You share the link. You put yourself out there, knowing it's not done. But done beats perfect every single time." },
  { num: "04", label: "Make It", sublabel: "Against all the noise", icon: Trophy, description: "The world told you it wasn't possible. The internet proved them wrong. From bedrooms to billions \u2014 every success story started with someone who refused to close the laptop." },
];

function useRange(progress: MotionValue<number>, start: number, end: number) {
  return useTransform(progress, [start, end], [0, 1]);
}

function PipelineNode({ step, index, progress }: { step: (typeof steps)[number]; index: number; progress: MotionValue<number> }) {
  const Icon = step.icon;
  const enter = 0.05 + index * 0.2;
  const opacity = useTransform(progress, [enter, enter + 0.1], [0, 1]);
  const scale = useTransform(progress, [enter, enter + 0.1], [0, 1]);
  const glowOpacity = useTransform(progress, [enter + 0.1, enter + 0.15, enter + 0.25, enter + 0.3], [0, 1, 1, index < 3 ? 0.3 : 1]);

  return (
    <motion.div style={{ opacity, scale }} className="flex flex-col items-center gap-3">
      <div className="relative">
        <motion.div style={{ opacity: glowOpacity }} className="dataflow-node-pulse absolute -inset-2 rounded-full border border-accent/40" />
        <motion.div style={{ boxShadow: useTransform(glowOpacity, (v) => `0 0 ${20 * v}px rgba(77,159,255,${0.3 * v})`) }} className="relative flex h-16 w-16 items-center justify-center rounded-full border border-accent/30 bg-surface-elevated md:h-20 md:w-20">
          <Icon className="h-6 w-6 text-accent md:h-7 md:w-7" />
        </motion.div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-text-primary">{step.label}</p>
        <p className="text-xs text-text-muted">{step.sublabel}</p>
      </div>
    </motion.div>
  );
}

function ConnectionLine({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const drawStart = 0.12 + index * 0.2;
  const drawEnd = drawStart + 0.13;
  const drawProgress = useRange(progress, drawStart, drawEnd);
  const pathLength = 200;
  const dashOffset = useTransform(drawProgress, (v) => pathLength * (1 - v));
  const particleOpacity = useTransform(progress, [drawEnd, drawEnd + 0.02], [0, 1]);

  return (
    <div className="relative hidden flex-1 items-center md:flex">
      <svg className="h-8 w-full overflow-visible" viewBox="0 0 200 30" preserveAspectRatio="none" fill="none">
        <path d="M 0 15 C 60 15, 140 15, 200 15" stroke="rgba(77,159,255,0.08)" strokeWidth="2" />
        <motion.path d="M 0 15 C 60 15, 140 15, 200 15" stroke="rgba(77,159,255,0.5)" strokeWidth="2" strokeDasharray={pathLength} style={{ strokeDashoffset: dashOffset }} />
      </svg>
      <motion.div style={{ opacity: particleOpacity }} className="absolute inset-0 flex items-center">
        {[0, 1, 2].map((i) => (
          <div key={i} className="dataflow-particle absolute h-1.5 w-1.5 rounded-full bg-accent/70" style={{ "--particle-distance": "100%", "--particle-duration": `${2.5 + i * 0.4}s`, "--particle-delay": `${i * 0.8}s`, left: 0 } as React.CSSProperties} />
        ))}
      </motion.div>
    </div>
  );
}

function InfoCard({ step, index, progress }: { step: (typeof steps)[number]; index: number; progress: MotionValue<number> }) {
  const fadeIn = 0.1 + index * 0.2;
  const fadeOut = index < 3 ? fadeIn + 0.17 : 0.88;
  const opacity = useTransform(progress, [fadeIn, fadeIn + 0.08, fadeOut, fadeOut + 0.05], [0, 1, 1, 0]);
  const y = useTransform(progress, [fadeIn, fadeIn + 0.08], [20, 0]);

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0 flex flex-col justify-center rounded-3xl bg-surface/80 px-8 py-6">
      <span className="mb-2 font-mono text-xs tracking-widest text-accent">{step.num}</span>
      <h3 className="mb-2 text-lg font-semibold text-text-primary">{step.label}</h3>
      <p className="text-sm leading-relaxed text-text-secondary">{step.description}</p>
    </motion.div>
  );
}

function StepIndicator({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
      {steps.map((step, i) => {
        const active = 0.1 + i * 0.2;
        const opacity = useTransform(progress, [active - 0.02, active + 0.05], [0.3, 1]);
        return (
          <motion.span key={step.num} style={{ opacity, textShadow: useTransform(progress, [active - 0.02, active + 0.05], ["0 0 0px transparent", "0 0 12px rgba(77,159,255,0.5)"]) }} className="font-mono text-xs tracking-wider text-accent">
            {step.num} {step.label}
          </motion.span>
        );
      })}
    </div>
  );
}

function MobileStep({ step, index, progress }: { step: (typeof steps)[number]; index: number; progress: MotionValue<number> }) {
  const Icon = step.icon;
  const enter = 0.05 + index * 0.2;
  const opacity = useTransform(progress, [enter, enter + 0.1], [0, 1]);
  const y = useTransform(progress, [enter, enter + 0.1], [30, 0]);

  return (
    <motion.div style={{ opacity, y }} className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 bg-surface-elevated">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        {index < 3 && <div className="my-2 h-12 w-px bg-accent/20" />}
      </div>
      <div className="flex-1 pb-6">
        <span className="font-mono text-xs tracking-widest text-accent">{step.num}</span>
        <h3 className="text-base font-semibold text-text-primary">{step.label}<span className="ml-2 text-sm font-normal text-text-muted">&mdash; {step.sublabel}</span></h3>
        <p className="mt-1 text-sm leading-relaxed text-text-secondary">{step.description}</p>
      </div>
    </motion.div>
  );
}

interface DataflowProps { activeProgress: MotionValue<number>; }

export function Dataflow({ activeProgress }: DataflowProps) {
  const progress = useTransform(activeProgress, [0, 1], [0, 0.88]);
  const headerOpacity = useTransform(progress, [0, 0.08], [0, 1]);
  const headerY = useTransform(progress, [0, 0.08], [30, 0]);

  return (
    <div className="dataflow-grid flex h-screen flex-col items-center justify-center overflow-hidden px-6">
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image src="/images/gallery/cosmic-swirl.jpeg" alt="" fill className="object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(77,159,255,0.04),transparent)]" />
      <div className="relative flex w-full max-w-5xl flex-col items-center gap-10">
        <motion.div style={{ opacity: headerOpacity, y: headerY }} className="text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl md:text-6xl">The Path</h2>
          <p className="mt-3 text-sm tracking-widest text-text-muted">From dream to reality in 4 steps</p>
        </motion.div>
        <div className="hidden w-full items-center justify-center gap-2 md:flex">
          {steps.map((step, i) => (
            <div key={step.num} className="contents">
              <PipelineNode step={step} index={i} progress={progress} />
              {i < 3 && <ConnectionLine index={i} progress={progress} />}
            </div>
          ))}
        </div>
        <div className="relative hidden h-40 w-full max-w-lg md:block">
          {steps.map((step, i) => (<InfoCard key={step.num} step={step} index={i} progress={progress} />))}
        </div>
        <div className="hidden md:block"><StepIndicator progress={progress} /></div>
        <div className="w-full md:hidden">
          {steps.map((step, i) => (<MobileStep key={step.num} step={step} index={i} progress={progress} />))}
        </div>
      </div>
    </div>
  );
}
