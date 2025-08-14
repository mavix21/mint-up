'use client';
import { YStack } from '@my/ui';
import NFTTicket from 'app/entities/nft-ticket/nft-ticket';

export default function EventDescriptionPage() {
  return (
    <YStack>
      <main className="relative">
        <NFTTicket
          eventName="TO THE MOON"
          eventImageUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tothemoon.jfif-zeYcehghP0BZmqpePzre0PLh7EyBCE.jpeg"
          startDate={new Date('2024-02-24T14:00:00')}
          ticketType="VIP ACCESS"
          location="VIRTUAL EVENT"
          locationDetails="Online Platform"
          ticketHolderName="John Doe"
          ticketHolderUsername="@johndoe"
          organizerName="Lunar Events Co."
          organizerEmail="contact@lunarevents.io"
          tokenId="#TM240224001"
          style="normal" // Pass the selected style to the ticket
        />
      </main>
    </YStack>
  );
}
