import Link from "next/link";
import { parseISO, format } from "date-fns";
import { Incident } from "@/interfaces/incident";
import { STATUS_LABEL } from "@/lib/status-display";
import { SeverityBadge } from "./severity-badge";

type Props = {
  incidents: Incident[];
};

function groupByDay(incidents: Incident[]) {
  const groups = new Map<string, Incident[]>();
  for (const incident of incidents) {
    const key = format(parseISO(incident.date), "LLLL d, yyyy");
    const list = groups.get(key) ?? [];
    list.push(incident);
    groups.set(key, list);
  }
  return Array.from(groups.entries());
}

export function IncidentList({ incidents }: Props) {
  if (incidents.length === 0) {
    return (
      <p className="text-neutral-500 dark:text-slate-400">
        No incidents reported.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {groupByDay(incidents).map(([day, dayIncidents]) => (
        <div key={day}>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-slate-700 pb-2 mb-4">
            {day}
          </h3>
          <ul className="space-y-5">
            {dayIncidents.map((incident) => (
              <li key={incident.slug}>
                <div className="flex flex-wrap items-center gap-3">
                  <SeverityBadge severity={incident.severity} />
                  <Link
                    href={`/incidents/${incident.slug}`}
                    className="font-medium text-neutral-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {incident.title}
                  </Link>
                  <span className="text-sm text-neutral-500 dark:text-slate-400">
                    {STATUS_LABEL[incident.status]}
                  </span>
                </div>
                <div className="mt-1 text-sm text-neutral-500 dark:text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>Affected: {incident.affected.join(", ") || "—"}</span>
                  {incident.postmortem && (
                    <Link
                      href={`/postmortems/${incident.postmortem}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Read post-mortem →
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
