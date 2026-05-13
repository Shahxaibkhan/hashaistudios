"use client";

import { useEffect, useState } from "react";

export default function HungerAISplash() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar to 100% over 1.1s
    const start = performance.now();
    const duration = 1100;
    let raf: number;
    const step = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct < 100) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    const fadeTimer = setTimeout(() => setFading(true), 1200);
    const removeTimer = setTimeout(() => setVisible(false), 1700);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.5s ease",
        pointerEvents: fading ? "none" : "all",
      }}
    >
      {/* "Powered by" label */}
      <p
        style={{
          fontSize: "11px",
          color: "#94a3b8",
          letterSpacing: "0.12em",
          fontWeight: 600,
          textTransform: "uppercase",
          marginBottom: "14px",
        }}
      >
        Powered by
      </p>

      {/* Logo with subtle pulse */}
      <img
        src="/branding/hungerai-logo.png"
        alt="HungerAI"
        style={{
          height: "72px",
          width: "auto",
          animation: "hai-splash-pulse 1.2s ease-in-out infinite",
        }}
        draggable={false}
      />

      {/* Progress bar */}
      <div
        style={{
          marginTop: "32px",
          width: "120px",
          height: "3px",
          borderRadius: "99px",
          background: "#f1f5f9",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            borderRadius: "99px",
            background: "linear-gradient(90deg, #ff5722, #ff8a50)",
            transition: "width 0.05s linear",
          }}
        />
      </div>

      <style>{`
        @keyframes hai-splash-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(0.97); }
        }
      `}</style>
    </div>
  );
}

