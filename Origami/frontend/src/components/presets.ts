export interface PresetItem {
  id: string;
  name: string;
  emoji: string;
  prompt: string;
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

export const PRESETS: PresetItem[] = [
  {
    id: "mug",
    name: "Coffee Mug",
    emoji: "☕",
    prompt: "a ceramic coffee mug with handle",
    draw: (ctx, width, height) => {
      const cx = width / 2;
      const cy = height / 2;
      ctx.strokeStyle = "#18181b";
      ctx.fillStyle = "#ffffff";
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Mug body
      ctx.beginPath();
      ctx.roundRect(cx - 70, cy - 60, 120, 130, [10, 10, 30, 30]);
      ctx.stroke();

      // Handle
      ctx.beginPath();
      ctx.arc(cx + 50, cy, 38, -Math.PI / 2.2, Math.PI / 2.2, false);
      ctx.stroke();

      // Steam lines
      ctx.lineWidth = 6;
      ctx.strokeStyle = "#6366f1";
      ctx.beginPath();
      ctx.moveTo(cx - 30, cy - 80);
      ctx.bezierCurveTo(cx - 40, cy - 100, cx - 20, cy - 110, cx - 30, cy - 130);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + 10, cy - 80);
      ctx.bezierCurveTo(cx, cy - 100, cx + 20, cy - 110, cx + 10, cy - 130);
      ctx.stroke();
    },
  },
  {
    id: "chair",
    name: "Modern Chair",
    emoji: "🪑",
    prompt: "a minimalist modern wooden armchair",
    draw: (ctx, width, height) => {
      const cx = width / 2;
      const cy = height / 2;
      ctx.strokeStyle = "#18181b";
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Chair backrest
      ctx.beginPath();
      ctx.roundRect(cx - 60, cy - 100, 120, 90, 12);
      ctx.stroke();

      // Chair seat
      ctx.beginPath();
      ctx.roundRect(cx - 75, cy - 10, 150, 24, 6);
      ctx.stroke();

      // Legs
      ctx.beginPath();
      ctx.moveTo(cx - 60, cy + 14);
      ctx.lineTo(cx - 70, cy + 100);
      ctx.moveTo(cx + 60, cy + 14);
      ctx.lineTo(cx + 70, cy + 100);
      ctx.moveTo(cx - 30, cy + 14);
      ctx.lineTo(cx - 35, cy + 85);
      ctx.moveTo(cx + 30, cy + 14);
      ctx.lineTo(cx + 35, cy + 85);
      ctx.stroke();
    },
  },
  {
    id: "swan",
    name: "Origami Swan",
    emoji: "🦢",
    prompt: "an origami folded paper swan geometric low poly",
    draw: (ctx, width, height) => {
      const cx = width / 2;
      const cy = height / 2;
      ctx.strokeStyle = "#4f46e5";
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Origami facets
      ctx.beginPath();
      ctx.moveTo(cx - 90, cy + 40);
      ctx.lineTo(cx - 20, cy + 50);
      ctx.lineTo(cx + 80, cy + 30);
      ctx.lineTo(cx + 40, cy - 20);
      ctx.lineTo(cx - 40, cy - 20);
      ctx.closePath();
      ctx.stroke();

      // Neck and Head
      ctx.beginPath();
      ctx.moveTo(cx - 40, cy - 20);
      ctx.lineTo(cx - 80, cy - 90);
      ctx.lineTo(cx - 110, cy - 80);
      ctx.lineTo(cx - 65, cy - 10);
      ctx.stroke();

      // Wings fold
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy + 50);
      ctx.lineTo(cx, cy - 80);
      ctx.lineTo(cx + 40, cy - 20);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx, cy - 80);
      ctx.lineTo(cx + 70, cy - 40);
      ctx.stroke();
    },
  },
  {
    id: "rocket",
    name: "Space Rocket",
    emoji: "🚀",
    prompt: "a retro space rocket with fins",
    draw: (ctx, width, height) => {
      const cx = width / 2;
      const cy = height / 2;
      ctx.strokeStyle = "#18181b";
      ctx.lineWidth = 9;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Rocket body
      ctx.beginPath();
      ctx.moveTo(cx, cy - 110);
      ctx.quadraticCurveTo(cx + 50, cy - 30, cx + 45, cy + 60);
      ctx.lineTo(cx - 45, cy + 60);
      ctx.quadraticCurveTo(cx - 50, cy - 30, cx, cy - 110);
      ctx.stroke();

      // Porthole
      ctx.beginPath();
      ctx.arc(cx, cy - 20, 20, 0, Math.PI * 2);
      ctx.stroke();

      // Left Fin
      ctx.beginPath();
      ctx.moveTo(cx - 45, cy + 20);
      ctx.lineTo(cx - 85, cy + 70);
      ctx.lineTo(cx - 45, cy + 60);
      ctx.stroke();

      // Right Fin
      ctx.beginPath();
      ctx.moveTo(cx + 45, cy + 20);
      ctx.lineTo(cx + 85, cy + 70);
      ctx.lineTo(cx + 45, cy + 60);
      ctx.stroke();

      // Thruster flame
      ctx.strokeStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(cx - 25, cy + 65);
      ctx.lineTo(cx, cy + 105);
      ctx.lineTo(cx + 25, cy + 65);
      ctx.stroke();
    },
  },
  {
    id: "crown",
    name: "Royal Crown",
    emoji: "👑",
    prompt: "a golden imperial crown with jewels",
    draw: (ctx, width, height) => {
      const cx = width / 2;
      const cy = height / 2;
      ctx.strokeStyle = "#eab308";
      ctx.lineWidth = 9;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Crown points
      ctx.beginPath();
      ctx.moveTo(cx - 80, cy - 30);
      ctx.lineTo(cx - 50, cy + 10);
      ctx.lineTo(cx, cy - 50);
      ctx.lineTo(cx + 50, cy + 10);
      ctx.lineTo(cx + 80, cy - 30);
      ctx.lineTo(cx + 70, cy + 50);
      ctx.lineTo(cx - 70, cy + 50);
      ctx.closePath();
      ctx.stroke();

      // Jewels
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(cx, cy - 50, 7, 0, Math.PI * 2);
      ctx.arc(cx - 80, cy - 30, 6, 0, Math.PI * 2);
      ctx.arc(cx + 80, cy - 30, 6, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: "sword",
    name: "Hero Sword",
    emoji: "⚔️",
    prompt: "a fantasy knight sword blade and hilt",
    draw: (ctx, width, height) => {
      const cx = width / 2;
      const cy = height / 2;
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Blade
      ctx.beginPath();
      ctx.moveTo(cx, cy - 120);
      ctx.lineTo(cx + 22, cy - 90);
      ctx.lineTo(cx + 18, cy + 20);
      ctx.lineTo(cx - 18, cy + 20);
      ctx.lineTo(cx - 22, cy - 90);
      ctx.closePath();
      ctx.stroke();

      // Center fuller line
      ctx.beginPath();
      ctx.moveTo(cx, cy - 95);
      ctx.lineTo(cx, cy + 10);
      ctx.stroke();

      // Guard
      ctx.strokeStyle = "#a855f7";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(cx - 55, cy + 25);
      ctx.lineTo(cx + 55, cy + 25);
      ctx.stroke();

      // Handle & Pommel
      ctx.strokeStyle = "#18181b";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(cx, cy + 28);
      ctx.lineTo(cx, cy + 75);
      ctx.stroke();

      ctx.fillStyle = "#eab308";
      ctx.beginPath();
      ctx.arc(cx, cy + 82, 8, 0, Math.PI * 2);
      ctx.fill();
    },
  },
];

export const STYLE_CHIPS = [
  "low poly",
  "stylized 3d",
  "photorealistic",
  "clay sculpture",
  "cyberpunk",
  "matte finish",
];
