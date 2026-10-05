import React from "react";

/** Origami brand mark (from /logo/origami-logo-mono.svg) — monochrome, follows currentColor. */
export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden="true">
      {/* Left side: flat 2D sheet outline */}
      <polygon
        points="256,76 76,256 256,436"
        fill="none"
        stroke="currentColor"
        strokeWidth="22"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <line x1="76" y1="256" x2="256" y2="256" stroke="currentColor" strokeWidth="18" strokeLinecap="round" strokeDasharray="24 16" />
      <line x1="166" y1="166" x2="256" y2="180" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
      <line x1="166" y1="346" x2="256" y2="332" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
      {/* Right side: folded volume facets via opacity */}
      <polygon points="256,76 416,148 340,226 256,180" fill="currentColor" fillOpacity={0.35} />
      <polygon points="256,180 340,226 340,346 256,256" fill="currentColor" fillOpacity={0.7} />
      <polygon points="340,226 436,184 436,304 340,346" fill="currentColor" fillOpacity={1} />
      <polygon points="256,256 340,346 256,436" fill="currentColor" fillOpacity={0.5} />
      {/* Central spine fold */}
      <line x1="256" y1="76" x2="256" y2="436" stroke="currentColor" strokeWidth="20" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <Logo className="w-7 h-7" />
      <span className="font-display text-[17px] font-semibold tracking-tight text-fg">Origami</span>
    </span>
  );
}
