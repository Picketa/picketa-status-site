import cn from "classnames";
import Link from "next/link";
import { Health, Severity } from "@/interfaces/incident";
import { BANNER_TITLE, HEALTH_DISPLAY, STATUS_LABEL } from "@/lib/status-display";
import DateFormatter from "./date-formatter";

export type ActiveIncidentBanner = {
  slug: string;
  title: string;
  severity: Severity;
  status: string;
  date: string;
  message: string;
};

type Props = {
  status: Health;
  active: ActiveIncidentBanner[];
};

// Solid header background per severity (red SEV1 / orange SEV2).
const SEVERITY_HEADER: Record<Severity, string> = {
  SEV1: "bg-red-600 border-red-600",
  SEV2: "bg-amber-500 border-amber-500",
};

export function StatusBanner({ status, active }: Props) {
  if (active.length === 0) {
    return (
      <div
        className={cn(
          "rounded-lg px-6 py-5 flex items-center gap-4 text-white shadow-md",
          HEALTH_DISPLAY[status].banner
        )}
      >
        <span className="relative flex h-3 w-3">
          <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
        </span>
        <h2 className="text-xl md:text-2xl font-semibold">
          {BANNER_TITLE[status]}
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {active.map((incident) => (
        <div
          key={incident.slug}
          className={cn(
            "rounded-lg overflow-hidden border shadow-md",
            SEVERITY_HEADER[incident.severity]
          )}
        >
          <Link
            href={`/incidents/${incident.slug}`}
            className={cn(
              "flex items-center gap-3 px-6 py-4 text-white hover:opacity-95 transition-opacity",
              SEVERITY_HEADER[incident.severity]
            )}
          >
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
            </span>
            <h2 className="text-lg md:text-xl font-semibold">
              {incident.title}
            </h2>
          </Link>
          <div className="bg-white dark:bg-slate-900 px-6 py-4">
            <p className="text-neutral-800 dark:text-slate-200">
              <span className="font-semibold">
                {STATUS_LABEL[incident.status as keyof typeof STATUS_LABEL] ??
                  incident.status}
              </span>
              {incident.message && (
                <span> — {incident.message}</span>
              )}
            </p>
            <p className="mt-1 text-sm text-neutral-500 dark:text-slate-400">
              <DateFormatter dateString={incident.date} />
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
