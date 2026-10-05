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
      <div className="relative w-full max-w-md bg-surface border-l border-line shadow-2xl h-full flex flex-col overflow-hidden animate-slide-left">
        {/* Header */}
        <div className="px-6 h-16 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📖</span>
            <h2 className="font-display font-semibold text-lg text-fg">Origami Studio Guide</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="icon-btn !h-8 !w-8"
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
            <h3 className="font-semibold text-fg-muted uppercase tracking-wider text-xs">
              Quick Start
            </h3>
            <ol className="space-y-3 text-fg-muted">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-surface-2 text-fg font-mono text-xs flex items-center justify-center shrink-0 border border-line">
                  1
                </span>
                <div>
                  <strong className="text-fg">Sketch or drop an image:</strong> Draw in the left pane using the pen, shading, or preset doodles.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-surface-2 text-fg font-mono text-xs flex items-center justify-center shrink-0 border border-line">
                  2
                </span>
                <div>
                  <strong className="text-fg">Add a prompt:</strong> Type what you drew (e.g. <em>&quot;ceramic coffee mug&quot;</em>) and select style tags like <em>low poly</em>.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-surface-2 text-fg font-mono text-xs flex items-center justify-center shrink-0 border border-line">
                  3
                </span>
                <div>
                  <strong className="text-fg">Generate &amp; Orbit:</strong> Click <strong>Generate 3D</strong> (or press <kbd className="px-1.5 py-0.5 rounded bg-surface-2 border border-line font-mono text-xs">Ctrl+Enter</kbd>). Interact with your mesh, toggle wireframe, and download the <code className="text-fg font-mono">.GLB</code> file.
                </div>
              </li>
            </ol>
          </section>

          {/* Keyboard Shortcuts */}
          <section className="space-y-3">
            <h3 className="font-semibold text-fg-muted uppercase tracking-wider text-xs">
              Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-canvas border border-line flex items-center justify-between">
                <span className="text-fg-muted">Generate 3D</span>
                <kbd className="px-2 py-0.5 rounded bg-surface-2 border border-line font-mono text-fg">Ctrl + ↵</kbd>
              </div>
              <div className="p-2.5 rounded-lg bg-canvas border border-line flex items-center justify-between">
                <span className="text-fg-muted">Undo Stroke</span>
                <kbd className="px-2 py-0.5 rounded bg-surface-2 border border-line font-mono text-fg">Ctrl + Z</kbd>
              </div>
              <div className="p-2.5 rounded-lg bg-canvas border border-line flex items-center justify-between">
                <span className="text-fg-muted">Orbit 3D</span>
                <span className="text-fg">Left Drag</span>
              </div>
              <div className="p-2.5 rounded-lg bg-canvas border border-line flex items-center justify-between">
                <span className="text-fg-muted">Zoom / Pan</span>
                <span className="text-fg">Scroll / Right Drag</span>
              </div>
            </div>
          </section>

          {/* Sketching Tips */}
          <section className="space-y-3">
            <h3 className="font-semibold text-fg-muted uppercase tracking-wider text-xs">
              Tips for Best 3D Results
            </h3>
            <ul className="space-y-2 text-fg-muted list-disc list-inside">
              <li>Draw clear, closed outlines with good contrast.</li>
              <li>Focus on a single central object rather than a full landscape.</li>
              <li>Use the <strong>Remove BG</strong> option if your uploaded photo has a messy background.</li>
              <li>Include descriptive prompts like <em>&quot;wooden chair, isometric&quot;</em> to guide geometry.</li>
            </ul>
          </section>

          {/* FAQ */}
          <section className="space-y-3">
            <h3 className="font-semibold text-fg-muted uppercase tracking-wider text-xs">
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-canvas border border-line">
                <p className="font-medium text-fg mb-1">What file format do I get?</p>
                <p className="text-fg-muted text-xs">Standard binary <code className="text-fg font-mono">.GLB</code> meshes compatible with Blender, Unreal Engine, Unity, Godot, and Three.js.</p>
              </div>
              <div className="p-3 rounded-xl bg-canvas border border-line">
                <p className="font-medium text-fg mb-1">Why am I seeing a demo model?</p>
                <p className="text-fg-muted text-xs">The free Hugging Face ZeroGPU queue occasionally hits its rate limit. Origami serves a high-fidelity sample crane mesh so your workflow never breaks while the quota resets.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-line bg-canvas flex items-center justify-between text-xs text-fg-faint">
          <span>Origami Studio 2.0</span>
          <button type="button" onClick={onClose} className="btn-secondary !h-8 !px-3 !text-xs">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
