import type { Metadata } from "next";
import { Sora, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "HashAI Studios | AI Agency & Product Studio",
  description: "Vertical AI studios designing premium automation for healthcare, sports, hospitality, and more."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-base">
      <body className={`${sora.variable} ${space.variable} bg-base text-text-primary`}>
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-mesh-glow opacity-60 blur-3xl" />
          <div className="pointer-events-none absolute -left-32 top-40 h-96 w-96 rounded-full bg-[rgba(125,249,255,0.18)] blur-[140px]" />
          <div className="pointer-events-none absolute -right-20 top-10 h-[28rem] w-[28rem] rounded-full bg-[rgba(139,139,255,0.16)] blur-[180px]" />
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 py-16">
              <div className="container flex flex-col gap-20">{children}</div>
            </main>
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
