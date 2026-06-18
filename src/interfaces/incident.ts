import { SYSTEMS } from "@/lib/constants";

export type System = (typeof SYSTEMS)[number];

export type Severity = "SEV1" | "SEV2";

export type IncidentStatus =
  | "investigating"
  | "identified"
  | "monitoring"
  | "resolved";

export type Incident = {
  slug: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  affected: System[];
  date: string; // ISO start time
  resolved?: string; // ISO resolved time; presence => resolved
  postmortem?: string; // slug into _postmortems/
  content: string; // markdown timeline body
};

export type Postmortem = {
  slug: string;
  title: string;
  date: string;
  incident?: string; // back-reference to an incident slug
  content: string;
};

// Health levels, ordered from best to worst. Worst always wins when combining.
export type Health = "operational" | "sev2" | "sev1" | "nodata";

export type DayStatus = {
  date: string; // ISO date (YYYY-MM-DD)
  health: Health;
  incident?: string; // slug of the incident that colored this day, if any
};
