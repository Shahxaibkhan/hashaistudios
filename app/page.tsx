import { Hero } from "@/components/sections/Hero";
import { Industries } from "@/components/sections/Industries";
import { StudiosShowcase } from "@/components/sections/StudiosShowcase";
import { WhatWeBuild } from "@/components/sections/WhatWeBuild";
import { WhyHashAI } from "@/components/sections/WhyHashAI";
import { EnableAISection } from "@/components/sections/EnableAISection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhatWeBuild />
      <EnableAISection />
      <StudiosShowcase />
      <WhyHashAI />
      <Industries />
    </>
  );
}
