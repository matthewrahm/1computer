import { NextResponse } from "next/server";

const TOKEN_ADDRESS = "Hg7TS1GMo1bGKJWsSQNgh3CzLFudSRH4tu5DHYNapump";

export async function GET() {
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      return NextResponse.json({ marketCap: null, priceUsd: null, volume24h: null, priceChange24h: null });
    }

    const data = await res.json();
    const pair = data.pairs?.[0];

    if (!pair) {
      return NextResponse.json({ marketCap: null, priceUsd: null, volume24h: null, priceChange24h: null });
    }

    return NextResponse.json({
      marketCap: pair.marketCap ?? null,
      priceUsd: pair.priceUsd ?? null,
      volume24h: pair.volume?.h24 ?? null,
      priceChange24h: pair.priceChange?.h24 ?? null,
    });
  } catch {
    return NextResponse.json({ marketCap: null, priceUsd: null, volume24h: null, priceChange24h: null });
  }
}
