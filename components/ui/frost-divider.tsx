"use client";

import { motion } from "framer-motion";

export function FrostDivider() {
  return (
    <div className="flex items-center justify-center py-8">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative flex w-full max-w-xl items-center"
        style={{ originX: 0.5 }}
      >
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        <div className="mx-4 h-2 w-2 rotate-45 border border-accent/40 bg-accent/10" />
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      </motion.div>
    </div>
  );
}
