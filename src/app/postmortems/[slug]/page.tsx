import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPostmortems, getPostmortemBySlug } from "@/lib/incidents";
import markdownToHtml from "@/lib/markdownToHtml";
import { SITE_URL } from "@/lib/constants";
import {
  generateMetadata as baseGenerateMetadata,
  generateOgImageUrl,
} from "@/lib/metadata";
import Container from "@/app/_components/container";
import { Intro } from "@/app/_components/intro";
import { MarkdownBody } from "@/app/_components/markdown-body";
import DateFormatter from "@/app/_components/date-formatter";

export default async function PostmortemPage(props: Params) {
  const params = await props.params;
  const postmortem = getPostmortemBySlug(params.slug);

  if (!postmortem) {
    return notFound();
  }

  const content = await markdownToHtml(postmortem.content || "");

  return (
    <main>
      <Container>
        <Intro />
        <article className="max-w-3xl mx-auto mb-32">
          <Link
            href={postmortem.incident ? `/incidents/${postmortem.incident}` : "/"}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to incident
          </Link>
          <p className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-slate-500">
            Post-mortem
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
            {postmortem.title}
          </h1>
          <div className="text-sm text-neutral-500 dark:text-slate-400 mb-8">
            Published <DateFormatter dateString={postmortem.date} />
          </div>

          <MarkdownBody content={content} />
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
  const postmortem = getPostmortemBySlug(params.slug);

  if (!postmortem) {
    return notFound();
  }

  const ogImageUrl = generateOgImageUrl({ title: postmortem.title });

  return baseGenerateMetadata({
    title: postmortem.title,
    openGraph: {
      type: "article",
      url: `${SITE_URL}/postmortems/${postmortem.slug}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: postmortem.title }],
    },
    twitter: {
      images: [ogImageUrl],
    },
  });
}

export function generateStaticParams() {
  return getAllPostmortems().map((pm) => ({ slug: pm.slug }));
}
