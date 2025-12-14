import { Hero } from "@/components/sections/Hero";
import { Industries } from "@/components/sections/Industries";
import { StudiosShowcase } from "@/components/sections/StudiosShowcase";
import { WhatWeBuild } from "@/components/sections/WhatWeBuild";
import { WhyHashAI } from "@/components/sections/WhyHashAI";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhatWeBuild />
      <StudiosShowcase />
      <WhyHashAI />
      <Industries />
    </>
  );
}
