type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.6em] text-text-muted">
        <span className="h-px w-8 bg-neon/40" />
        {eyebrow}
      </div>
      <h2 className="text-3xl font-semibold leading-tight text-text-primary md:text-[2.75rem]">{title}</h2>
      {description && <p className="text-base text-text-muted">{description}</p>}
    </div>
  );
}
