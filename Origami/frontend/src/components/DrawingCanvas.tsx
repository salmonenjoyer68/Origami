"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

interface DrawingCanvasProps {
  onGenerate: (imageSrc: string) => void;
  isLoading: boolean;
  prompt: string;
  setPrompt: (value: string) => void;
  removeBackground: boolean;
  setRemoveBackground: (value: boolean) => void;
}

const COLORS = [
  { label: "Black", value: "#000000" },
  { label: "Dark Gray", value: "#4b5563" },
  { label: "Red", value: "#ef4444" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Green", value: "#10b981" },
  { label: "Eraser", value: "#ffffff" },
];

const BRUSH_SIZES = [
  { label: "Fine", size: 4 },
  { label: "Medium", size: 8 },
  { label: "Thick", size: 16 },
];

export function DrawingCanvas({
  onGenerate,
  isLoading,
  prompt,
  setPrompt,
  removeBackground,
  setRemoveBackground,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const [color, setColor] = useState<string>("#000000");
  const [brushSize, setBrushSize] = useState<number>(8);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);

  // Initialize and resize canvas with high-DPI awareness and solid white background
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Initial state for history
    const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialData]);
    setHasDrawn(false);
  }, []);

  useEffect(() => {
    initCanvas();

    const handleResize = () => {
      // Re-init on window resize
      initCanvas();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initCanvas]);

  // Extract relative coordinates inside canvas
  const getCoordinates = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Start Drawing
  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (isLoading) return;
    isDrawingRef.current = true;
    const coords = getCoordinates(e);
    lastPointRef.current = coords;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    setHasDrawn(true);
  };

  // Draw
  const draw = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawingRef.current || !lastPointRef.current || isLoading) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const coords = getCoordinates(e);

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    lastPointRef.current = coords;
  };

  // Stop Drawing & save history snapshot
  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (ctx && canvas) {
      const currentSnapshot = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
      setHistory((prev) => [...prev.slice(-19), currentSnapshot]);
    }
  };

  // Undo last stroke
  const handleUndo = () => {
    if (history.length <= 1 || isLoading) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!ctx || !canvas) return;

    const newHistory = history.slice(0, -1);
    const previousSnapshot = newHistory[newHistory.length - 1];
    ctx.putImageData(previousSnapshot, 0, 0);
    setHistory(newHistory);
    if (newHistory.length === 1) {
      setHasDrawn(false);
    }
  };

  // Clear Canvas
  const handleClear = () => {
    if (isLoading) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!ctx || !canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);

    const emptySnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([emptySnapshot]);
    setHasDrawn(false);
  };

  // Extract Canvas Base64 & Trigger 3D Generation
  const handleGenerate = () => {
    const canvas = canvasRef.current;
    if (!canvas || isLoading) return;
    // Extract base64 image (PNG with white background)
    const dataUrl = canvas.toDataURL("image/png");
    onGenerate(dataUrl);
  };

  return (
    <div className="w-full h-[520px] lg:h-[600px] bg-zinc-950/80 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl backdrop-blur-sm">
      {/* Top Header & Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/70 backdrop-blur-md border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            2D Canvas
          </span>
        </div>

        {/* Brush Size & Colors */}
        <div className="flex items-center gap-3">
          {/* Color Palette */}
          <div className="flex items-center gap-1.5 bg-zinc-800/80 px-2 py-1 rounded-lg border border-zinc-700/60">
            {COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                title={c.label}
                onClick={() => setColor(c.value)}
                style={{ backgroundColor: c.value }}
                className={`w-4 h-4 rounded-full border transition-transform ${
                  color === c.value
                    ? "scale-125 border-indigo-400 ring-2 ring-indigo-500/40"
                    : "border-zinc-600 hover:scale-110"
                }`}
              />
            ))}
          </div>

          {/* Brush Sizes */}
          <div className="hidden sm:flex items-center gap-1 bg-zinc-800/80 p-0.5 rounded-lg border border-zinc-700/60 text-xs">
            {BRUSH_SIZES.map((b) => (
              <button
                key={b.size}
                type="button"
                onClick={() => setBrushSize(b.size)}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  brushSize === b.size
                    ? "bg-indigo-600 text-white font-medium"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Undo */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length <= 1 || isLoading}
            title="Undo stroke"
            className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:pointer-events-none border border-zinc-700/60 transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a5 5 0 015 5v2M3 10l6-6m-6 6l6 6"
              />
            </svg>
          </button>

          {/* Clear Button */}
          <button
            type="button"
            onClick={handleClear}
            disabled={!hasDrawn || isLoading}
            className="px-2.5 py-1 text-xs rounded-lg bg-zinc-800/80 hover:bg-red-500/20 text-zinc-300 hover:text-red-400 border border-zinc-700/60 hover:border-red-500/30 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Drawing Area */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full h-full bg-white cursor-crosshair overflow-hidden touch-none"
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
          className="w-full h-full block"
        />

        {/* Empty state hint */}
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-zinc-400/60 text-sm font-medium tracking-wide">
              Draw an object here (e.g. coffee mug, chair, sword)...
            </span>
          </div>
        )}
      </div>

      {/* Bottom Controls & Action Bar */}
      <div className="p-3 bg-zinc-900/80 border-t border-zinc-800 flex flex-col gap-2.5">
        <div className="flex items-center gap-3">
          {/* Prompt Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Optional description (e.g., 'a ceramic teacup')"
              disabled={isLoading}
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
            />
          </div>

          {/* Background Removal Checkbox */}
          <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={removeBackground}
              onChange={(e) => setRemoveBackground(e.target.checked)}
              disabled={isLoading}
              className="rounded border-zinc-700 bg-zinc-800 text-indigo-600 focus:ring-0 focus:ring-offset-0"
            />
            <span>Auto-RMBG</span>
          </label>
        </div>

        {/* Generate 3D Button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading || !hasDrawn}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99] text-white font-medium text-xs sm:text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:pointer-events-none"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating 3D Model...</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
              <span>Generate 3D</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
