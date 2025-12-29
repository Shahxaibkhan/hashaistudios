
import { notFound } from "next/navigation";
import { studios } from "@/data/studios";
import { Badge } from "@/components/ui/Badge";
import { useState } from 'react';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';


export function generateStaticParams() {
  return studios.map((studio) => ({ slug: studio.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const studio = studios.find((item) => item.slug === params.slug);
  if (!studio) {
    return {
      title: "Studio | HashAI Studios"
    };
  }
  return {
    description: studio.shortDescription
  };
}

export default function StudioDetailPage({ params }: { params: { slug: string } }) {
  const studio = studios.find((item) => item.slug === params.slug);
  if (!studio) {
    notFound();
  }

  return (
    <div className="space-y-16">
      <section className="space-y-6">
        <Badge>{studio.status === "live" ? "Live" : studio.status === "in-progress" ? "In Progress" : "Coming Soon"}</Badge>
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-text-muted">{studio.industry}</p>
          <h1 className="text-5xl font-semibold text-text-primary">{studio.name}</h1>
          <p className="text-xl text-text-muted">{studio.heroCopy}</p>
          <div className="flex flex-wrap gap-4 pt-6">
            <a
              href="/contact"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-canvas transition hover:bg-white"
            >
              {studio.ctaLabel ?? "Request Demo"}
            </a>
            <a
              href="mailto:hello@hashaistudios.com"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-text-primary transition hover:border-accent hover:text-accent"
            >
              Contact Team
            </a>
          </div>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl border border-white/5 p-6">
          <h2 className="text-2xl font-semibold text-text-primary">Problem</h2>
          <p className="mt-4 text-text-muted">{studio.problem}</p>
        </div>
        <div className="rounded-3xl border border-white/5 p-6">
          <h2 className="text-2xl font-semibold text-text-primary">Solution</h2>
          <p className="mt-4 text-text-muted">{studio.solution}</p>
        </div>
      </section>

      <section className="grid gap-10 md:grid-cols-2">
        <div>
          <h3 className="text-xl font-semibold text-text-primary">Key Features</h3>
          <ul className="mt-4 space-y-3 text-text-muted">
            {studio.features.map((feature) => (
              <li key={feature} className="flex gap-3">
                <span className="text-accent">▹</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-text-primary">How it works</h3>
          <ol className="mt-4 space-y-3 text-text-muted">
            {studio.workflow.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="text-accent">{String(index + 1).padStart(2, "0")}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="rounded-3xl border border-white/5 p-6">
        <h3 className="text-xl font-semibold text-text-primary">Target customers</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {studio.customers.map((customer) => (
            <span key={customer} className="rounded-full bg-white/5 px-4 py-2 text-sm text-text-muted">
              {customer}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
