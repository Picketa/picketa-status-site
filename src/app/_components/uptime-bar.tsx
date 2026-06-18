import cn from "classnames";
import Link from "next/link";
import { DayStatus } from "@/interfaces/incident";
import { HEALTH_DISPLAY } from "@/lib/status-display";

type Props = {
  days: DayStatus[];
};

export function UptimeBar({ days }: Props) {
  return (
    <div className="flex items-stretch gap-[2px] h-9 w-full">
      {days.map((day) => {
        const title = `${day.date} — ${HEALTH_DISPLAY[day.health].label}`;
        const className = cn(
          "flex-1 rounded-[1px] min-w-[2px] transition-opacity hover:opacity-70",
          HEALTH_DISPLAY[day.health].bar
        );

        return day.incident ? (
          <Link
            key={day.date}
            href={`/incidents/${day.incident}`}
            title={`${title} (view incident)`}
            aria-label={`${title} — view incident`}
            className={cn(className, "cursor-pointer")}
          />
        ) : (
          <div key={day.date} title={title} className={className} />
        );
      })}
    </div>
  );
}
