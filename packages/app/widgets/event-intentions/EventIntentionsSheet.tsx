import { api } from '@my/backend/_generated/api';
import type { Id } from '@my/backend/_generated/dataModel';
import { useMutation } from '@my/backend/react';
import { Sheet, YStack, H4, Button, Paragraph, useToastController } from '@my/ui';
import { Sparkles } from '@tamagui/lucide-icons';
import React, { useState } from 'react';

import { EventIntentionsSelector } from './EventIntentionsSelector';
import type { EventIntention } from '../../entities/event-intentions/constants';

export interface EventIntentionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: Id<'events'>;
  onComplete?: () => void;
}

/**
 * EventIntentionsSheet - A sheet component that prompts users to select their event intentions
 * after registration. This is presented as an optional but valuable step to unlock social features.
 *
 * Follows the product requirement: "After a user registers for an event, present them with an
 * optional, single-question prompt"
 */
export function EventIntentionsSheet({
  open,
  onOpenChange,
  eventId,
  onComplete,
}: EventIntentionsSheetProps) {
  const toast = useToastController();
  const [selectedIntentions, setSelectedIntentions] = useState<EventIntention[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateIntentions = useMutation(api.registrations.updateRegistrationIntentions);

  const handleSubmit = async () => {
    if (selectedIntentions.length === 0) {
      toast.show('Please select at least one intention', {
        type: 'error',
        preset: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await updateIntentions({
        eventId,
        eventIntentions: selectedIntentions,
      });

      toast.show('Your intentions have been saved!', {
        type: 'success',
        preset: 'done',
      });

      onOpenChange(false);
      onComplete?.();
    } catch (error) {
      console.error('Failed to update intentions:', error);
      toast.show('Failed to save intentions. Please try again.', {
        type: 'error',
        preset: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onOpenChange(false);
    onComplete?.();
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset state when sheet closes
      setSelectedIntentions([]);
    }
    onOpenChange(isOpen);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={handleOpenChange}
      modal
      dismissOnSnapToBottom
      snapPoints={[85]}
    >
      <Sheet.Overlay />
      <Sheet.Frame padding="$4" gap="$4">
        <Sheet.Handle />

        <YStack gap="$4" flex={1}>
          {/* Header */}
          <YStack gap="$2" alignItems="center">
            <Sparkles size={32} color="$blue10" />
            <H4 textAlign="center">What are your goals for this event?</H4>
            <Paragraph textAlign="center" color="$color10" fontSize="$4">
              Share your intentions to unlock the attendee directory and discover other attendees
              with similar goals
            </Paragraph>
          </YStack>

          {/* Intentions Selector */}
          <YStack gap="$3" flex={1}>
            <EventIntentionsSelector
              value={selectedIntentions}
              onValueChange={setSelectedIntentions}
            >
              <EventIntentionsSelector.List>
                <EventIntentionsSelector.DefaultOptions />
              </EventIntentionsSelector.List>
              <EventIntentionsSelector.HelperText>
                Select all that apply
              </EventIntentionsSelector.HelperText>
            </EventIntentionsSelector>
          </YStack>

          {/* Action Buttons */}
          <YStack gap="$2" width="100%">
            <Button
              onPress={handleSubmit}
              disabled={selectedIntentions.length === 0 || isSubmitting}
              opacity={selectedIntentions.length === 0 ? 0.5 : 1}
              size="$4"
              themeInverse
            >
              <Button.Text fontWeight="600">
                {isSubmitting ? 'Saving...' : 'Save & Unlock Directory'}
              </Button.Text>
            </Button>

            <Button onPress={handleSkip} disabled={isSubmitting} chromeless size="$3">
              <Button.Text color="$color10">Maybe later</Button.Text>
            </Button>
          </YStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
