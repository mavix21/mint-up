import { TimePicker, Chip } from '@my/ui';
import { Globe } from '@tamagui/lucide-icons';
import { useForm } from '@tanstack/react-form';
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
  YGroup,
  Form,
} from 'tamagui';

import {
  EventImage,
  LocationButton,
  EventLocationSheet,
  ThemeSelector,
  EventDescriptionSheet,
  DescriptionButton,
  EventTicketingSheet,
  TicketingButton,
  type EventLocation,
  type TicketType,
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
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [showTicketingSheet, setShowTicketingSheet] = useState(false);

  // Get client timezone
  const clientTimezone = getClientTimezone();

  // Calculate closest time and default end time
  const { startTime, endTime } = calculateDefaultEventTimes();
  const todayDateString = getTodayDateString();

  // form
  const form = useForm({
    defaultValues: {
      name: '',
    },
  });

  const handleSubmit = () => {
    // TODO: Collect form data and call onSubmit
    onSubmit?.({ location, description, tickets });
  };

  return (
    <Form onSubmit={handleSubmit}>
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
        <form.Field
          name="name"
          children={(field) => {
            return (
              <YStack>
                <VisuallyHidden>
                  <Label htmlFor={field.name}>Event Name</Label>
                </VisuallyHidden>
                <TextArea
                  id={field.name}
                  value={field.state.value}
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
            );
          }}
        />
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
        <YStack>
          <Label>Event Details</Label>
          <YGroup
            backgroundColor="$color3"
            orientation="vertical"
            separator={<Separator />}
            borderRadius="$4"
          >
            <YGroup.Item>
              <LocationButton location={location} onPress={() => setShowLocationSheet(true)} />
            </YGroup.Item>
            <YGroup.Item>
              <DescriptionButton
                description={description}
                onPress={() => setShowDescriptionSheet(true)}
              />
            </YGroup.Item>
          </YGroup>
        </YStack>
        {/* Ticketing */}
        <YStack>
          <Label>Ticketing</Label>
          <TicketingButton tickets={tickets} onPress={() => setShowTicketingSheet(true)} />
        </YStack>
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
        {/* Ticketing Sheet */}
        <EventTicketingSheet
          open={showTicketingSheet}
          onOpenChange={setShowTicketingSheet}
          tickets={tickets}
          onTicketsChange={setTickets}
        />
      </YStack>
    </Form>
  );
}
