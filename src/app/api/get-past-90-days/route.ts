import { NextResponse } from "next/server";
import { Health } from "@/interfaces/incident";
import { SYSTEMS } from "@/lib/constants";
import {
  getAllIncidents,
  getLatestUpdate,
  getOverallStatus,
  getSystemCurrentStatus,
  getSystemHistory,
  getSystemUptime,
} from "@/lib/incidents";

// Static JSON, rebuilt with the site (incidents are markdown read at build time).
export const dynamic = "force-static";

// Health → stable public-facing values an external client can branch on.
const PUBLIC_STATUS: Record<Health, { status: string; indicator: string }> = {
  operational: { status: "operational", indicator: "green" },
  sev2: { status: "degraded", indicator: "orange" },
  sev1: { status: "major_outage", indicator: "red" },
  nodata: { status: "unknown", indicator: "gray" },
};

const DESCRIPTION: Record<Health, string> = {
  operational: "All systems operational",
  sev2: "Some systems degraded",
  sev1: "Major outage in progress",
  nodata: "Status unknown",
};

export async function GET() {
  const overall = getOverallStatus();

  const systems = SYSTEMS.map((name) => {
    const days = getSystemHistory(name);
    return {
      name,
      ...PUBLIC_STATUS[getSystemCurrentStatus(name)],
      uptime: getSystemUptime(name),
      history: days.map((d) => ({
        date: d.date,
        status: PUBLIC_STATUS[d.health].status,
        incident: d.incident ?? null,
      })),
    };
  });

  // Incidents: latest status only — no timeline body, no post-mortem reference.
  const incidents = getAllIncidents().map((i) => ({
    slug: i.slug,
    title: i.title,
    severity: i.severity,
    status: i.status,
    affected: i.affected,
    startedAt: i.date,
    resolvedAt: i.resolved ?? null,
    latestUpdate: getLatestUpdate(i.content).message || null,
  }));

  return NextResponse.json(
    {
      status: PUBLIC_STATUS[overall].status,
      indicator: PUBLIC_STATUS[overall].indicator,
      description: DESCRIPTION[overall],
      degraded: overall !== "operational",
      windowDays: systems[0]?.history.length ?? 0,
      systems,
      incidents,
    },
    { headers: { "Access-Control-Allow-Origin": "*" } }
  );
}
