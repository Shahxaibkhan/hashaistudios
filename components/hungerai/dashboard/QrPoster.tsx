"use client";

import { useRef } from "react";
import QRCode from "react-qr-code";
import { downloadSvgAsPng } from "@/lib/hungerai/qrDownload";

interface QrPosterProps {
  url: string;
  restaurantName: string;
  headline: string;
  subline: string;
  filename: string;
  large?: boolean;
}

export default function QrPoster({ url, restaurantName, headline, subline, filename, large }: QrPosterProps) {
  const qrWrapRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const svg = qrWrapRef.current?.querySelector("svg");
    if (svg) downloadSvgAsPng(svg as SVGSVGElement, filename);
  };

  return (
    <div className={`hai-qr-poster ${large ? "hai-qr-poster-lg" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/branding/hungerai-logo.png" alt="" className="hai-qr-poster-logo" draggable={false} />
      <p className="hai-qr-poster-restaurant">{restaurantName}</p>
      <h2 className="hai-qr-poster-headline">{headline}</h2>
      <div className="hai-qr-poster-qr-wrap" ref={qrWrapRef}>
        <QRCode value={url} size={large ? 240 : 160} style={{ width: "100%", height: "auto", maxWidth: large ? 240 : 160 }} />
      </div>
      <p className="hai-qr-poster-subline">{subline}</p>
      <p className="hai-qr-poster-footer">Powered by HungerAI</p>
      <button
        type="button"
        onClick={handleDownload}
        className="hai-btn hai-btn-secondary no-print mt-3 w-full"
      >
        Download PNG
      </button>
    </div>
  );
}
