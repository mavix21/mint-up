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
      const file = data.image;

      if (!file) {
        toast.show('Please upload an image', {
          type: 'error',
          preset: 'error',
        });
        return;
      }

      const { storageId, url } = await uploadFile(file);

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
                  nft: {
                    image: storageId,
                    metadata: {
                      name: ticket.name,
                      description: ticket.description,
                      image: url,
                      attributes: [
                        {
                          trait_type: 'Type',
                          value: ticket.type,
                        },
                      ],
                    },
                  },
                  syncStatus: { status: 'pending' },
                },
        })),
      });

      //Add writeContract event
      // writeContract({
      //   address: MINTUP_CONTRACT_ADDRESS,
      //   abi,
      //   functionName: 'registerTicketType',
      //   args: [
      //     session?.user.currentWalletAddress as `0x${string}`,
      //     BigInt(0),
      //     BigInt(0),
      //     BigInt(0),
      //     `https://rose-gentle-toucan-395.mypinata.cloud/ipfs/ejemplo`,
      //   ],
      // });

      toast.show('Event created successfully', {
        type: 'success',
        preset: 'done',
      });
      closeSheet();
    } catch (error) {
      console.error('Error creating event:', error);
      toast.show('Error creating event', {
        type: 'error',
        preset: 'error',
      });
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
