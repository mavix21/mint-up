import { Button, XStack, Stack, Sheet, ToggleGroup, Text as TamaguiText } from 'tamagui';

import { getThemeOptions, getThemeColor } from '../../../utils';

export interface ThemeSelectorProps {
  theme: string;
  onThemeChange: (theme: string) => void;
  showThemeSheet: boolean;
  onShowThemeSheetChange: (show: boolean) => void;
}

export function ThemeSelector({
  theme,
  onThemeChange,
  showThemeSheet,
  onShowThemeSheetChange,
}: ThemeSelectorProps) {
  const themeOptions = getThemeOptions();

  return (
    <>
      <XStack gap="$2">
        <Button onPress={() => onShowThemeSheetChange(true)} backgroundColor="$color3">
          <XStack alignItems="center" gap="$2">
            <TamaguiText fontWeight="500">Theme</TamaguiText>
            <Stack
              width={20}
              height={20}
              borderRadius={4}
              backgroundColor={getThemeColor(theme) as any}
            />
          </XStack>
        </Button>
      </XStack>

      {/* Theme Selector Sheet */}
      <Sheet
        open={showThemeSheet}
        onOpenChange={onShowThemeSheetChange}
        snapPoints={[15]}
        defaultPosition={0}
        modal
      >
        <Sheet.Overlay
          animation="lazy"
          backgroundColor="$shadowColor"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle backgroundColor="$color3" />
        <Sheet.Frame padding="$4" alignItems="center" backgroundColor="$color3">
          <ToggleGroup
            type="single"
            value={theme}
            onValueChange={onThemeChange}
            backgroundColor="$color3"
            orientation="horizontal"
            gap="$3"
          >
            {themeOptions.map((option) => (
              <ToggleGroup.Item
                key={option.value}
                value={option.value}
                unstyled
                width={32}
                height={32}
                borderRadius={16}
                backgroundColor={option.color as any}
                alignItems="center"
                justifyContent="center"
              >
                {/* Empty, just colored circle */}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
