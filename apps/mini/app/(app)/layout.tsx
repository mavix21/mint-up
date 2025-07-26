import type { Metadata } from 'next';

import { getSession } from '@/auth';
import { Providers } from '@/providers';
import '@coinbase/onchainkit/styles.css';
import './app.css';

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL;
  const projectName = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME;

  return {
    title: projectName,
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
    openGraph: {
      title: projectName,
      description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
      url: URL,
      siteName: projectName,
      images: [
        {
          url: process.env.NEXT_PUBLIC_APP_HERO_IMAGE!,
          width: 1200,
          height: 630,
          alt: projectName,
        },
      ],
    },
    other: {
      'fc:frame': JSON.stringify({
        version: 'next',
        imageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE!,
        button: {
          title: `Launch ${projectName}`,
          action: {
            type: 'launch_frame',
            name: projectName,
            url: URL,
            splashImageUrl: process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE,
            splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR,
          },
        },
      }),
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
