import { api } from '@my/backend/_generated/api';
import { Id } from '@my/backend/_generated/dataModel';
import { fetchQuery } from '@my/backend/nextjs';
import { ShareableTicketViewScreen } from 'app/screens/shareable-ticket-view-screen/shareable-ticket-view-screen';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = await fetchQuery(api.registrations.getRegistrationTicketByIdMetadata, {
    registrationId: id as Id<'registrations'>,
  });

  const defaultImageUrl = process.env.NEXT_PUBLIC_APP_HERO_IMAGE!;

  // Create a dynamic image URL for the ticket
  const ticketImageUrl = ticket
    ? `${process.env.NEXT_PUBLIC_URL}/api/ticket-image/${id}`
    : defaultImageUrl;

  return {
    title: ticket?.ticketName ?? 'Ticket not found',
    description: ticket?.eventName ?? 'Event ticket',
    openGraph: {
      title: ticket?.ticketName ?? 'Ticket not found',
      description: ticket?.eventName ?? 'Event ticket',
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_URL}/registrations/${id}`,
      siteName: 'Mint Up',
      images: [
        {
          url: ticketImageUrl,
          width: 1200,
          height: 800,
          alt: ticket ? `${ticket.ticketName} - ${ticket.eventName}` : 'Event Ticket',
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: ticket?.ticketName ?? 'Ticket not found',
      description: ticket?.eventName ?? 'Event ticket',
      images: [ticketImageUrl],
      creator: '@mintup',
      site: '@mintup',
    },
    other: {
      'fc:frame': JSON.stringify({
        version: 'next',
        imageUrl: ticketImageUrl,
        button: {
          title: 'View my ticket',
          action: {
            type: 'launch_frame',
            name: 'Ticket View',
            url: process.env.NEXT_PUBLIC_URL,
          },
        },
      }),
    },
  };
}

export default async function ShareableTicketViewScreenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ShareableTicketViewScreen id={id} />;
}
