import Image from "next/image";
import Link from "next/link";

export default function FounderPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#03040b] px-4 py-12">
      <div className="w-full max-w-xl rounded-3xl shadow-2xl border border-line bg-gradient-to-br from-[#03040b] via-[#0a1a22] to-[#03040b] p-8">
        <div className="flex flex-col items-center gap-4 relative">
          {/* QR Code at top right */}
          <div className="absolute top-0 right-0 mt-2 mr-2 z-10">
            {/* <QRCode value="https://hashaistudios.com/founder" size={96} /> */}
          </div>
          {/* Photo */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#7DF9FF] shadow-lg mb-2 mt-8">
            <Image src="/founder.png" alt="Profile picture" width={128} height={128} className="object-cover w-full h-full" />
          </div>
          {/* Name & Title */}
          <h1 className="text-3xl font-bold text-white tracking-wide" style={{ fontFamily: 'Space Grotesk, Sora, sans-serif' }}>Shahzaib Khan</h1>
          <h2 className="text-lg font-semibold text-[#7DF9FF] mb-2 text-center" style={{ fontFamily: 'Space Grotesk, Sora, sans-serif' }}>Co-founder & CEO, HashAI Studios</h2>
          {/* About Me */}
          <p className="text-base text-text-muted text-center max-w-md mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
            As a co-founder, I am passionate about building vertical AI solutions that transform industries. I thrive on leading teams, architecting products, and driving innovation in healthcare, sports, hospitality, and real estate. My focus is on premium automation, domain-trained copilots, and delivering next-gen product experiences.
          </p>

          {/* Experience */}
          <div className="w-full flex flex-col items-center mb-4">
            <h3 className="text-lg font-semibold text-[#7DF9FF] mb-2">Experience</h3>
            <ul className="text-white text-base list-disc list-inside space-y-1 text-center">
              <li>Co-founder & CEO, HashAI Studios</li>
              <li>10+ years in AI product development</li>
              <li>Founder, multiple AI startups</li>
            </ul>
          </div>

          {/* Education */}
          <div className="w-full flex flex-col items-center mb-4">
            <h3 className="text-lg font-semibold text-[#7DF9FF] mb-2">Education</h3>
            <ul className="text-white text-base list-disc list-inside space-y-1 text-center">
              <li>BS Computer Engineering, FAST-NUCES</li>
              <li>MS Software Project Management, FAST-NUCES</li>
            </ul>
          </div>
          {/* Contact */}
          <div className="flex flex-col gap-2 items-center mb-4 w-full">
            <a
              href="mailto:shahzaib.khan@hashaistudios.com"
              className="hover:underline break-all text-sm sm:text-base w-full text-center font-semibold"
              style={{ color: '#7DF9FF', textShadow: '0 0 2px #000', zIndex: 10 }}
            >
              shahzaib.khan@hashaistudios.com
            </a>
            <a
              href="https://wa.me/923434994409"
              className="hover:underline break-all text-sm sm:text-base w-full text-center font-semibold"
              style={{ color: '#7DF9FF', textShadow: '0 0 2px #000', zIndex: 10 }}
            >
              WhatsApp: +92 3434 994409
            </a>
          </div>
          {/* QR Code moved to top right */}
          {/* Link to company */}
          <Link href="/" className="mt-2 inline-block rounded-full bg-[#7DF9FF] px-6 py-2 font-bold text-[#03040b] shadow hover:bg-white transition break-words w-full max-w-xs text-center text-sm sm:text-base">Visit HashAI Studios</Link>
        </div>
      </div>
    </div>
  );
}
