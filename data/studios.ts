export type StudioStatus = "live" | "in-progress" | "coming-soon";

export type Studio = {
  slug: string;
  name: string;
  shortDescription: string;
  industry: string;
  status: StudioStatus;
  heroCopy: string;
  problem: string;
  solution: string;
  features: string[];
  workflow: string[];
  customers: string[];
  ctaLabel?: string;
};

export const studios: Studio[] = [
  {
    slug: "clinicia",
    name: "ClinicAI",
    shortDescription: "Autonomous care coordinators for clinics and hospital networks.",
    industry: "Healthcare",
    status: "live",
    heroCopy: "AI assistant for clinics & healthcare automation",
    problem: "Clinics juggle intake, follow-ups, and triage with limited staff and fragmented tools.",
    solution:
      "ClinicAI connects EHR events, patient communication, and staff workflows to automate scheduling, reminders, and revenue-critical tasks.",
    features: [
      "Two-way patient messaging with medical context",
      "Automated intake and insurance verification",
      "AI-generated visit summaries",
      "Realtime routing to clinical teams"
    ],
    workflow: [
      "Connect to EHR and telephony stack",
      "Ingest operating procedures and compliance rules",
      "Deploy AI coordinators across intake, follow-up, billing",
      "Surface insights via dashboards and notifications"
    ],
    customers: ["Multi-site clinics", "Ambulatory care", "Telehealth networks"],
    ctaLabel: "Request Pilot"
  },
  {
    slug: "arenaai",
    name: "ArenaAI / PlayAI",
    shortDescription: "Vertical AI platform for arenas, courts, and sports facilities.",
    industry: "Sports & Recreation",
    status: "live",
    heroCopy: "Sports arena & court booking intelligence.",
    problem: "Arena operators lose revenue from manual booking, no-shows, and poor utilization.",
    solution:
      "ArenaAI automates bookings, membership intelligence, and dynamic pricing across every surface.",
    features: [
      "AI concierge for players and league managers",
      "Availability graph with demand forecasting",
      "Payments, memberships, and locker integrations",
      "Coach & staff assignment automation"
    ],
    workflow: [
      "Sync facility inventory and calendars",
      "Embed AI concierge across web, mobile, WhatsApp",
      "Automate utilization playbooks",
      "Monitor insights and adjust in real time"
    ],
    customers: ["Arena groups", "Municipal courts", "Training centers"],
    ctaLabel: "Book a Demo"
  },
  {
    slug: "hungerai",
    name: "HungerAI",
    shortDescription: "AI operating partner for restaurants & food groups.",
    industry: "Food & Hospitality",
    status: "in-progress",
    heroCopy: "AI for restaurants & food businesses",
    problem: "Operators juggle supply, staffing, and guest experience with little automation.",
    solution:
      "HungerAI orchestrates inventory, staff rosters, and guest messaging through a single AI layer.",
    features: [
      "Demand-aware prep plans",
      "AI-driven staff scheduling",
      "Guest messaging and loyalty",
      "Supply ordering autopilot"
    ],
    workflow: [
      "Connect POS, delivery, and staffing tools",
      "Train on playbooks and menu changes",
      "Automate daily standups and alerts",
      "Surface insights for operators"
    ],
    customers: ["Restaurant groups", "Ghost kitchens", "Hospitality chains"],
    ctaLabel: "Join Waitlist"
  },
  {
    slug: "estateai",
    name: "EstateAI",
    shortDescription: "AI for real estate lead handling and nurturing.",
    industry: "Real Estate",
    status: "coming-soon",
    heroCopy: "AI deal desk for brokerages and developers.",
    problem: "Leads are lost between marketing and agents with little personalization.",
    solution: "EstateAI triages, qualifies, and nurtures leads while syncing to CRMs and marketing clouds.",
    features: [
      "Instant lead response",
      "Multi-channel nurturing",
      "CRM sync and enrichment",
      "Pipeline prioritization"
    ],
    workflow: [
      "Connect marketing forms and CRM",
      "Define routing logic and compliance",
      "Deploy AI concierge across channels",
      "Measure conversion impact"
    ],
    customers: ["Enterprise brokerages", "Proptech teams", "Developers"],
    ctaLabel: "Preview EstateAI"
  }
];
