import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Origami | 2D to 3D AI Generator",
  description: "Turn 2D sketches and doodles into interactive 3D models with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
