import "./hungerai.css";
import { DM_Sans, Syne } from "next/font/google";
import type { Metadata, Viewport } from "next";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
});

export const metadata: Metadata = {
  title: "HungerAI - Order Food via WhatsApp",
  description: "Browse menus, build your cart, and order directly to WhatsApp",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HungerAI",
  },
};

export const viewport: Viewport = {
  themeColor: "#06C167",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function HungerAILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`hungerai ${dmSans.variable} ${syne.variable} fixed inset-0 z-50 overflow-auto`}>
      {children}
    </div>
  );
}
