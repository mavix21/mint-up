import { Doc } from '@my/backend/_generated/dataModel';
import { YStack, XStack, SizableText, Button, Separator, Sheet, ScrollView } from '@my/ui';
import { Calendar, MapPin, Users, Edit3, Share2, Globe, Tag, Eye } from '@tamagui/lucide-icons';
import { useState } from 'react';

import { UpdateEventForm } from './update-event-form';

interface OverviewTabProps {
  event: Doc<'events'>;
}

export const OverviewTab = ({ event }: OverviewTabProps) => {
  const [openEditSheet, setOpenEditSheet] = useState(false);
  return (
    <>
      <YStack gap="$4" padding="$4">
        {/* Event Details Section */}
        <YStack gap="$3">
          <YStack gap="$2">
            <SizableText size="$5" fontWeight="bold" color="$color12">
              Event Details
            </SizableText>
            <Separator />
          </YStack>

          <YStack gap="$3">
            {/* Date & Time */}
            <XStack
              gap="$2"
              backgroundColor="$color2"
              justifyContent="space-between"
              borderRadius="$4"
              paddingInline="$4"
              paddingBlock="$2"
            >
              <XStack alignItems="center" gap="$2">
                <Calendar size={18} color="$color11" />
                <SizableText size="$4" color="$color12">
                  Date & Time
                </SizableText>
              </XStack>
              <YStack gap="$1" paddingLeft="$6" alignItems="flex-end">
                <SizableText size="$3" color="$color11">
                  {new Date(event.startDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </SizableText>
                <SizableText size="$3" color="$color10">
                  {new Date(event.startDate).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                  {' - '}
                  {new Date(event.endDate).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </SizableText>
              </YStack>
            </XStack>

            {/* Location */}
            <XStack
              gap="$6"
              backgroundColor="$color2"
              borderRadius="$4"
              paddingInline="$4"
              paddingBlock="$2"
              justifyContent="space-between"
            >
              <XStack alignItems="center" gap="$2">
                {event.location.type === 'online' ? (
                  <Globe size={18} color="$color11" />
                ) : (
                  <MapPin size={18} color="$color11" />
                )}
                <SizableText size="$4" color="$color12">
                  Location
                </SizableText>
              </XStack>
              <YStack flex={1} gap="$1" alignItems="flex-end">
                <SizableText size="$3" fontWeight="600" color="$color11" numberOfLines={1}>
                  {event.location.type === 'online'
                    ? event.location.url
                    : event.location.address || 'Location TBD'}
                </SizableText>
                <SizableText size="$2" color="$color10">
                  {event.location.type === 'online' ? 'Online Event' : 'In-person Event'}
                </SizableText>
              </YStack>
            </XStack>

            {/* Attendees */}
            <XStack
              gap="$2"
              backgroundColor="$color2"
              borderRadius="$4"
              paddingInline="$4"
              paddingBlock="$3.5"
              justifyContent="space-between"
            >
              <XStack alignItems="center" gap="$2">
                <Users size={18} color="$color11" />
                <SizableText size="$4" color="$color12">
                  Attendees
                </SizableText>
              </XStack>
              <YStack gap="$1" alignItems="flex-end">
                <SizableText size="$3" color="$color11">
                  {event.registrationCount} registered
                </SizableText>
              </YStack>
            </XStack>

            {/* Category */}
            <XStack
              gap="$2"
              justifyContent="space-between"
              backgroundColor="$color2"
              borderRadius="$4"
              paddingInline="$4"
              paddingBlock="$3.5"
            >
              <XStack alignItems="center" gap="$2">
                <Tag size={18} color="$color11" />
                <SizableText size="$4" color="$color12">
                  Category
                </SizableText>
              </XStack>
              <YStack gap="$1" paddingLeft="$6">
                <SizableText size="$3" color="$color11" textTransform="capitalize">
                  {event.category.replace(/ & /g, ' & ')}
                </SizableText>
              </YStack>
            </XStack>
          </YStack>
        </YStack>

        <Separator />

        {/* Quick Actions */}
        <YStack gap="$3">
          <SizableText size="$5" fontWeight="bold" color="$color12">
            Quick Actions
          </SizableText>

          <XStack gap="$3" flexWrap="wrap">
            <Button
              themeInverse
              icon={<Edit3 size={16} />}
              flex={1}
              minWidth={120}
              onPress={() => setOpenEditSheet(true)}
            >
              <SizableText size="$3">Edit Event</SizableText>
            </Button>

            <Button icon={<Share2 size={16} />} flex={1} minWidth={120}>
              <SizableText size="$3">Share Event</SizableText>
            </Button>
          </XStack>
        </YStack>

        <Separator />

        {/* Event Status */}
        <YStack gap="$3">
          <YStack gap="$2">
            <SizableText size="$5" fontWeight="bold" color="$color12">
              Event Status
            </SizableText>
            <Separator />
          </YStack>

          <YStack gap="$4">
            <XStack
              backgroundColor="$color2"
              borderRadius="$4"
              paddingInline="$4"
              paddingBlock="$2"
              gap="$2"
              justifyContent="space-between"
            >
              <XStack alignItems="center" gap="$2">
                <Eye size={18} color="$color11" />
                <SizableText size="$4" color="$color12">
                  Visibility
                </SizableText>
              </XStack>
              <YStack gap="$1" paddingLeft="$6">
                <SizableText size="$3" color="$color11" textTransform="capitalize">
                  {event.visibility}
                </SizableText>
                <SizableText size="$2" color="$color10">
                  {event.visibility === 'public'
                    ? 'Anyone can find this event'
                    : 'Only invited users can see this event'}
                </SizableText>
              </YStack>
            </XStack>
          </YStack>
        </YStack>
      </YStack>
      <Sheet
        dismissOnSnapToBottom
        disableDrag
        modal
        open={openEditSheet}
        onOpenChange={setOpenEditSheet}
        snapPoints={[100]}
        snapPointsMode="percent"
        animation="medium"
      >
        <Sheet.Overlay
          animation="lazy"
          backgroundColor="$shadowColor"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame pt="$4" backgroundColor="$color1">
          <ScrollView flex={1}>
            <YStack gap="$4" width="100%" maxWidth={496} marginHorizontal="auto" pb="$4">
              <UpdateEventForm event={event} onSubmit={async () => true} onThemeChange={() => {}} />
            </YStack>
          </ScrollView>
        </Sheet.Frame>
      </Sheet>
    </>
  );
};
