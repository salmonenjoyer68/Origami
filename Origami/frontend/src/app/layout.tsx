import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Origami — Sketch it. Fold it into 3D.",
  description:
    "Turn 2D sketches and doodles into interactive, downloadable 3D models with AI. Draw, generate, and export GLB in seconds.",
  openGraph: {
    title: "Origami — Sketch it. Fold it into 3D.",
    description: "Turn 2D doodles into interactive 3D models with AI.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#070709",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${display.variable}`}>
      <body className="font-sans bg-studio-950 text-zinc-100 antialiased selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
