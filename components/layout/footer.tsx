import Image from "next/image";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-accent/5 backdrop-blur-sm" style={{ backgroundColor: "rgba(3, 5, 16, 0.5)" }}>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-3">
            <Image src="/images/1computer-hero.jpeg" alt="$1COMPUTER" width={40} height={40} className="rounded-full" />
            <span className="text-xl text-text-primary">$1COMPUTER</span>
          </div>
          <a href="https://x.com/placeholder_handle" target="_blank" rel="noopener noreferrer" className="rounded-full bg-surface p-3 text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text-primary">
            <XIcon className="h-5 w-5" />
          </a>
          <p className="max-w-md text-sm text-text-muted">&ldquo;1 computer. That&apos;s it. That&apos;s the tweet.&rdquo;</p>
          <p className="text-xs text-text-muted">&copy; 2026 1 Computer 1 Dream. Not financial advice. DYOR.</p>
        </div>
      </div>
    </footer>
  );
}
