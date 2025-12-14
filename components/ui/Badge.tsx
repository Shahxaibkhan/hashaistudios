type BadgeProps = {
  children: string;
  variant?: "default" | "soft";
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  const styles =
    variant === "soft"
      ? "bg-white/10 text-text-primary"
      : "bg-neon/20 text-neon";

  return (
    <span className={`rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-[0.4em] ${styles}`}>
      {children}
    </span>
  );
}
