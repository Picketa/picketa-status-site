import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import {
  DayStatus,
  Health,
  Incident,
  Postmortem,
  Severity,
  System,
} from "@/interfaces/incident";
import { HISTORY_DAYS, SYSTEMS } from "@/lib/constants";

const incidentsDirectory = join(process.cwd(), "_incidents");
const postmortemsDirectory = join(process.cwd(), "_postmortems");

function readDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
}

export function getIncidentBySlug(slug: string): Incident {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(incidentsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    title: data.title,
    severity: data.severity,
    status: data.status,
    affected: data.affected ?? [],
    date: data.date,
    resolved: data.resolved,
    postmortem: data.postmortem,
    content,
  };
}

export function getAllIncidents(): Incident[] {
  return readDir(incidentsDirectory)
    .map((slug) => getIncidentBySlug(slug))
    // most recent first
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getActiveIncidents(): Incident[] {
  return getAllIncidents().filter((i) => !i.resolved);
}

/**
 * The most recent update from an incident body: the first heading (e.g.
 * "Monitoring — 09:40 ADT") and the paragraph that follows it. Updates are
 * written newest-first, so the first block is the latest.
 */
export function getLatestUpdate(content: string): {
  heading?: string;
  message: string;
} {
  let heading: string | undefined;
  const para: string[] = [];
  for (const line of content.split("\n")) {
    const t = line.trim();
    if (t.startsWith("#")) {
      if (para.length) break;
      heading = t.replace(/^#+\s*/, "");
      continue;
    }
    if (t === "") {
      if (para.length) break;
    } else {
      para.push(t);
    }
  }
  return { heading, message: para.join(" ") };
}

export function getPostmortemBySlug(slug: string): Postmortem {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postmortemsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    title: data.title,
    date: data.date,
    incident: data.incident,
    content,
  };
}

export function getAllPostmortems(): Postmortem[] {
  return readDir(postmortemsDirectory).map((slug) => getPostmortemBySlug(slug));
}

// --- Derived status logic (single source of truth) ---

const SEVERITY_HEALTH: Record<Severity, Health> = {
  SEV1: "sev1",
  SEV2: "sev2",
};

const HEALTH_RANK: Record<Health, number> = {
  nodata: 0,
  operational: 1,
  sev2: 2,
  sev1: 3,
};

function worse(a: Health, b: Health): Health {
  return HEALTH_RANK[a] >= HEALTH_RANK[b] ? a : b;
}

/** Overall banner health: worst severity across currently-active incidents. */
export function getOverallStatus(): Health {
  const active = getActiveIncidents();
  if (active.length === 0) return "operational";
  return active.reduce<Health>(
    (acc, i) => worse(acc, SEVERITY_HEALTH[i.severity]),
    "operational"
  );
}

/** Current health of a single system, from active incidents only. */
export function getSystemCurrentStatus(system: System): Health {
  const active = getActiveIncidents().filter((i) =>
    i.affected.includes(system)
  );
  if (active.length === 0) return "operational";
  return active.reduce<Health>(
    (acc, i) => worse(acc, SEVERITY_HEALTH[i.severity]),
    "operational"
  );
}

function toDayKey(d: Date): string {
  // Local YYYY-MM-DD
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * HISTORY_DAYS daily cells (oldest first, last = today) for a system.
 * A day is colored by the worst severity of any incident that (a) affects the
 * system and (b) whose [start, resolved||now] window overlaps that day.
 */
export function getSystemHistory(system: System): DayStatus[] {
  const incidents = getAllIncidents().filter((i) =>
    i.affected.includes(system)
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const windows = incidents.map((i) => {
    const start = new Date(i.date);
    start.setHours(0, 0, 0, 0);
    const end = i.resolved ? new Date(i.resolved) : today;
    end.setHours(0, 0, 0, 0);
    return { start, end, health: SEVERITY_HEALTH[i.severity], slug: i.slug };
  });

  const days: DayStatus[] = [];
  for (let offset = HISTORY_DAYS - 1; offset >= 0; offset--) {
    const day = new Date(today);
    day.setDate(today.getDate() - offset);
    day.setHours(0, 0, 0, 0);

    let health: Health = "operational";
    let incident: string | undefined;
    for (const w of windows) {
      // strictly-worse keeps the most-recent incident on ties (incidents are
      // sorted newest-first, so it is seen first)
      if (day >= w.start && day <= w.end && worse(health, w.health) !== health) {
        health = w.health;
        incident = w.slug;
      }
    }
    days.push({ date: toDayKey(day), health, incident });
  }
  return days;
}

export function getAllSystemHistories(): { system: System; days: DayStatus[] }[] {
  return SYSTEMS.map((system) => ({
    system,
    days: getSystemHistory(system),
  }));
}
