import React from "react";

/** Origami brand mark (from /logo/origami-mark.svg), tuned for dark backgrounds. */
export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden="true">
      <polygon
        points="256,76 76,256 256,436"
        fill="none"
        stroke="#c7d2fe"
        strokeWidth="22"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <line x1="76" y1="256" x2="256" y2="256" stroke="#c7d2fe" strokeWidth="18" strokeLinecap="round" strokeDasharray="24 16" />
      <line x1="166" y1="166" x2="256" y2="180" stroke="#a5b4fc" strokeWidth="16" strokeLinecap="round" />
      <line x1="166" y1="346" x2="256" y2="332" stroke="#a5b4fc" strokeWidth="16" strokeLinecap="round" />
      <polygon points="256,76 416,148 340,226 256,180" fill="#818CF8" />
      <polygon points="256,180 340,226 340,346 256,256" fill="#6366F1" />
      <polygon points="340,226 436,184 436,304 340,346" fill="#4F46E5" />
      <polygon points="256,256 340,346 256,436" fill="#3730A3" />
      <line x1="256" y1="76" x2="256" y2="436" stroke="#ffffff" strokeWidth="20" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <Logo className="w-7 h-7" />
      <span className="font-display text-[17px] font-semibold tracking-tight text-white">Origami</span>
    </span>
  );
}
