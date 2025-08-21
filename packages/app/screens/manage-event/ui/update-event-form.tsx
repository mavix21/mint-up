import { api } from '@my/backend/_generated/api';
import { Doc, Id } from '@my/backend/_generated/dataModel';
import { useMutation } from '@my/backend/react';
import { Form, YStack, useToastController } from '@my/ui';
import { EventCategory } from 'app/entities';
import { EventImage, ThemeSelector } from 'app/screens/create-event/ui';
import { uploadFile } from 'app/shared/lib/file';
import { useAppForm } from 'app/shared/lib/form';
import {
  CategorySelector,
  DateTimeFields,
  LocationAndDescriptionFields,
  NameField,
} from 'app/widgets/event-form';
import { useState } from 'react';

import { eventToFormDefaults } from '../model/mappers';
import { UpdateEventFormData, updateEventFormSchema } from '../model/update-event.schema';

export interface UpdateEventFormProps {
  event: Doc<'events'>;
  onSubmit: (
    data: UpdateEventFormData & { startTimestamp: number; endTimestamp: number }
  ) => Promise<boolean>;
  onThemeChange?: (theme: string) => void;
}

export function UpdateEventForm({ event, onSubmit, onThemeChange }: UpdateEventFormProps) {
  const toast = useToastController();
  const updateEvent = useMutation(api.events.updateEvent);
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const [showDescriptionSheet, setShowDescriptionSheet] = useState(false);
  const [showThemeSheet, setShowThemeSheet] = useState(false);

  const defaults = eventToFormDefaults(event);

  const form = useAppForm({
    defaultValues: {
      ...defaults,
    },
    validators: {
      onChange: updateEventFormSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('value', value);
      const startTimestamp = new Date(`${value.startDate}T${value.startTime}`).getTime();
      const endTimestamp = new Date(`${value.endDate}T${value.endTime}`).getTime();

      try {
        // Image is required when updating
        if (!value.image) {
          toast.show('Please upload an image', { type: 'error', preset: 'error' });
          return false;
        }
        const { storageId: imageId } = await uploadFile(value.image);

        await updateEvent({
          eventId: event._id,
          event: {
            name: value.name,
            description: value.description,
            startDate: startTimestamp,
            endDate: endTimestamp,
            category: value.category === '' ? 'other' : value.category,
            location: value.location,
            theme: value.theme,
            image: imageId,
          },
        });

        toast.show('Event updated');
        const valueWithImage = { ...(value as UpdateEventFormData), image: value.image as File };
        await onSubmit({ ...valueWithImage, startTimestamp, endTimestamp });
        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message.slice(0, 100) : 'Unknown error';
        toast.show(message, { type: 'error', preset: 'error', message });
        return false;
      }
    },
  });

  return (
    <form.AppForm>
      <Form
        onSubmit={() => {
          console.log('form', form.state);
          form.handleSubmit();
        }}
      >
        <YStack gap="$4">
          {/* Event Image (optional) */}
          <form.Field
            name="image"
            children={(field) => (
              <EventImage
                image={field.state.value}
                onImageChange={field.handleChange}
                autoLoadDefaultImage={false}
              />
            )}
          />

          {/* Theme Selector */}
          <form.Field
            name="theme"
            children={(field) => (
              <ThemeSelector
                theme={field.state.value}
                onThemeChange={(theme) => {
                  field.handleChange(theme);
                  onThemeChange?.(theme);
                }}
                showThemeSheet={showThemeSheet}
                onShowThemeSheetChange={setShowThemeSheet}
              />
            )}
          />

          {/* Event Name */}
          <NameField form={form} />

          {/* Category */}
          <form.Field
            name="category"
            children={(field) => (
              <CategorySelector
                value={field.state.value}
                onValueChange={(value: string) => field.handleChange(value as EventCategory)}
                fieldApi={field}
              />
            )}
          />

          {/* Date/Time */}
          <DateTimeFields form={form} />

          {/* Event Details: Location + Description */}
          <LocationAndDescriptionFields
            form={form}
            showLocationSheet={showLocationSheet}
            setShowLocationSheet={setShowLocationSheet}
            showDescriptionSheet={showDescriptionSheet}
            setShowDescriptionSheet={setShowDescriptionSheet}
          />

          {/* Submit */}
          <YStack>
            <Form.Trigger asChild>
              <form.SubmitButton
                size="$4"
                themeInverse
                fontWeight="600"
                width="100%"
                label="Save changes"
              />
            </Form.Trigger>
          </YStack>
        </YStack>
      </Form>
    </form.AppForm>
  );
}
