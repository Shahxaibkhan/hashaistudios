import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  variant?: "default" | "hero";
};

const titleSizes = {
  default: "text-[1.4rem]",
  hero: "text-[2.4rem] leading-none md:text-[3rem]"
};

const subtitleSizes = {
  default: "text-[0.55rem]",
  hero: "text-xs md:text-sm"
};

export function BrandLogo({ className, variant = "default" }: BrandLogoProps) {
  return (
    <div
      className={cn(
        "inline-flex flex-col leading-none text-text-primary",
        "[text-transform:uppercase]",
        className
      )}
      aria-label="HashAI Studios"
    >
      <span className={cn("font-semibold tracking-[0.35em]", titleSizes[variant])}>
        Hash<span className="text-neon">AI</span>
      </span>
      <span
        className={cn(
          "mt-1 flex items-center gap-2 tracking-[0.8em] text-text-muted",
          subtitleSizes[variant]
        )}
      >
        <span className="h-px w-6 bg-neon/50" />
        Studios
      </span>
    </div>
  );
}
