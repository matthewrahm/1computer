"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "About", href: "#manifesto" },
  { label: "Gallery", href: "#gallery" },
  { label: "Tokenomics", href: "#tokenomics" },
  { label: "Buy", href: "#buy" },
];

export function FloatingNav() {
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const sectionIds = ["manifesto", "gallery", "tokenomics", "buy"];
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      setPastHero(scrollY > vh * 2);

      const delta = scrollY - lastScrollY;
      if (delta > 8) { setVisible(false); setMobileOpen(false); }
      else if (delta < -4) { setVisible(true); }
      lastScrollY = scrollY;

      let active = "";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && scrollY >= el.offsetTop - vh * 0.5) active = id;
      }
      setActiveSection(active);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {pastHero && (
        <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -20 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="fixed top-4 left-1/2 z-40 -translate-x-1/2">
          <div className="flex items-center gap-1 rounded-full border border-accent/10 bg-background/70 px-2 py-1.5 backdrop-blur-xl sm:gap-2 sm:px-4">
            <Image src="/images/1computer-hero.jpeg" alt="$1COMPUTER" width={32} height={32} className="rounded-full" />
            <div className="hidden items-center gap-1 sm:flex">
              {navLinks.map((link) => (
                <button key={link.href} onClick={() => handleClick(link.href)} className={cn("rounded-full px-3 py-1.5 text-sm transition-colors", activeSection === link.href.slice(1) ? "bg-accent/10 text-accent" : "text-text-secondary hover:text-text-primary")}>
                  {link.label}
                </button>
              ))}
            </div>
            <button onClick={() => handleClick("#buy")} className="btn-primary hidden py-1.5 text-xs sm:inline-flex">Buy $1COMPUTER</button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-full p-2 text-text-secondary sm:hidden">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute top-full left-1/2 mt-2 -translate-x-1/2 rounded-2xl border border-accent/10 bg-background/90 p-3 backdrop-blur-xl">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <button key={link.href} onClick={() => handleClick(link.href)} className={cn("rounded-xl px-6 py-2.5 text-left text-sm transition-colors", activeSection === link.href.slice(1) ? "bg-accent/10 text-accent" : "text-text-secondary hover:text-text-primary")}>
                      {link.label}
                    </button>
                  ))}
                  <button onClick={() => handleClick("#buy")} className="btn-primary w-full text-sm">Buy $1COMPUTER</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
