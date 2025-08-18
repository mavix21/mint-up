'use client';

import { api } from '@my/backend/_generated/api';
import { useMutation } from '@my/backend/react';
import { useToastController } from '@my/ui';
import { CreateEventFormData } from 'app/entities';
import { uploadFile } from 'app/shared/lib/file';
import { useState } from 'react';
import { YStack, Theme, ScrollView, ThemeName } from 'tamagui';

import { CreateEventForm } from './ui';

export function CreateEventScreen({ closeSheet }: { closeSheet: () => void }) {
  const toast = useToastController();
  const [theme, setTheme] = useState<string | undefined>(undefined);
  const [showThemeSheet, setShowThemeSheet] = useState(false);
  const createEvent = useMutation(api.events.createEvent);

  const handleSubmit = async (
    data: CreateEventFormData & { startTimestamp: number; endTimestamp: number }
  ) => {
    console.log('Creating event with data:', data);
    try {
      const { storageId, url } = await uploadFile(data.image);

      await createEvent({
        event: {
          name: data.name,
          description: data.description,
          startDate: data.startTimestamp,
          endDate: data.endTimestamp,
          category: data.category === '' ? 'other' : data.category,
          location: data.location,
          visibility: 'public',
          image: storageId,
          automatedFlows: [],
          hosts: [],
          theme,
        },
        tickets: data.tickets.map((ticket) => ({
          name: ticket.name,
          description: ticket.description,
          totalSupply: ticket.supply,
          isApprovalRequired: false,
          ticketType:
            ticket.type === 'free'
              ? { type: 'offchain' }
              : {
                  type: 'onchain',
                  price: { amount: ticket.price, currency: ticket.currency },
                  imageUrl: url ?? process.env.NEXT_PUBLIC_APP_ICON!,
                },
        })),
      });

      toast.show('Event created successfully', {
        type: 'success',
        preset: 'done',
      });
      closeSheet();
      return true;
    } catch (error) {
      console.error('Error creating event:', error);
      const message = error instanceof Error ? error.message.slice(0, 100) : 'Unknown error';
      toast.show(message, {
        type: 'error',
        preset: 'error',
        message,
      });
      return false;
    }
  };

  return (
    <Theme name={theme as ThemeName}>
      <YStack flex={1} fullscreen backgroundColor="$color1">
        <YStack flex={1}>
          <ScrollView flex={1} width="100%">
            <YStack gap="$4" px="$4" py="$4" marginHorizontal="auto" width="100%" maxWidth={496}>
              <CreateEventForm
                onSubmit={handleSubmit}
                theme={theme}
                onThemeChange={setTheme}
                showThemeSheet={showThemeSheet}
                onShowThemeSheetChange={setShowThemeSheet}
              />
            </YStack>
          </ScrollView>
        </YStack>
      </YStack>
    </Theme>
  );
}
