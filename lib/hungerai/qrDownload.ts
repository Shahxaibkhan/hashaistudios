"use client";

/**
 * Rasterizes an on-page QR <svg> (as rendered by react-qr-code) into a PNG
 * and triggers a browser download. Standard SVG→canvas→PNG plumbing, no
 * dependency needed — react-qr-code only renders vector SVG, and printing
 * that directly (see the "Print" button) already covers high-quality
 * physical signage; this covers the "share one code over WhatsApp" case.
 */
export function downloadSvgAsPng(svg: SVGSVGElement, filename: string, scale = 6): void {
  const xml = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    const viewBox = svg.viewBox?.baseVal;
    const size = (viewBox && viewBox.width) || svg.width.baseVal.value || 256;
    const canvas = document.createElement("canvas");
    canvas.width = size * scale;
    canvas.height = size * scale;

    const ctx = canvas.getContext("2d");
    URL.revokeObjectURL(svgUrl);
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const pngUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.download = filename;
      a.href = pngUrl;
      a.click();
      setTimeout(() => URL.revokeObjectURL(pngUrl), 1000);
    }, "image/png");
  };
  img.src = svgUrl;
}
