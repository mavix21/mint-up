import { api } from '@my/backend/_generated/api';
import { Id } from '@my/backend/_generated/dataModel';
import { useMutation } from '@my/backend/react';
import { useToastController } from '@my/ui';
import { CreateEventFormData } from 'app/entities';
import { useState } from 'react';
import { YStack, Theme, ScrollView, ThemeName } from 'tamagui';

import { CreateEventForm } from './ui';

export function CreateEventScreen({ closeSheet }: { closeSheet: () => void }) {
  const toast = useToastController();
  const [theme, setTheme] = useState<string | undefined>(undefined);
  const [showThemeSheet, setShowThemeSheet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const createEvent = useMutation(api.events.createEvent);

  const handleSubmit = async (
    data: CreateEventFormData & { startTimestamp: number; endTimestamp: number }
  ) => {
    setIsLoading(true);
    console.log('Creating event with data:', data);
    try {
      await createEvent({
        name: data.name,
        description: data.description,
        startDate: data.startTimestamp,
        endDate: data.endTimestamp,
        category: data.category,
        location: data.location,
        visibility: 'public',
        image: 'kg2aphx307hkad4dxhpcrvjbkh7ma70s' as Id<'_storage'>,
        automatedFlows: [],
        hosts: [],
        theme,
      });
      toast.show('Event created successfully', {
        type: 'success',
        preset: 'done',
      });
      closeSheet();
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Theme name={theme as ThemeName}>
      <YStack flex={1} fullscreen backgroundColor="$color1">
        <YStack flex={1} py="$4">
          <ScrollView flex={1} width="100%">
            <YStack gap="$4" px="$4" py="$4" marginHorizontal="auto" width="100%" maxWidth={496}>
              <CreateEventForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
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
