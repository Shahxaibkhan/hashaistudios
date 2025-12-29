


"use client";
import QRCode from 'react-qr-code';
import { useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';

export default function BusinessCardPage() {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownloadPNG = async () => {
    if (cardRef.current) {
      const dataUrl = await htmlToImage.toPng(cardRef.current);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'business-card.png';
      link.click();
    }
  };

  const handleDownloadPDF = async () => {
    if (cardRef.current) {
      const dataUrl = await htmlToImage.toPng(cardRef.current);
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [600, 340] });
      pdf.addImage(dataUrl, 'PNG', 0, 0, 600, 340);
      pdf.save('business-card.pdf');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#03040b] p-8">
      <div className="mb-6 flex gap-4">
        <button onClick={handleDownloadPNG} className="bg-[#7DF9FF] text-[#03040b] font-bold px-4 py-2 rounded shadow hover:bg-white transition">Download as PNG</button>
        <button onClick={handleDownloadPDF} className="bg-[#7DF9FF] text-[#03040b] font-bold px-4 py-2 rounded shadow hover:bg-white transition">Download as PDF</button>
      </div>
      <div
        ref={cardRef}
        className="relative rounded-3xl shadow-2xl overflow-hidden border border-line"
        style={{
          width: 600,
          height: 340,
          background: 'radial-gradient(circle at 30% 50%, rgba(125, 249, 255, 0.13), #03040b 90%)',
        }}
      >
        {/* Logo and Name */}
        <div className="flex flex-row items-center gap-8 px-10 pt-10">
          <div className="flex flex-col items-start gap-2">
            <div className="tracking-[0.3em] font-bold text-4xl sm:text-5xl text-white" style={{ fontFamily: 'Space Grotesk, Sora, sans-serif' }}>
              HASH<span style={{ color: '#7DF9FF' }}>AI</span>
            </div>
            <div className="text-white text-base tracking-[0.5em] font-light" style={{ fontFamily: 'Space Grotesk, Sora, sans-serif' }}>
              STUDIOS
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, Sora, sans-serif' }}>SHAHZAIB KHAN</div>
              <div className="text-lg text-[#7DF9FF] font-semibold" style={{ fontFamily: 'Space Grotesk, Sora, sans-serif' }}>Co-founder & CEO</div>
            </div>
          </div>
          <div className="flex-1 flex justify-end items-start">
            <div className="bg-white p-2 rounded-lg shadow-lg -mt-6">
              <QRCode value="https://hashaistudios.com/founder" size={90} level="M" />
            </div>
          </div>
        </div>
        {/* Contact Info */}
        <div className="flex flex-row gap-12 px-10 pt-8 pb-10">
          <div className="flex flex-col gap-2 text-white text-base" style={{ fontFamily: 'Space Grotesk, Sora, sans-serif' }}>
            <div><span className="text-[#7DF9FF]">Email:</span> shahzaib.khan@hashaistudios.com</div>
            <div><span className="text-[#7DF9FF]">WhatsApp:</span> +92 3434 994409</div>
            <div><span className="text-[#7DF9FF]">Website:</span> hashaistudios.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
