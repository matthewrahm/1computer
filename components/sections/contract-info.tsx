"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CopyButton } from "@/components/ui/copy-button";
import { ExternalLink } from "lucide-react";
import { GlitchText } from "@/components/ui/glitch-text";

const CONTRACT_ADDRESS = "Hg7TS1GMo1bGKJWsSQNgh3CzLFudSRH4tu5DHYNapump";

interface MarketData { marketCap: number | null; priceUsd: string | null; volume24h: number | null; priceChange24h: number | null; }

function formatMarketCap(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

function formatVolume(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

function StatCard({ label, value, sub, delay }: { label: string; value: string; sub?: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay }}>
      <div className="gradient-border">
        <div className="p-5 text-center">
          <p className="font-mono text-2xl font-bold text-accent sm:text-3xl">{value}</p>
          {sub && <p className="mt-1 font-mono text-xs text-accent-muted">{sub}</p>}
          <p className="mt-2 text-xs uppercase tracking-wider text-text-muted">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function ContractInfo() {
  const [data, setData] = useState<MarketData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try { const res = await fetch("/api/market-cap"); if (res.ok) setData(await res.json()); } catch { /* silent */ }
    }
    fetchData();
    const interval = setInterval(fetchData, 60_000);
    return () => clearInterval(interval);
  }, []);

  const priceChange = data?.priceChange24h;
  const isPositive = priceChange !== null && priceChange !== undefined && priceChange >= 0;

  return (
    <div className="flex h-screen items-center justify-center px-6">
      <div className="mx-auto w-full max-w-2xl">
        <GlitchText text="$DREAM" as="h2" className="font-display mb-3 text-center text-4xl font-bold tracking-tight text-text-primary sm:text-5xl md:text-6xl" />
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-10 text-center text-text-secondary">
          On Solana — 1 Computer, 1 Dream
        </motion.p>

        {data?.marketCap && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <StatCard label="Market Cap" value={formatMarketCap(data.marketCap)} delay={0.1} />
            {data.volume24h !== null && <StatCard label="24h Volume" value={formatVolume(data.volume24h)} delay={0.2} />}
            {priceChange !== null && priceChange !== undefined && <StatCard label="24h Change" value={`${isPositive ? "+" : ""}${priceChange.toFixed(1)}%`} sub={isPositive ? "bullish" : ""} delay={0.3} />}
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="mb-8">
          <p className="mb-2 text-center text-sm text-text-muted">Contract Address</p>
          <div className="flex justify-center"><CopyButton text={CONTRACT_ADDRESS} /></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a href={`https://pump.fun/coin/${CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="btn-primary">Buy on Pump.fun<ExternalLink className="h-4 w-4" /></a>
          <a href={`https://jup.ag/swap/SOL-${CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="btn-secondary">Buy on Jupiter<ExternalLink className="h-4 w-4" /></a>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.6 }} className="mt-6 text-center text-xs text-text-muted">
          DYOR. Not financial advice. Crypto carries inherent risk.
        </motion.p>
      </div>
    </div>
  );
}
