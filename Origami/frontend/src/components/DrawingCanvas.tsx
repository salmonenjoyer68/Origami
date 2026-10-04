"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { PRESETS, STYLE_CHIPS, PresetItem } from "./presets";

interface DrawingCanvasProps {
  onGenerate: (imageSrc: string) => void;
  isLoading: boolean;
  prompt: string;
  setPrompt: (value: string) => void;
  removeBackground: boolean;
  setRemoveBackground: (value: boolean) => void;
  presetRequest?: { id: string; nonce: number } | null;
}

type ToolType = "pen" | "highlighter" | "eraser";

const PALETTE = [
  { label: "Onyx", value: "#18181b" },
  { label: "Indigo", value: "#6366f1" },
  { label: "Purple", value: "#a855f7" },
  { label: "Sky", value: "#0ea5e9" },
  { label: "Emerald", value: "#10b981" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Rose", value: "#f43f5e" },
];

const TOOLS: { id: ToolType; label: string; icon: string }[] = [
  { id: "pen", label: "Pen", icon: "M15.232 5.232l3.536 3.536M4 20l4.5-1 10-10a2.5 2.5 0 00-3.536-3.536l-10 10L4 20z" },
  { id: "highlighter", label: "Shade", icon: "M9 11l-5 5v4h4l5-5M14 6l4 4M12.5 7.5l4 4L20 8l-4-4-3.5 3.5z" },
  { id: "eraser", label: "Eraser", icon: "M20 20H9l-5-5a2 2 0 010-2.83l8.17-8.17a2 2 0 012.83 0l5 5a2 2 0 010 2.83L13 19M7 12l6 6" },
];

export function DrawingCanvas({
  onGenerate,
  isLoading,
  prompt,
  setPrompt,
  removeBackground,
  setRemoveBackground,
  presetRequest,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isDrawingRef = useRef<boolean>(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const [tool, setTool] = useState<ToolType>("pen");
  const [color, setColor] = useState<string>("#18181b");
  const [brushSize, setBrushSize] = useState<number>(8);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  const getCtx = () => canvasRef.current?.getContext("2d", { willReadFrequently: true }) ?? null;

  const pushSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return;
    const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-24), snap]);
  }, []);

  const sizeCanvas = useCallback((preserve: boolean) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    let backup: HTMLCanvasElement | null = null;
    let prevCssW = 0;
    let prevCssH = 0;
    if (preserve && canvas.width > 0 && canvas.height > 0) {
      backup = document.createElement("canvas");
      backup.width = canvas.width;
      backup.height = canvas.height;
      backup.getContext("2d")?.drawImage(canvas, 0, 0);
      const dprPrev = window.devicePixelRatio || 1;
      prevCssW = canvas.width / dprPrev;
      prevCssH = canvas.height / dprPrev;
    }

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (backup) {
      const dx = (rect.width - prevCssW) / 2;
      const dy = (rect.height - prevCssH) / 2;
      ctx.drawImage(backup, dx, dy, prevCssW, prevCssH);
    }

    setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  }, []);

  useEffect(() => {
    sizeCanvas(false);
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => sizeCanvas(true));
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [sizeCanvas]);

  const handleGenerate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isLoading || !hasDrawn) return;
    const dataUrl = canvas.toDataURL("image/png");
    onGenerate(dataUrl);
  }, [hasDrawn, isLoading, onGenerate]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleGenerate();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const t = e.touches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const strokeWidth = tool === "pen" ? brushSize : brushSize * 2.5;

  const applyBrush = (ctx: CanvasRenderingContext2D) => {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    ctx.globalAlpha = tool === "highlighter" ? 0.35 : 1;
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (isLoading) return;
    const ctx = getCtx();
    if (!ctx) return;
    isDrawingRef.current = true;
    const p = getCoordinates(e);
    lastPointRef.current = p;
    applyBrush(ctx);
    ctx.beginPath();
    ctx.arc(p.x, p.y, strokeWidth / 2, 0, Math.PI * 2);
    ctx.fillStyle = tool === "eraser" ? "#ffffff" : color;
    ctx.fill();
    setHasDrawn(true);
    setActivePreset(null);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawingRef.current || !lastPointRef.current || isLoading) return;
    const ctx = getCtx();
    if (!ctx) return;
    const p = getCoordinates(e);
    applyBrush(ctx);
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastPointRef.current = p;
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;
    const ctx = getCtx();
    if (ctx) ctx.globalAlpha = 1;
    pushSnapshot();
  };

  const handleUndo = () => {
    if (history.length <= 1 || isLoading) return;
    const ctx = getCtx();
    if (!ctx) return;
    const next = history.slice(0, -1);
    ctx.putImageData(next[next.length - 1], 0, 0);
    setHistory(next);
    if (next.length === 1) setHasDrawn(false);
  };

  const resetToWhite = (): { ctx: CanvasRenderingContext2D; w: number; h: number } | null => {
    const ctx = getCtx();
    const container = containerRef.current;
    if (!ctx || !container) return null;
    const rect = container.getBoundingClientRect();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    return { ctx, w: rect.width, h: rect.height };
  };

  const handleClear = () => {
    if (isLoading) return;
    const canvas = canvasRef.current;
    const r = resetToWhite();
    if (!r || !canvas) return;
    setHistory([r.ctx.getImageData(0, 0, canvas.width, canvas.height)]);
    setHasDrawn(false);
    setActivePreset(null);
  };

  const loadPreset = useCallback(
    (preset: PresetItem) => {
      if (isLoading) return;
      const r = resetToWhite();
      if (!r) return;
      preset.draw(r.ctx, r.w, r.h);
      r.ctx.globalAlpha = 1;
      pushSnapshot();
      setHasDrawn(true);
      setActivePreset(preset.id);
      setPrompt(preset.prompt);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, pushSnapshot, setPrompt]
  );

  useEffect(() => {
    if (!presetRequest) return;
    const preset = PRESETS.find((p) => p.id === presetRequest.id);
    if (preset) loadPreset(preset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetRequest]);

  const addStyleTag = (tag: string) => {
    if (prompt.toLowerCase().includes(tag)) return;
    setPrompt(prompt.trim() ? `${prompt.trim()}, ${tag}` : tag);
  };

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const r = resetToWhite();
        if (!r) return;
        const scale = Math.min((r.w * 0.85) / img.width, (r.h * 0.85) / img.height);
        const nw = img.width * scale;
        const nh = img.height * scale;
        r.ctx.drawImage(img, (r.w - nw) / 2, (r.h - nh) / 2, nw, nh);
        pushSnapshot();
        setHasDrawn(true);
        setActivePreset(null);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleImageFile(f);
  };

  return (
    <div className="w-full h-full flex flex-col bg-studio-900 overflow-hidden relative">
      {/* Sleek Top Studio Toolbar */}
      <div className="px-3.5 h-12 border-b border-white/[0.08] flex items-center justify-between gap-3 bg-studio-900/90 backdrop-blur shrink-0 z-10">
        {/* Left: Tools */}
        <div className="flex items-center gap-2">
          <div className="segmented" role="radiogroup" aria-label="Drawing tool">
            {TOOLS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={tool === t.id}
                data-active={tool === t.id}
                title={t.label}
                onClick={() => setTool(t.id)}
                className="!px-2.5 inline-flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={t.icon} />
                </svg>
                <span className="text-xs font-medium">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-white/10 mx-1 hidden sm:block" />

          {/* Color swatches */}
          <div className={`hidden sm:flex items-center gap-1.5 transition-opacity ${tool === "eraser" ? "opacity-25 pointer-events-none" : ""}`}>
            {PALETTE.map((p) => (
              <button
                key={p.value}
                type="button"
                title={p.label}
                aria-label={`Colour ${p.label}`}
                aria-pressed={color === p.value}
                onClick={() => setColor(p.value)}
                style={{ backgroundColor: p.value }}
                className={`w-4 h-4 rounded-full transition-all ${
                  color === p.value ? "ring-2 ring-offset-1 ring-offset-studio-900 ring-white" : "hover:scale-110 opacity-80 hover:opacity-100"
                }`}
              />
            ))}
            <label className="relative w-4 h-4 rounded-full overflow-hidden ring-1 ring-white/20 cursor-pointer bg-[conic-gradient(red,yellow,lime,cyan,blue,magenta,red)] hover:scale-110 transition-transform" title="Custom color">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" aria-label="Custom color" />
            </label>
          </div>

          <div className="w-px h-5 bg-white/10 mx-1 hidden md:block" />

          {/* Brush Size */}
          <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400">
            <input
              type="range"
              min={2}
              max={28}
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-16 accent-brand-500 cursor-pointer"
              aria-label="Brush size"
              title={`Brush size: ${brushSize}px`}
            />
            <span className="font-mono text-[11px] text-zinc-400">{brushSize}px</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="icon-btn !h-8 !px-2.5 gap-1.5 text-xs text-zinc-300 hover:text-white"
            onClick={handleUndo}
            disabled={history.length <= 1 || isLoading}
            title="Undo stroke (Ctrl+Z)"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h10a5 5 0 015 5v2M3 10l6-6m-6 6l6 6" />
            </svg>
            <span className="hidden xl:inline">Undo</span>
          </button>

          <button
            type="button"
            className="icon-btn !h-8 !px-2.5 gap-1.5 text-xs text-zinc-300 hover:text-white"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            title="Upload sketch or photo"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span className="hidden xl:inline">Upload</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImageFile(f);
              e.target.value = "";
            }}
          />

          <button
            type="button"
            onClick={handleClear}
            disabled={!hasDrawn || isLoading}
            className="icon-btn !h-8 !px-2.5 text-xs text-zinc-400 hover:!text-rose-300 hover:!bg-rose-500/10"
            title="Clear canvas"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Preset Doodles Strip */}
      <div className="px-3 py-1.5 border-b border-white/[0.05] bg-black/20 flex items-center gap-1.5 overflow-x-auto shrink-0 select-none no-scrollbar">
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider pl-1 shrink-0">Presets:</span>
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => loadPreset(p)}
            disabled={isLoading}
            className={`h-6 px-2.5 rounded-full text-xs shrink-0 inline-flex items-center gap-1.5 border transition-all ${
              activePreset === p.id
                ? "bg-brand-500/25 text-brand-200 border-brand-400/50 shadow-sm"
                : "text-zinc-400 border-white/[0.06] hover:text-zinc-200 hover:border-white/20 bg-white/[0.02]"
            }`}
          >
            <span>{p.emoji}</span>
            <span>{p.name}</span>
          </button>
        ))}
      </div>

      {/* Canvas Area (Spacious & Responsive) */}
      <div
        ref={containerRef}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
        className="relative flex-1 min-h-0 canvas-grid-bg cursor-crosshair overflow-hidden touch-none"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 w-full h-full block"
          aria-label="Drawing canvas"
        />

        {isDraggingOver && (
          <div className="absolute inset-4 rounded-2xl bg-brand-600/20 backdrop-blur-md border-2 border-dashed border-brand-400 flex flex-col items-center justify-center text-brand-200 gap-2 z-20 animate-fade-in">
            <span className="text-3xl">📥</span>
            <span className="font-semibold text-base">Drop your image here</span>
            <span className="text-xs text-brand-300/80">Supports PNG, JPG, WebP</span>
          </div>
        )}

        {!hasDrawn && !isDraggingOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none p-6 text-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-2xl text-zinc-400 shadow-inner">
              ✏️
            </div>
            <p className="text-sm font-medium text-zinc-300">Sketch anything here</p>
            <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
              Click a preset doodle above, drag in an image, or use the pen to start drawing
            </p>
          </div>
        )}
      </div>

      {/* Modern Bottom Command Dock */}
      <div className="p-3 border-t border-white/[0.08] bg-studio-950/90 backdrop-blur shrink-0 space-y-2.5 z-10">
        {/* Style chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider pl-1 shrink-0">Style:</span>
          {STYLE_CHIPS.map((chip) => {
            const on = prompt.toLowerCase().includes(chip);
            return (
              <button
                key={chip}
                type="button"
                onClick={() => addStyleTag(chip)}
                disabled={isLoading || on}
                className={`h-5 px-2 rounded-md text-[11px] shrink-0 border transition-all ${
                  on
                    ? "bg-brand-500/20 text-brand-200 border-brand-400/40"
                    : "text-zinc-400 border-white/[0.06] hover:text-zinc-200 hover:border-white/20"
                }`}
              >
                {on ? "✓" : "+"} {chip}
              </button>
            );
          })}
        </div>

        {/* Input & Action Bar */}
        <div className="flex items-stretch gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your model (e.g. ceramic mug, low poly)"
            disabled={isLoading}
            aria-label="Prompt"
            className="flex-1 min-w-0 h-11 bg-black/40 border border-white/[0.1] rounded-xl px-3.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition disabled:opacity-50"
          />

          <label
            className="shrink-0 h-11 px-3 inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] text-xs text-zinc-300 cursor-pointer select-none hover:bg-white/[0.05]"
            title="Automatically isolate your subject before generating 3D"
          >
            <input
              type="checkbox"
              checked={removeBackground}
              onChange={(e) => setRemoveBackground(e.target.checked)}
              disabled={isLoading}
              className="accent-brand-500 w-3.5 h-3.5"
            />
            <span className="hidden sm:inline">Remove BG</span>
            <span className="sm:hidden">BG</span>
          </label>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading || !hasDrawn}
            className="btn-primary !h-11 !px-5 !rounded-xl text-sm font-semibold shrink-0 disabled:opacity-40 disabled:pointer-events-none"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="hidden sm:inline">Generating…</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Generate 3D</span>
                <kbd className="hidden md:inline-flex items-center h-5 px-1.5 rounded bg-white/20 text-[10px] font-mono">
                  Ctrl ↵
                </kbd>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
