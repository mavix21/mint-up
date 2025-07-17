import { useState } from 'react';
import {
  Button,
  Input,
  Label,
  Switch,
  Text,
  XStack,
  YStack,
  Card,
  Avatar,
  Sheet,
  Theme,
  ScrollView,
  YGroup,
  ThemeName,
  ToggleGroup,
  Stack,
} from 'tamagui';

export function CreateEventScreen() {
  const [theme, setTheme] = useState<string>('');
  const [showThemeSheet, setShowThemeSheet] = useState(false);
  const themeOptions = [
    { label: 'Default', value: '', color: '$color4' },
    { label: 'Pink', value: 'pink', color: '$pink10' },
    { label: 'Purple', value: 'purple', color: '$purple10' },
    { label: 'Blue', value: 'blue', color: '$blue10' },
    { label: 'Green', value: 'green', color: '$green10' },
    { label: 'Yellow', value: 'yellow', color: '$yellow10' },
    { label: 'Orange', value: 'orange', color: '$orange10' },
    { label: 'Red', value: 'red', color: '$red10' },
  ];
  return (
    <Theme name={theme as ThemeName}>
      <ScrollView flex={1} width="100%" backgroundColor="$color2">
        <YStack gap="$4" px="$4" py="$4" maxWidth={480} marginHorizontal="auto">
          {/* Event Image */}
          <Card
            elevate
            size="$6"
            width="100%"
            height={180}
            backgroundColor="$color3"
            borderRadius={24}
            overflow="hidden"
          >
            <YStack flex={1} alignItems="flex-end" justifyContent="flex-end" p="$3">
              <Avatar circular size="$4" backgroundColor="$color5">
                <Avatar.Fallback bc="$color4" />
              </Avatar>
            </YStack>
          </Card>
          {/* Theme Selector (at the top) */}
          <XStack space="$2">
            <Button
              iconAfter={<Text>⟳</Text>}
              size="$3"
              borderRadius={12}
              onPress={() => setShowThemeSheet(true)}
            >
              <XStack alignItems="center" gap="$2">
                <Text fontWeight="500">Theme</Text>
                <Stack
                  width={20}
                  height={20}
                  borderRadius={4}
                  backgroundColor={
                    (themeOptions.find((t) => t.value === theme)?.color as any) || '$color4'
                  }
                />
              </XStack>
            </Button>
            <Button size="$3" borderRadius={12}>
              <Text>⇅</Text>
            </Button>
          </XStack>
          {/* Event Name */}
          <YStack>
            <Label htmlFor="event-name" fontSize={18} fontWeight="700" mb="$2">
              Event Name
            </Label>
            <Input
              id="event-name"
              placeholder="Event Name"
              borderRadius={12}
              fontSize={18}
              py="$3"
              px="$4"
            />
          </YStack>
          {/* Start/End DateTime */}
          <YStack gap="$2">
            <XStack alignItems="center" gap="$2">
              <YStack flex={1}>
                <Label fontWeight="600">Start</Label>
                <Button size="$3" borderRadius={12} justifyContent="space-between">
                  <Text>Wed, Jul 16</Text>
                  <Text>11:09 PM</Text>
                </Button>
              </YStack>
              <YStack flex={1}>
                <Label fontWeight="600">End</Label>
                <Button size="$3" borderRadius={12} justifyContent="space-between">
                  <Text>Thu, Jul 17</Text>
                  <Text>12:09 AM</Text>
                </Button>
              </YStack>
            </XStack>
            <XStack alignItems="center" space="$2">
              <Button size="$2" borderRadius={12}>
                <Text>GMT-05:00</Text>
              </Button>
              <Text>Lima</Text>
            </XStack>
          </YStack>
          {/* Location */}
          <YStack>
            <Button size="$3" borderRadius={12} justifyContent="flex-start">
              <Text>Add Event Location</Text>
              <Text color="$color11" ml="$2">
                Offline location or virtual link
              </Text>
            </Button>
          </YStack>
          {/* Description */}
          <YStack>
            <Button size="$3" borderRadius={12} justifyContent="flex-start">
              <Text>Add Description</Text>
            </Button>
          </YStack>
          {/* Event Options */}
          <YStack space="$2">
            <Text fontWeight="700" mb="$2">
              Event Options
            </Text>
            <YGroup
              borderRadius="$6"
              $platform-native={{ borderCurve: 'circular' }}
              size="$4"
              backgroundColor="$color3"
            >
              <YGroup.Item>
                <XStack alignItems="center" justifyContent="space-between" px="$4" py="$3">
                  <XStack alignItems="center" space="$2">
                    <Text>🎟️</Text>
                    <Text>Tickets</Text>
                  </XStack>
                  <Text color="$color11">Free</Text>
                  <Button size="$2" backgroundColor="transparent">
                    <Text color="$color10">✎</Text>
                  </Button>
                </XStack>
              </YGroup.Item>
              <YGroup.Item>
                <XStack alignItems="center" justifyContent="space-between" px="$4" py="$3">
                  <XStack alignItems="center" space="$2">
                    <Text>👤</Text>
                    <Text>Require Approval</Text>
                  </XStack>
                  <Switch size="$2" />
                </XStack>
              </YGroup.Item>
              <YGroup.Item>
                <XStack alignItems="center" justifyContent="space-between" px="$4" py="$3">
                  <XStack alignItems="center" space="$2">
                    <Text>📏</Text>
                    <Text>Capacity</Text>
                  </XStack>
                  <Text color="$color11">Unlimited</Text>
                  <Button size="$2" backgroundColor="transparent">
                    <Text color="$color10">✎</Text>
                  </Button>
                </XStack>
              </YGroup.Item>
            </YGroup>
          </YStack>
          {/* Create Event Button */}
          <Button size="$5" themeInverse borderRadius={16} fontWeight="600">
            Create Event
          </Button>
        </YStack>
      </ScrollView>
      {/* Theme Selector Sheet (minimalistic, toggle group) */}
      <Sheet
        open={showThemeSheet}
        onOpenChange={setShowThemeSheet}
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
        <Sheet.Handle />
        <Sheet.Frame padding="$4" alignItems="center" backgroundColor="$color2">
          <ToggleGroup
            type="single"
            value={theme}
            onValueChange={(val) => {
              setTheme(val);
            }}
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
    </Theme>
  );
}
