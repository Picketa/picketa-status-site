import Container from "@/app/_components/container";
import { Intro } from "@/app/_components/intro";
import { StatusBanner } from "@/app/_components/status-banner";
import { SystemStatus } from "@/app/_components/system-status";
import { IncidentList } from "@/app/_components/incident-list";
import { SYSTEMS } from "@/lib/constants";
import {
  getActiveIncidents,
  getAllIncidents,
  getLatestUpdate,
  getOverallStatus,
  getSystemCurrentStatus,
  getSystemHistory,
} from "@/lib/incidents";

export default function Index() {
  const overall = getOverallStatus();
  const incidents = getAllIncidents();

  const active = getActiveIncidents().map((incident) => ({
    slug: incident.slug,
    title: incident.title,
    severity: incident.severity,
    status: incident.status,
    date: incident.date,
    message: getLatestUpdate(incident.content).message,
  }));

  const rows = SYSTEMS.map((system) => ({
    system,
    current: getSystemCurrentStatus(system),
    days: getSystemHistory(system),
  }));

  return (
    <main>
      <Container>
        <Intro />
        <div className="max-w-4xl mx-auto mb-32 space-y-12">
          <StatusBanner status={overall} active={active} />
          <SystemStatus rows={rows} />
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
              Past Incidents
            </h2>
            <IncidentList incidents={incidents} />
          </section>
        </div>
      </Container>
    </main>
  );
}
