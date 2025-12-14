# HashAI Studios – Architecture Overview

## Tech Stack
- Next.js 14 (App Router)
- React 18 with Server Components by default
- TypeScript + ESLint + Tailwind CSS

## Directory Structure
```
app/
  layout.tsx        // Root layout, shared header/footer, font setup
  page.tsx          // Home
  about/
  contact/
  studios/
    page.tsx        // Studios list
    [slug]/page.tsx // Studio detail
components/
  layout/           // Header, footer
  navigation/       // Main navigation
  sections/         // Page sections (Hero, Industries, etc.)
  studios/          // StudiosGrid
  ui/               // Primitives (Badge, SectionHeading)
data/
  studios.ts        // Strongly typed studio definitions
docs/
  architecture.md
lib/
  utils.ts          // Classname helper
```

## Component Principles
- Compose sections from smaller primitives (e.g., `SectionHeading`, `Badge`).
- Keep data-driven sections (Studios) powered by shared `studios` array.
- Ensure all CTAs and content remain configurable for future studios.

## Styling & Interaction
- Tailwind for utility-first styling plus custom theme tokens in `tailwind.config.ts`.
- Dark, premium palette with gradients and glassmorphism.
- Subtle animations via Tailwind transitions; hero uses layered radial backgrounds.

## Data & Scalability
- `Studio` type centralizes schema for every studio.
- Adding a new studio requires only updating `data/studios.ts`.
- Dynamic route uses `generateStaticParams` for static generation + metadata derived from data file.
