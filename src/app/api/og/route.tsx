import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { DEFAULT_OG_TITLE } from '@/lib/constants';
import SmallLogo from './small-logo';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get('title') || DEFAULT_OG_TITLE;

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, white 0%, #6bd07a 100%)',
            padding: '60px',
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <SmallLogo width={140} height={140} />
              <div style={{
                marginLeft: '0.2em',
                fontSize: '60px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2em'
              }}>
                <strong style={{ color: '#1E1E1E' }}>Picketa</strong>
                <strong style={{ color: '#666666' }}>Status</strong>
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              margin: 'auto',
              flex: 1,
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <div style={{
                fontSize: '48px',
                color: '#1E1E1E',
                lineHeight: 1.2,
                textAlign: 'center',
              }}>
                {title}
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: await fetch(
              new URL('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZFhjQ.ttf')
            ).then((res) => res.arrayBuffer()),
            weight: 700,
            style: 'normal',
          },
        ],
      },
    );
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    console.log(errorMessage);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
