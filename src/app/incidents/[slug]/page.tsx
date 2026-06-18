import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllIncidents, getIncidentBySlug } from "@/lib/incidents";
import markdownToHtml from "@/lib/markdownToHtml";
import { SITE_URL } from "@/lib/constants";
import {
  generateMetadata as baseGenerateMetadata,
  generateOgImageUrl,
} from "@/lib/metadata";
import Container from "@/app/_components/container";
import { Intro } from "@/app/_components/intro";
import { MarkdownBody } from "@/app/_components/markdown-body";
import { SeverityBadge } from "@/app/_components/severity-badge";
import DateFormatter from "@/app/_components/date-formatter";
import { STATUS_LABEL } from "@/lib/status-display";

export default async function IncidentPage(props: Params) {
  const params = await props.params;
  const incident = getIncidentBySlug(params.slug);

  if (!incident) {
    return notFound();
  }

  const content = await markdownToHtml(incident.content || "");

  return (
    <main>
      <Container>
        <Intro />
        <article className="max-w-3xl mx-auto mb-32">
          <Link
            href="/"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to status
          </Link>
          <div className="flex items-center gap-3 mt-6 mb-3">
            <SeverityBadge severity={incident.severity} />
            <span className="text-sm text-neutral-500 dark:text-slate-400">
              {STATUS_LABEL[incident.status]}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
            {incident.title}
          </h1>
          <div className="text-sm text-neutral-500 dark:text-slate-400 mb-2">
            Started <DateFormatter dateString={incident.date} />
            {incident.resolved && (
              <>
                {" · Resolved "}
                <DateFormatter dateString={incident.resolved} />
              </>
            )}
          </div>
          <div className="text-sm text-neutral-500 dark:text-slate-400 mb-8">
            Affected systems: {incident.affected.join(", ") || "—"}
          </div>

          <MarkdownBody content={content} />

          {incident.postmortem && (
            <div className="mt-10 border-t border-neutral-200 dark:border-slate-700 pt-6">
              <Link
                href={`/postmortems/${incident.postmortem}`}
                className="inline-flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Read the full post-mortem →
              </Link>
            </div>
          )}
        </article>
      </Container>
    </main>
  );
}

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const incident = getIncidentBySlug(params.slug);

  if (!incident) {
    return notFound();
  }

  const ogImageUrl = generateOgImageUrl({ title: incident.title });

  return baseGenerateMetadata({
    title: incident.title,
    description: `${incident.severity} · ${STATUS_LABEL[incident.status]} · ${incident.affected.join(", ")}`,
    openGraph: {
      type: "article",
      url: `${SITE_URL}/incidents/${incident.slug}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: incident.title }],
    },
    twitter: {
      images: [ogImageUrl],
    },
  });
}

export function generateStaticParams() {
  return getAllIncidents().map((incident) => ({ slug: incident.slug }));
}
