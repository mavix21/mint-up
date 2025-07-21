import { TimePicker, Chip } from '@my/ui';
import { Globe } from '@tamagui/lucide-icons';
import { useState } from 'react';
import {
  Button,
  Label,
  XStack,
  YStack,
  TextArea,
  Group,
  Separator,
  SizableText,
  getTokens,
  VisuallyHidden,
} from 'tamagui';

import {
  EventImage,
  EventOptions,
  LocationButton,
  EventLocationSheet,
  ThemeSelector,
  EventDescriptionSheet,
  DescriptionButton,
  type EventLocation,
} from './index';
import { getClientTimezone, calculateDefaultEventTimes, getTodayDateString } from '../../../utils';

export interface CreateEventFormProps {
  onSubmit?: (data: any) => void;
  isLoading?: boolean;
  theme?: string;
  onThemeChange?: (theme: string) => void;
  showThemeSheet?: boolean;
  onShowThemeSheetChange?: (show: boolean) => void;
}

export function CreateEventForm({
  onSubmit,
  isLoading,
  theme = '',
  onThemeChange,
  showThemeSheet = false,
  onShowThemeSheetChange,
}: CreateEventFormProps) {
  const tamaguiTokens = getTokens();
  const [location, setLocation] = useState<EventLocation | undefined>();
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const [description, setDescription] = useState<string>('');
  const [showDescriptionSheet, setShowDescriptionSheet] = useState(false);

  // Get client timezone
  const clientTimezone = getClientTimezone();

  // Calculate closest time and default end time
  const { startTime, endTime } = calculateDefaultEventTimes();
  const todayDateString = getTodayDateString();

  const handleSubmit = () => {
    // TODO: Collect form data and call onSubmit
    onSubmit?.({ location, description });
  };

  return (
    <YStack gap="$4">
      {/* Event Image */}
      <EventImage />

      {/* Theme Selector */}
      <ThemeSelector
        theme={theme}
        onThemeChange={onThemeChange || (() => {})}
        showThemeSheet={showThemeSheet}
        onShowThemeSheetChange={onShowThemeSheetChange || (() => {})}
      />

      {/* Event Name */}
      <YStack>
        <VisuallyHidden>
          <Label htmlFor="event-name">Event Name</Label>
        </VisuallyHidden>
        <TextArea
          id="event-name"
          placeholder="Event Name"
          flexGrow={1}
          unstyled
          fontWeight="700"
          placeholderTextColor="$color7"
          style={
            {
              fontSize: tamaguiTokens.size.$3.val,
              fieldSizing: 'content',
            } as any
          }
        />
      </YStack>

      {/* Start/End DateTime */}
      <YStack gap="$2">
        <Group orientation="vertical" size="$2" separator={<Separator />} borderRadius="$4">
          <Group.Item>
            <XStack
              flex={1}
              alignItems="center"
              gap="$2"
              px="$true"
              py="$1.5"
              borderRadius="$true"
              backgroundColor="$color3"
            >
              <Label htmlFor="start" flex={1} fontWeight="500">
                Start
              </Label>
              <XStack gap="$4" alignItems="center">
                <input
                  id="start"
                  type="date"
                  style={{ textAlign: 'center' }}
                  min={todayDateString}
                  defaultValue={todayDateString}
                />
                <TimePicker
                  value={startTime}
                  onChangeText={(value) => {
                    console.log(value);
                  }}
                />
              </XStack>
            </XStack>
          </Group.Item>
          <Group.Item>
            <XStack
              flex={1}
              alignItems="center"
              gap="$2"
              px="$true"
              py="$1.5"
              borderRadius="$true"
              backgroundColor="$color3"
            >
              <Label htmlFor="end" flex={1} fontWeight="500">
                End
              </Label>
              <XStack gap="$4" alignItems="center">
                <input
                  id="end"
                  type="date"
                  style={{ textAlign: 'center' }}
                  min={todayDateString}
                  defaultValue={todayDateString}
                />
                <TimePicker
                  value={endTime}
                  onChangeText={(value) => {
                    console.log(value);
                  }}
                />
              </XStack>
            </XStack>
          </Group.Item>
          <Group.Item>
            <XStack
              flex={1}
              alignItems="center"
              gap="$2"
              px="$true"
              py="$1.5"
              borderRadius="$true"
              backgroundColor="$color3"
            >
              <Label flex={1} fontWeight="500">
                Timezone
              </Label>
              <XStack gap="$4" alignItems="center">
                <Chip
                  size="$4"
                  py="$2"
                  borderRadius="$4"
                  backgroundColor="$color5"
                  hoverStyle={{ backgroundColor: '$color6' }}
                  pressStyle={{ backgroundColor: '$color7' }}
                  focusStyle={{ backgroundColor: '$color8' }}
                >
                  <Chip.Icon>
                    <Globe size={16} />
                  </Chip.Icon>
                  <Chip.Text>
                    <SizableText mr="$2">GMT{clientTimezone.offset}</SizableText>
                    <SizableText>{clientTimezone.city}</SizableText>
                  </Chip.Text>
                </Chip>
              </XStack>
            </XStack>
          </Group.Item>
        </Group>
      </YStack>

      {/* Location */}
      <YStack>
        <LocationButton location={location} onPress={() => setShowLocationSheet(true)} />
      </YStack>

      {/* Description */}
      <YStack>
        <DescriptionButton
          description={description}
          onPress={() => setShowDescriptionSheet(true)}
        />
      </YStack>

      {/* Event Options */}
      <EventOptions />

      {/* Submit Button */}
      <YStack py="$4" borderColor="$color3">
        <Button
          size="$4"
          themeInverse
          fontWeight="600"
          width="100%"
          marginHorizontal="auto"
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Event'}
        </Button>
      </YStack>

      {/* Location Sheet */}
      <EventLocationSheet
        open={showLocationSheet}
        onOpenChange={setShowLocationSheet}
        location={location}
        onLocationChange={setLocation}
      />

      {/* Description Sheet */}
      <EventDescriptionSheet
        open={showDescriptionSheet}
        onOpenChange={setShowDescriptionSheet}
        description={description}
        onDescriptionChange={setDescription}
      />
    </YStack>
  );
}
