import { Health, IncidentStatus, Severity } from "@/interfaces/incident";

// Health → presentation. Kept in one place so banner, bars, dots and labels
// all stay visually consistent.
export const HEALTH_DISPLAY: Record<
  Health,
  { label: string; bar: string; dot: string; banner: string; text: string }
> = {
  operational: {
    label: "Operational",
    bar: "bg-green-500",
    dot: "bg-green-500",
    banner: "bg-green-600",
    text: "text-green-600 dark:text-green-400",
  },
  sev2: {
    label: "Degraded performance",
    bar: "bg-amber-500",
    dot: "bg-amber-500",
    banner: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
  },
  sev1: {
    label: "Major outage",
    bar: "bg-red-600",
    dot: "bg-red-600",
    banner: "bg-red-600",
    text: "text-red-600 dark:text-red-400",
  },
  nodata: {
    label: "No data",
    bar: "bg-slate-200 dark:bg-slate-700",
    dot: "bg-slate-300 dark:bg-slate-600",
    banner: "bg-slate-500",
    text: "text-slate-500",
  },
};

export const SEVERITY_DISPLAY: Record<
  Severity,
  { label: string; classes: string }
> = {
  SEV1: {
    label: "SEV1",
    classes: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  },
  SEV2: {
    label: "SEV2",
    classes: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
};

export const STATUS_LABEL: Record<IncidentStatus, string> = {
  investigating: "Investigating",
  identified: "Identified",
  monitoring: "Monitoring",
  resolved: "Resolved",
};

export const BANNER_TITLE: Record<Health, string> = {
  operational: "All systems operational",
  sev2: "Some systems degraded",
  sev1: "Major outage in progress",
  nodata: "Status unknown",
};
