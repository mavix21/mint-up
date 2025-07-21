import { useState } from 'react';
import { YStack, Theme, ScrollView, ThemeName } from 'tamagui';

import { CreateEventForm, ThemeSelector } from './ui';

export function CreateEventScreen() {
  const [theme, setTheme] = useState<string>('');
  const [showThemeSheet, setShowThemeSheet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // TODO: Implement event creation logic
      console.log('Creating event with data:', data);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
              <ThemeSelector
                theme={theme}
                onThemeChange={setTheme}
                showThemeSheet={showThemeSheet}
                onShowThemeSheetChange={setShowThemeSheet}
              />
              <CreateEventForm onSubmit={handleSubmit} isLoading={isLoading} />
            </YStack>
          </ScrollView>
        </YStack>
      </YStack>
    </Theme>
  );
}
