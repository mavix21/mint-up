import { api } from '@my/backend/_generated/api';
import { Id } from '@my/backend/_generated/dataModel';
import { fetchQuery } from '@my/backend/nextjs';
import { ShareableEventDescriptionScreenScreen } from 'app/screens/shareable-event-description-screen/shareable-event-description-screen-screen';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = await fetchQuery(api.events.getEventMetadata, {
    eventId: id as Id<'events'>,
  });

  const defaultImageUrl = process.env.NEXT_PUBLIC_APP_HERO_IMAGE!;

  return {
    title: event?.name ?? 'Event not found',
    description: event?.description ?? 'Join this amazing event!',
    openGraph: {
      title: event?.name ?? 'Event not found',
      description: event?.description ?? 'Join this amazing event!',
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_URL}/events/${id}`,
      siteName: 'Mint Up',
      images: event?.imageUrl
        ? [
            {
              url: event.imageUrl,
              width: 1200,
              height: 630,
              alt: event.name ?? 'Event image',
            },
          ]
        : [
            {
              url: defaultImageUrl,
              width: 1200,
              height: 630,
              alt: 'Default event image',
            },
          ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: event?.name ?? 'Event not found',
      description: event?.description ?? 'Join this amazing event!',
      images: event?.imageUrl ? [event.imageUrl] : [defaultImageUrl],
      creator: '@mintup',
      site: '@mintup',
    },
    other: {
      'fc:frame': JSON.stringify({
        version: 'next',
        imageUrl: event?.imageUrl ?? defaultImageUrl,
        button: {
          title: 'Mint your ticket',
          action: {
            type: 'launch_frame',
            name: 'Event Invite',
            url: process.env.NEXT_PUBLIC_URL,
          },
        },
      }),
    },
  };
}

export default async function ShareableEventDescriptionScreenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ShareableEventDescriptionScreenScreen id={id} />;
}
