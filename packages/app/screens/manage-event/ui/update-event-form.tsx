import { api } from '@my/backend/_generated/api';
import { Doc, Id } from '@my/backend/_generated/dataModel';
import { useMutation } from '@my/backend/react';
import { Form, Theme, ThemeName, YStack, useToastController } from '@my/ui';
import { useStore } from '@tanstack/react-form';
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
  event: Doc<'events'> & { imageFile: File };
  onSubmit?: (
    data: UpdateEventFormData & { startTimestamp: number; endTimestamp: number }
  ) => Promise<boolean>;
  onThemeChange?: (theme: string) => void;
  closeSheet?: () => void;
}

export function UpdateEventForm({ event, onThemeChange, closeSheet }: UpdateEventFormProps) {
  const toast = useToastController();
  const updateEvent = useMutation(api.events.updateEvent);
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const [showDescriptionSheet, setShowDescriptionSheet] = useState(false);
  const [showThemeSheet, setShowThemeSheet] = useState(false);

  const defaults = eventToFormDefaults(event);

  const form = useAppForm({
    defaultValues: {
      ...defaults,
      image: event.imageFile,
    },
    validators: {
      onChange: updateEventFormSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('value', value);
      const startTimestamp = new Date(`${value.startDate}T${value.startTime}`).getTime();
      const endTimestamp = new Date(`${value.endDate}T${value.endTime}`).getTime();
      console.log('valid', endTimestamp > startTimestamp);

      try {
        // Handle image upload only if it's a new File object
        let imageId: Id<'_storage'> | undefined;

        if (value.image !== event.imageFile) {
          // New image uploaded - upload to storage
          console.log('uploading new image');
          const { storageId } = await uploadFile(value.image);
          imageId = storageId;
        } else {
          // No new image uploaded - use existing image storage ID
          imageId = event.image;
        }

        await updateEvent({
          eventId: event._id,
          event: {
            name: value.name,
            description: value.description,
            startDate: startTimestamp,
            endDate: endTimestamp,
            category: value.category === '' ? 'hobbies & interests' : value.category,
            location: value.location,
            theme: value.theme,
            image: imageId,
          },
        });

        toast.show('Event updated');
        closeSheet?.();
        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message.slice(0, 100) : 'Unknown error';
        toast.show(message, { type: 'error', preset: 'error', message });
        return false;
      }
    },
  });

  const theme = useStore(form.store, (state) => state.values.theme);

  return (
    <Theme name={theme as ThemeName}>
      <form.AppForm>
        <Form
          onSubmit={() => {
            console.log('form', form.state);
            form.handleSubmit();
          }}
        >
          <YStack gap="$4">
            {/* Event Image (required for updates) */}
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
    </Theme>
  );
}
