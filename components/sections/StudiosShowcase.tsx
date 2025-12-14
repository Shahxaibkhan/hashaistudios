import { studios } from "@/data/studios";
import { StudiosGrid } from "../studios/StudiosGrid";
import { SectionHeading } from "../ui/SectionHeading";

export function StudiosShowcase() {
  return (
    <section className="space-y-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Our Studios"
          title="Every vertical runs as its own intelligence studio."
          description="Pods obsess over one industry at a time. Shared infrastructure handles orchestration, compliance, and learning."
        />
        <div className="rounded-2xl border border-line bg-base-muted/60 p-6 text-sm text-text-muted md:max-w-sm">
          <p className="text-text-primary">Studio cadence</p>
          <p className="mt-2">Research sprints → blueprint → pilot → scaled rollouts.</p>
        </div>
      </div>
      <StudiosGrid studios={studios} />
    </section>
  );
}
