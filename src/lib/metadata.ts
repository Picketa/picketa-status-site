import { Metadata } from 'next';
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL,DEFAULT_OG_TITLE, DEFAULT_OG_DESCRIPTION, DEFAULT_OG_IMAGE_TITLE } from './constants';

export type MetadataOverrides = Partial<Metadata>;

export function generateOgImageUrl(params: { title?: string }): string {
  const ogImageUrl = new URL('/api/og', SITE_URL);
  if (params.title) {
    ogImageUrl.searchParams.set('title', params.title);
  }
  return ogImageUrl.toString();
}

export function generateMetadata(overrides: MetadataOverrides = {}): Metadata {
  const defaultMetadata: Metadata = {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    keywords: "Picketa, status, incidents, uptime, post-mortem, Fieldbook, LENS, agriculture, technology, picketa.com",
    openGraph: {
      title: DEFAULT_OG_TITLE,
      description: DEFAULT_OG_DESCRIPTION,
      url: SITE_URL,
      siteName: SITE_TITLE,
      images: [{
        url: generateOgImageUrl({ 
          title: DEFAULT_OG_IMAGE_TITLE,
        }),
        width: 1200,
        height: 630,
        alt: DEFAULT_OG_TITLE,
      }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: DEFAULT_OG_TITLE,
      description: DEFAULT_OG_DESCRIPTION,
      creator: '@picketasystems',
      images: [generateOgImageUrl({ 
        title: DEFAULT_OG_IMAGE_TITLE,
      })],
    },
  };

  return {
    ...defaultMetadata,
    ...overrides,
    openGraph: {
      ...defaultMetadata.openGraph,
      ...overrides.openGraph,
    },
    twitter: {
      ...defaultMetadata.twitter,
      ...overrides.twitter,
    },
  };
}
