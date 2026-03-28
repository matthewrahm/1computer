"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps { text: string; className?: string; }

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} className={cn("btn-secondary font-mono text-sm", className)}>
      <span className="truncate max-w-[200px] sm:max-w-[300px]">{text}</span>
      {copied ? <Check className="h-4 w-4 shrink-0 text-accent" /> : <Copy className="h-4 w-4 shrink-0 text-text-muted" />}
    </button>
  );
}
