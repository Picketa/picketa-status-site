import cn from "classnames";
import { DayStatus, Health, System } from "@/interfaces/incident";
import { HEALTH_DISPLAY } from "@/lib/status-display";
import { UptimeBar } from "./uptime-bar";

type Row = {
  system: System;
  current: Health;
  days: DayStatus[];
  uptime: number | null;
};

type Props = {
  rows: Row[];
};

function uptimeLabel(uptime: number | null): string {
  if (uptime === null) return "—";
  return `${uptime.toFixed(2)}% uptime`;
}

export function SystemStatus({ rows }: Props) {
  return (
    <section className="rounded-lg border border-neutral-200 dark:border-slate-700 divide-y divide-neutral-200 dark:divide-slate-700">
      {rows.map(({ system, current, days, uptime }) => (
        <div key={system} className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-neutral-900 dark:text-white">
              {system}
            </span>
            <span className={cn("flex items-center gap-2 text-sm font-medium", HEALTH_DISPLAY[current].text)}>
              <span className={cn("h-2.5 w-2.5 rounded-full", HEALTH_DISPLAY[current].dot)} />
              {HEALTH_DISPLAY[current].label}
            </span>
          </div>
          <UptimeBar days={days} />
          <div className="flex justify-between items-center text-xs text-neutral-400 dark:text-slate-500 mt-2">
            <span>{days.length} days ago</span>
            <span className="font-medium text-neutral-500 dark:text-slate-400">
              {uptimeLabel(uptime)}
            </span>
            <span>Today</span>
          </div>
        </div>
      ))}
    </section>
  );
}
