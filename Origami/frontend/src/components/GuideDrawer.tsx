"use client";

import React, { useEffect } from "react";

interface GuideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuideDrawer({ isOpen, onClose }: GuideDrawerProps) {
  // Close on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-studio-900 border-l border-white/10 shadow-2xl h-full flex flex-col overflow-hidden animate-slide-left">
        {/* Header */}
        <div className="px-6 h-16 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📖</span>
            <h2 className="font-display font-semibold text-lg text-white">Origami Studio Guide</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="icon-btn !h-8 !w-8 hover:!bg-white/10"
            aria-label="Close guide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 text-sm">
          {/* Quick Start */}
          <section className="space-y-3">
            <h3 className="font-semibold text-white uppercase tracking-wider text-xs text-brand-300">
              Quick Start
            </h3>
            <ol className="space-y-3 text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-300 font-mono text-xs flex items-center justify-center shrink-0 border border-brand-500/30">
                  1
                </span>
                <div>
                  <strong className="text-white">Sketch or drop an image:</strong> Draw in the left pane using the pen, shading, or preset doodles.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-300 font-mono text-xs flex items-center justify-center shrink-0 border border-brand-500/30">
                  2
                </span>
                <div>
                  <strong className="text-white">Add a prompt:</strong> Type what you drew (e.g. <em>&quot;ceramic coffee mug&quot;</em>) and select style tags like <em>low poly</em>.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-300 font-mono text-xs flex items-center justify-center shrink-0 border border-brand-500/30">
                  3
                </span>
                <div>
                  <strong className="text-white">Generate &amp; Orbit:</strong> Click <strong>Generate 3D</strong> (or press <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-xs">Ctrl+Enter</kbd>). Interact with your mesh, toggle wireframe, and download the <code className="text-brand-300 font-mono">.GLB</code> file.
                </div>
              </li>
            </ol>
          </section>

          {/* Keyboard Shortcuts */}
          <section className="space-y-3">
            <h3 className="font-semibold text-white uppercase tracking-wider text-xs text-brand-300">
              Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-black/30 border border-white/[0.06] flex items-center justify-between">
                <span className="text-zinc-400">Generate 3D</span>
                <kbd className="px-2 py-0.5 rounded bg-white/10 font-mono text-zinc-200">Ctrl + ↵</kbd>
              </div>
              <div className="p-2.5 rounded-lg bg-black/30 border border-white/[0.06] flex items-center justify-between">
                <span className="text-zinc-400">Undo Stroke</span>
                <kbd className="px-2 py-0.5 rounded bg-white/10 font-mono text-zinc-200">Ctrl + Z</kbd>
              </div>
              <div className="p-2.5 rounded-lg bg-black/30 border border-white/[0.06] flex items-center justify-between">
                <span className="text-zinc-400">Orbit 3D</span>
                <span className="text-zinc-300">Left Drag</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/30 border border-white/[0.06] flex items-center justify-between">
                <span className="text-zinc-400">Zoom / Pan</span>
                <span className="text-zinc-300">Scroll / Right Drag</span>
              </div>
            </div>
          </section>

          {/* Sketching Tips */}
          <section className="space-y-3">
            <h3 className="font-semibold text-white uppercase tracking-wider text-xs text-brand-300">
              Tips for Best 3D Results
            </h3>
            <ul className="space-y-2 text-zinc-300 list-disc list-inside">
              <li>Draw clear, closed outlines with good contrast.</li>
              <li>Focus on a single central object rather than a full landscape.</li>
              <li>Use the <strong>Remove BG</strong> option if your uploaded photo has a messy background.</li>
              <li>Include descriptive prompts like <em>&quot;wooden chair, isometric&quot;</em> to guide geometry.</li>
            </ul>
          </section>

          {/* FAQ */}
          <section className="space-y-3">
            <h3 className="font-semibold text-white uppercase tracking-wider text-xs text-brand-300">
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-black/20 border border-white/[0.06]">
                <p className="font-medium text-white mb-1">What file format do I get?</p>
                <p className="text-zinc-400 text-xs">Standard binary <code className="text-brand-300 font-mono">.GLB</code> meshes compatible with Blender, Unreal Engine, Unity, Godot, and Three.js.</p>
              </div>
              <div className="p-3 rounded-xl bg-black/20 border border-white/[0.06]">
                <p className="font-medium text-white mb-1">Why am I seeing a demo model?</p>
                <p className="text-zinc-400 text-xs">The free Hugging Face ZeroGPU queue occasionally hits its rate limit. Origami serves a high-fidelity sample crane mesh so your workflow never breaks while the quota resets.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-studio-950 flex items-center justify-between text-xs text-zinc-500">
          <span>Origami Studio 2.0</span>
          <button type="button" onClick={onClose} className="btn-secondary !h-8 !px-3 !text-xs">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
