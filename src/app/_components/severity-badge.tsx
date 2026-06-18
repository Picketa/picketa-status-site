import cn from "classnames";
import { Severity } from "@/interfaces/incident";
import { SEVERITY_DISPLAY } from "@/lib/status-display";

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold",
        SEVERITY_DISPLAY[severity].classes
      )}
    >
      {SEVERITY_DISPLAY[severity].label}
    </span>
  );
}
