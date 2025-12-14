import { studios } from "@/data/studios";
import { StudiosGrid } from "@/components/studios/StudiosGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = {
  title: "Studios | HashAI Studios",
  description: "Explore vertical AI studios across healthcare, sports, hospitality, and more."
};

export default function StudiosPage() {
  return (
    <div className="space-y-12">
      <SectionHeading
        eyebrow="Studios"
        title="Dedicated, vertical AI studios engineered for each industry."
        description="From ClinicAI to EstateAI, every studio shares telemetry, governance, and playbooks while staying deeply specialized."
      />
      <StudiosGrid studios={studios} />
    </div>
  );
}
