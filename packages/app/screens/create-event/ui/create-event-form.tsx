import { YStack, SizableText, Form, useToastController } from '@my/ui';
import { CreateEventFormData, createEventFormSchema, EventCategory } from 'app/entities';
import { dateUtils, timeUtils } from 'app/shared/lib/date';
import { validateImageSize } from 'app/shared/lib/file';
import { useAppForm } from 'app/shared/lib/form';
import {
  CategorySelector,
  DateTimeFields,
  LocationAndDescriptionFields,
  NameField,
} from 'app/widgets/event-form';
import { useState } from 'react';

import { EventImage, ThemeSelector, EventTicketingSheet, TicketingButton } from './index';
import { createEventFormOpts } from '../model/shared-form';

export interface CreateEventFormProps {
  onSubmit: (
    data: CreateEventFormData & { startTimestamp: number; endTimestamp: number }
  ) => Promise<boolean>;
  onThemeChange?: (theme: string) => void;
}

export function CreateEventForm({ onSubmit, onThemeChange }: CreateEventFormProps) {
  const toast = useToastController();
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const [showDescriptionSheet, setShowDescriptionSheet] = useState(false);
  const [showTicketingSheet, setShowTicketingSheet] = useState(false);
  const [showThemeSheet, setShowThemeSheet] = useState(false);

  // Calculate default event times and dates
  const { startTime, endTime, startDate, endDate } = timeUtils.calculateDefaultEventTimes();

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
      const startTimestamp = dateUtils.toTimestamp(value.startDate)(value.startTime);
      const endTimestamp = dateUtils.toTimestamp(value.endDate)(value.endTime);
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
          <form.Field
            name="theme"
            children={(field) => {
              return (
                <ThemeSelector
                  theme={field.state.value}
                  onThemeChange={(theme) => {
                    field.handleChange(theme);
                    onThemeChange?.(theme);
                  }}
                  showThemeSheet={showThemeSheet}
                  onShowThemeSheetChange={setShowThemeSheet}
                />
              );
            }}
          />
          {/* Event Name */}
          <NameField form={form} />
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
          <DateTimeFields minStartDate={startDate} form={form} />
          <YStack gap="$2">
            <SizableText>Event Details</SizableText>
            <LocationAndDescriptionFields
              showLocationSheet={showLocationSheet}
              setShowLocationSheet={setShowLocationSheet}
              showDescriptionSheet={showDescriptionSheet}
              setShowDescriptionSheet={setShowDescriptionSheet}
              form={form}
            />
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
