import {
  Button,
  H4,
  Image,
  Paragraph,
  ScrollView,
  Stack,
  Text,
  ThemeName,
  XStack,
  YStack,
} from '@my/ui';
import React, { createContext, useContext } from 'react';

import type { AttendeeDirectoryData, AttendeeProfile } from '../../entities/attendee-directory';
import { ATTENDEE_DIRECTORY_MESSAGES } from '../../entities/attendee-directory';
import { EVENT_INTENTION_METADATA } from '../../entities/event-intentions';

interface AttendeeDirectoryContextValue {
  data: AttendeeDirectoryData | null;
  isLoading: boolean;
  onAddIntentions?: () => void;
}

const AttendeeDirectoryContext = createContext<AttendeeDirectoryContextValue | null>(null);

function useAttendeeDirectory() {
  const context = useContext(AttendeeDirectoryContext);
  if (!context) {
    throw new Error(
      'AttendeeDirectory compound components must be used within AttendeeDirectory.Root'
    );
  }
  return context;
}

interface RootProps {
  data: AttendeeDirectoryData | null;
  isLoading?: boolean;
  onAddIntentions?: () => void;
  children: React.ReactNode;
}

function Root({ data, isLoading = false, onAddIntentions, children }: RootProps) {
  return (
    <AttendeeDirectoryContext.Provider value={{ data, isLoading, onAddIntentions }}>
      <YStack flex={1} w="100%">
        {children}
      </YStack>
    </AttendeeDirectoryContext.Provider>
  );
}

function LockedView() {
  const { data, onAddIntentions } = useAttendeeDirectory();

  if (data?.userHasIntentions) {
    return null;
  }

  return (
    <YStack f={1} jc="center" ai="center" gap="$4" p="$6">
      <YStack gap="$2" ai="center" maxWidth={400}>
        <H4 ta="center">{ATTENDEE_DIRECTORY_MESSAGES.locked.title}</H4>
        <Paragraph ta="center" color="$gray11" fontSize="$3">
          {ATTENDEE_DIRECTORY_MESSAGES.locked.description}
        </Paragraph>
      </YStack>
      {onAddIntentions && (
        <Button size="$4" onPress={onAddIntentions} theme="blue">
          {ATTENDEE_DIRECTORY_MESSAGES.locked.ctaText}
        </Button>
      )}
    </YStack>
  );
}

interface UnlockedViewProps {
  children: React.ReactNode;
}

function UnlockedView({ children }: UnlockedViewProps) {
  const { data } = useAttendeeDirectory();

  if (!data?.userHasIntentions) {
    return null;
  }

  if (data.attendees.length === 0) {
    return (
      <YStack f={1} jc="center" ai="center" p="$6">
        <Paragraph color="$gray11">{ATTENDEE_DIRECTORY_MESSAGES.unlocked.emptyState}</Paragraph>
      </YStack>
    );
  }

  return (
    <ScrollView flex={1} contentContainerStyle={{ padding: '$4' }}>
      {children}
    </ScrollView>
  );
}

function AttendeeList() {
  const { data } = useAttendeeDirectory();

  if (!data?.attendees) {
    return null;
  }

  return (
    <YStack gap="$3">
      {data.attendees.map((attendee) => (
        <AttendeeCard key={attendee.userId} attendee={attendee} />
      ))}
    </YStack>
  );
}

interface AttendeeCardProps {
  attendee: AttendeeProfile;
}

function AttendeeCard({ attendee }: AttendeeCardProps) {
  return (
    <YStack
      backgroundColor="$background"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$borderColor"
      p="$4"
      gap="$3"
    >
      {/* Header with avatar and name */}
      <XStack gap="$3" ai="center">
        <Stack width={48} height={48} borderRadius="$12" backgroundColor="$gray5" overflow="hidden">
          {attendee.avatar ? (
            <Image source={{ uri: attendee.avatar }} width={48} height={48} />
          ) : (
            <Stack f={1} ai="center" jc="center">
              <Text fontSize="$6" fontWeight="600">
                {attendee.name.charAt(0).toUpperCase()}
              </Text>
            </Stack>
          )}
        </Stack>

        <YStack f={1} gap="$1">
          <Text fontSize="$5" fontWeight="600">
            {attendee.name}
          </Text>
          {attendee.worksAt && (
            <XStack gap="$1.5" ai="center">
              <Text fontSize="$2" color="$gray11">
                Works at
              </Text>
              <Text fontSize="$2" fontWeight="500">
                {attendee.worksAt}
              </Text>
            </XStack>
          )}
        </YStack>
      </XStack>

      {/* Role tags */}
      {attendee.role && attendee.role.length > 0 && (
        <XStack gap="$2" flexWrap="wrap">
          {attendee.role.map((r) => (
            <Stack
              key={r}
              backgroundColor="$gray4"
              paddingHorizontal="$2.5"
              paddingVertical="$1.5"
              borderRadius="$2"
            >
              <Text fontSize="$2" color="$gray12">
                {r}
              </Text>
            </Stack>
          ))}
        </XStack>
      )}

      {/* Intentions */}
      {attendee.intentions && attendee.intentions.length > 0 && (
        <YStack gap="$2">
          <Text fontSize="$2" color="$gray11" fontWeight="500">
            Event Goals
          </Text>
          <XStack gap="$2" flexWrap="wrap">
            {attendee.intentions.map((intention) => {
              const metadata = EVENT_INTENTION_METADATA[intention];
              return (
                <XStack
                  key={intention}
                  gap="$1.5"
                  ai="center"
                  backgroundColor={metadata.color as any}
                  paddingHorizontal="$2.5"
                  paddingVertical="$1.5"
                  borderRadius="$2"
                >
                  <Text fontSize="$4">{metadata.icon}</Text>
                  <Text fontSize="$2" fontWeight="500">
                    {metadata.label}
                  </Text>
                </XStack>
              );
            })}
          </XStack>
        </YStack>
      )}
    </YStack>
  );
}

export const AttendeeDirectory = {
  Root,
  LockedView,
  UnlockedView,
  AttendeeList,
  AttendeeCard,
};
