import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./cinematic.css";
import "./worlds.css";
import "./motion.css";
import "./effects.css";
import { CinematicTransition } from "@/components/CinematicTransition";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ASCEND — The Order Awaits",
  description: "A competitive gaming order of deeds, trials, records and ascension.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}><body className="min-h-full flex flex-col"><CinematicTransition />{children}</body></html>;
}
