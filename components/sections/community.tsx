"use client";

import Image from "next/image";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
  );
}

export function Community() {
  return (
    <div className="flex h-screen flex-col items-center justify-center px-6">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display mb-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl">The Movement</h2>
        <p className="mb-10 text-text-secondary">Join the dreamers.</p>
        <div className="mx-auto mb-10 w-full max-w-lg overflow-hidden rounded-2xl">
          <Image src="/images/gallery/coastal-cliff.jpeg" alt="1 Computer, 1 Dream" width={1280} height={960} className="w-full" />
        </div>
        <a href="https://x.com/placeholder_handle" target="_blank" rel="noopener noreferrer" className="btn-primary">
          <XIcon className="h-5 w-5" />Follow on X
        </a>
      </div>
    </div>
  );
}
