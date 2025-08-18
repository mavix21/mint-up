import {
  TimePicker,
  Chip,
  Shake,
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
  Theme,
  useToastController,
} from '@my/ui';
import { Globe, Clock4, Clock2 } from '@tamagui/lucide-icons';
import { validateImageSize } from 'app/shared/lib/file';
import { useAppForm } from 'app/shared/lib/form';
import { FieldInfo } from 'app/shared/ui/FieldInfo';
import { useState } from 'react';

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
import { CreateEventFormData, createEventFormSchema, EventCategory } from '../../../entities';
import { getClientTimezone, calculateDefaultEventTimes } from '../../../utils';
import { createEventFormOpts } from '../model/shared-form';

export interface CreateEventFormProps {
  onSubmit: (
    data: CreateEventFormData & { startTimestamp: number; endTimestamp: number }
  ) => Promise<boolean>;
  theme?: string;
  onThemeChange?: (theme: string) => void;
  showThemeSheet?: boolean;
  onShowThemeSheetChange?: (show: boolean) => void;
}

function toTimestamp(date: string, time: string) {
  const localDateTimeString = `${date}T${time}`;
  const localDateTime = new Date(localDateTimeString);
  return localDateTime.getTime();
}

export function CreateEventForm({
  onSubmit,
  theme,
  onThemeChange,
  showThemeSheet = false,
  onShowThemeSheetChange,
}: CreateEventFormProps) {
  const tamaguiTokens = getTokens();
  const toast = useToastController();
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const [showDescriptionSheet, setShowDescriptionSheet] = useState(false);
  const [showTicketingSheet, setShowTicketingSheet] = useState(false);

  // Get client timezone
  const clientTimezone = getClientTimezone();

  // Calculate default event times and dates
  const { startTime, endTime, startDate, endDate } = calculateDefaultEventTimes();

  // form
  const form = useAppForm({
    defaultValues: {
      ...createEventFormOpts.defaultValues,
      startDate,
      startTime,
      endDate,
      endTime,
    },
    validators: {
      onChange: createEventFormSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('value', value);
      const startTimestamp = toTimestamp(value.startDate, value.startTime);
      const endTimestamp = toTimestamp(value.endDate, value.endTime);
      const image = value.image;
      if (!image) {
        toast.show('Please upload an image', {
          type: 'error',
          preset: 'error',
        });
        return;
      }

      const validationResult = validateImageSize(image);

      if (validationResult !== true) {
        toast.show('Image too large', {
          type: 'error',
          preset: 'error',
          message: validationResult,
        });
        return;
      }

      const result = await onSubmit({
        ...value,
        startTimestamp,
        endTimestamp,
        image,
      });

      if (result) {
        form.reset();
      }
    },
  });

  return (
    <form.AppForm>
      <Form
        onSubmit={() => {
          console.log('form state', { formState: form.state });
          form.handleSubmit();
        }}
      >
        <YStack gap="$4">
          {/* Event Image */}
          <form.Field
            name="image"
            children={(field) => {
              return (
                <EventImage
                  image={field.state.value}
                  onImageChange={(imageUrl) => {
                    field.handleChange(imageUrl);
                  }}
                />
              );
            }}
          />
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
                <Theme
                  name={
                    field.state.meta.isTouched &&
                    !field.state.meta.isValid &&
                    field.state.meta.errors.length > 0
                      ? 'red'
                      : null
                  }
                  forceClassName
                >
                  <Shake shakeKey={field.state.meta.errors[0]?.message}>
                    <YStack gap="$1">
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
                      <FieldInfo field={field} />
                    </YStack>
                  </Shake>
                </Theme>
              );
            }}
          />
          {/* Category Selector */}
          <form.Field
            name="category"
            children={(field) => {
              return (
                <>
                  <CategorySelector
                    value={field.state.value}
                    onValueChange={(value: string) => {
                      field.handleChange(value as EventCategory);
                    }}
                    fieldApi={field}
                  />
                </>
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
                    <XStack alignItems="center" gap="$2" flex={1}>
                      <Clock2 color="$color11" size={16} />
                      <Label htmlFor="start" fontWeight="500" color="$color11">
                        Start
                      </Label>
                    </XStack>
                    <XStack gap="$4" alignItems="center">
                      <form.AppField
                        name="startDate"
                        children={(field) => {
                          return (
                            <input
                              id="start"
                              type="date"
                              style={{ textAlign: 'center' }}
                              min={startDate}
                              value={field.state.value}
                              onChange={(e) => {
                                field.handleChange(e.target.value);
                              }}
                            />
                          );
                        }}
                      />
                      <form.AppField
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
                  <form.Subscribe selector={(state) => state.errors[0]?.['endTime']?.[0]}>
                    {(error) => (
                      <XStack
                        theme={error ? 'red' : null}
                        themeInverse={theme === 'red'}
                        flex={1}
                        alignItems="center"
                        gap="$2"
                        px="$true"
                        py="$1.5"
                        backgroundColor="$color3"
                      >
                        <XStack alignItems="center" gap="$2" flex={1}>
                          <Clock4 color="$color11" size={16} />
                          <Label htmlFor="end" fontWeight="500" color="$color11">
                            End
                          </Label>
                        </XStack>
                        <XStack gap="$4" alignItems="center">
                          <form.AppField
                            name="endDate"
                            children={(field) => {
                              return (
                                <input
                                  id="end"
                                  type="date"
                                  style={{ textAlign: 'center' }}
                                  min={startDate}
                                  value={field.state.value}
                                  onChange={(e) => {
                                    field.handleChange(e.target.value);
                                  }}
                                />
                              );
                            }}
                          />
                          <form.AppField
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
                    )}
                  </form.Subscribe>
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
                    <XStack alignItems="center" gap="$2" flex={1}>
                      <Globe color="$color11" size={16} />
                      <Label fontWeight="500" color="$color11">
                        Timezone
                      </Label>
                    </XStack>
                    <XStack gap="$4" alignItems="center">
                      <Chip size="$3" py="$2" borderRadius="$4">
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
          <form.Subscribe
            selector={(state) => {
              const tickets = state.values.tickets || [];
              return tickets.some(
                (_, index) => state.fieldMeta[`tickets[${index}].price`]?.errors?.length > 0
              );
            }}
          >
            {(error) => {
              return (
                <YStack gap="$2" theme={error ? 'red' : null}>
                  <SizableText>Ticketing</SizableText>
                  <form.Field
                    name="tickets"
                    mode="array"
                    children={(field) => {
                      return (
                        <TicketingButton
                          theme={error ? 'red' : undefined}
                          tickets={field.state.value}
                          onPress={() => setShowTicketingSheet(true)}
                        />
                      );
                    }}
                  />
                </YStack>
              );
            }}
          </form.Subscribe>
          {/* Submit Button */}
          <YStack borderColor="$color3">
            <Form.Trigger asChild>
              <form.SubmitButton
                size="$4"
                themeInverse
                fontWeight="600"
                width="100%"
                marginHorizontal="auto"
                label="Create Event"
              />
            </Form.Trigger>
          </YStack>
          {/* Location Sheet */}
          <EventLocationSheet
            form={form}
            open={showLocationSheet}
            onOpenChange={setShowLocationSheet}
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
          <EventTicketingSheet
            open={showTicketingSheet}
            onOpenChange={setShowTicketingSheet}
            form={form}
          />
        </YStack>
      </Form>
    </form.AppForm>
  );
}
