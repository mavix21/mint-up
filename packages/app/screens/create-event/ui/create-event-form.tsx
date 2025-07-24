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
  CategorySelector,
} from './index';
import type { EventLocation, TicketType } from '../../../entities';
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
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const [showDescriptionSheet, setShowDescriptionSheet] = useState(false);
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
      category: '',
      startDate: todayDateString,
      startTime,
      endDate: todayDateString,
      endTime,
      location: {
        type: 'in-person' as const,
        address: '',
        instructions: '',
      } as EventLocation,
      description: '',
      tickets: [] as TicketType[],
    },
  });

  const handleSubmit = () => {
    // TODO: Collect form data and call onSubmit
    onSubmit?.({
      name: form.state.values.name,
      location: form.state.values.location,
      description: form.state.values.description,
      tickets: form.state.values.tickets,
      category: form.state.values.category,
      startDate: form.state.values.startDate,
      startTime: form.state.values.startTime,
      endDate: form.state.values.endDate,
      endTime: form.state.values.endTime,
    });
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
                  onChangeText={field.handleChange}
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
        {/* Category Selector */}
        <form.Field
          name="category"
          children={(field) => {
            return (
              <CategorySelector
                value={field.state.value}
                onValueChange={(value) => {
                  field.handleChange(value);
                }}
              />
            );
          }}
        />
        {/* Start/End DateTime */}
        <YStack gap="$2">
          <SizableText>Date & Time</SizableText>
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
                    <form.Field
                      name="startDate"
                      children={(field) => {
                        return (
                          <input
                            id="start"
                            type="date"
                            style={{ textAlign: 'center' }}
                            min={todayDateString}
                            defaultValue={todayDateString}
                          />
                        );
                      }}
                    />
                    <form.Field
                      name="startTime"
                      children={(field) => {
                        return (
                          <TimePicker
                            value={field.state.value}
                            onChangeText={(value) => {
                              field.handleChange(value);
                            }}
                          />
                        );
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
                    <form.Field
                      name="endDate"
                      children={(field) => {
                        return (
                          <input
                            id="end"
                            type="date"
                            style={{ textAlign: 'center' }}
                            min={todayDateString}
                            defaultValue={todayDateString}
                          />
                        );
                      }}
                    />
                    <form.Field
                      name="endTime"
                      children={(field) => {
                        return (
                          <TimePicker
                            value={field.state.value}
                            onChangeText={(value) => {
                              field.handleChange(value);
                            }}
                          />
                        );
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
                      hoverStyle={{
                        backgroundColor: '$color6',
                        borderColor: '$color7',
                        borderWidth: 1,
                      }}
                      pressStyle={{ backgroundColor: '$color6' }}
                      focusStyle={{ backgroundColor: '$color6' }}
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
        </YStack>
        <YStack gap="$2">
          <SizableText>Event Details</SizableText>
          <YGroup
            backgroundColor="$color3"
            orientation="vertical"
            separator={<Separator />}
            borderRadius="$4"
          >
            <YGroup.Item>
              <form.Field
                name="location"
                children={(field) => {
                  return (
                    <LocationButton
                      location={field.state.value}
                      onPress={() => setShowLocationSheet(true)}
                    />
                  );
                }}
              />
            </YGroup.Item>
            <YGroup.Item>
              <form.Field
                name="description"
                children={(field) => {
                  return (
                    <DescriptionButton
                      description={field.state.value}
                      onPress={() => setShowDescriptionSheet(true)}
                    />
                  );
                }}
              />
            </YGroup.Item>
          </YGroup>
        </YStack>
        {/* Ticketing */}
        <YStack gap="$2">
          <SizableText>Ticketing</SizableText>
          <form.Field
            name="tickets"
            mode="array"
            children={(field) => {
              return (
                <TicketingButton
                  tickets={field.state.value}
                  onPress={() => setShowTicketingSheet(true)}
                />
              );
            }}
          />
        </YStack>
        {/* Submit Button */}
        <YStack py="$4" borderColor="$color3">
          <Form.Trigger asChild>
            <Button
              size="$4"
              themeInverse
              fontWeight="600"
              width="100%"
              marginHorizontal="auto"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Event'}
            </Button>
          </Form.Trigger>
        </YStack>
        {/* Location Sheet */}
        <form.Field
          name="location"
          children={(field) => {
            return (
              <EventLocationSheet
                open={showLocationSheet}
                onOpenChange={setShowLocationSheet}
                location={field.state.value}
                onLocationChange={(location) => {
                  field.handleChange(location);
                }}
              />
            );
          }}
        />
        {/* Description Sheet */}
        <form.Field
          name="description"
          children={(field) => {
            return (
              <EventDescriptionSheet
                open={showDescriptionSheet}
                onOpenChange={setShowDescriptionSheet}
                description={field.state.value}
                onDescriptionChange={(description) => {
                  field.handleChange(description);
                }}
              />
            );
          }}
        />
        {/* Ticketing Sheet */}
        <form.Field
          name="tickets"
          mode="array"
          children={(field) => {
            return (
              <EventTicketingSheet
                open={showTicketingSheet}
                onOpenChange={setShowTicketingSheet}
                tickets={field.state.value}
                onTicketsChange={(tickets) => {
                  field.handleChange(tickets);
                }}
              />
            );
          }}
        />
      </YStack>
    </Form>
  );
}
