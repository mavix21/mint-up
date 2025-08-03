'use client';

import { api } from '@my/backend/_generated/api';
import { Id } from '@my/backend/_generated/dataModel';
import { useMutation } from '@my/backend/react';
import { useToastController } from '@my/ui';
import { CreateEventFormData } from 'app/entities';
import { blobUrlToFile } from 'app/shared/lib/file';
import { useState } from 'react';
import { YStack, Theme, ScrollView, ThemeName } from 'tamagui';

import { CreateEventForm } from './ui';

async function uploadFile({ file, uploadUrl }: { file: File; uploadUrl: string }) {
  console.log('uploadFile', file);
  const res = await fetch(uploadUrl, {
    method: 'POST',
    headers: { 'Content-Type': file.type },
    body: file,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const response = await res.json();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const storageId = response.storageId as Id<'_storage'>;

  return storageId;
}

export function CreateEventScreen({ closeSheet }: { closeSheet: () => void }) {
  const toast = useToastController();
  const [theme, setTheme] = useState<string | undefined>(undefined);
  const [showThemeSheet, setShowThemeSheet] = useState(false);
  const createEvent = useMutation(api.events.createEvent);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  // const { data: session } = useSession();
  // const { data: hash, writeContract } = useWriteContract();
  // const {
  //   isLoading: isConfirming,
  //   isSuccess,
  //   data,
  // } = useWaitForTransactionReceipt({
  //   hash,
  // });

  // useEffect(() => {
  //   if (isSuccess) {
  //     for (const log of data.logs) {
  //       const events = parseEventLogs({
  //         abi,
  //         logs: [log],
  //       });
  //       for (const event of events) {
  //         if (event.eventName === 'TicketTypeRegistered') {
  //           const { tokenId } = event.args;
  //           console.log(tokenId);

  //           return;
  //         }
  //       }
  //     }
  //   }
  // }, [isSuccess, data]);

  const handleSubmit = async (
    data: CreateEventFormData & { startTimestamp: number; endTimestamp: number }
  ) => {
    console.log('Creating event with data:', data);
    try {
      const uploadUrl = await generateUploadUrl();
      console.log('uploadUrl', uploadUrl);
      const file = await blobUrlToFile(data.image, 'image.jpg');

      const storageId = await uploadFile({ file, uploadUrl });

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
          price:
            ticket.type === 'free'
              ? { type: 'free' }
              : { type: 'paid', amount: ticket.price, currency: ticket.currency },
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
