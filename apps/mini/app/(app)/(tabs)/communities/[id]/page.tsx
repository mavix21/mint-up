'use client';

import { api } from '@my/backend/_generated/api';
import type { Id } from '@my/backend/_generated/dataModel';
import {
  Text,
  Avatar,
  Button,
  Card,
  Image,
  Paragraph,
  SizableText,
  Tabs,
  View,
  XStack,
  YStack,
  ScrollView,
  Spinner,
} from '@my/ui';
import { MapPin, Globe, Calendar } from '@tamagui/lucide-icons';
import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';

export default function CommunityProfilePage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string | undefined);
  const profile = useQuery(
    api.communities.getCommunityProfile,
    id ? { communityId: id as Id<'organizations'> } : 'skip'
  );

  if (profile === undefined) {
    return (
      <YStack
        p="$4"
        gap="$4"
        maxWidth={720}
        marginInline="auto"
        ai="center"
        jc="center"
        minHeight={400}
      >
        <Spinner size="large" />
        <SizableText size="$3" theme="alt1">
          Loading community...
        </SizableText>
      </YStack>
    );
  }

  if (!profile || profile === null) {
    return (
      <YStack p="$4" gap="$2" maxWidth={720} marginInline="auto">
        <SizableText size="$6" fontWeight="bold">
          Community not found
        </SizableText>
        <Paragraph size="$3" theme="alt1">
          We couldn&apos;t find that community.
        </Paragraph>
      </YStack>
    );
  }

  return (
    <YStack width="100%" maxWidth={900} marginInline="auto" gap="$4" pb="$6">
      <YStack>
        <View height={140} backgroundColor="$color6">
          {profile.bannerUrl && (
            <Image
              alt="banner"
              src={profile.bannerUrl}
              width="100%"
              height="100%"
              objectFit="cover"
            />
          )}
        </View>
        <XStack px="$4" mt={-32} alignItems="center" gap="$3">
          <Avatar circular size="$6" borderWidth={2} borderColor="$background">
            {profile.logoUrl && <Avatar.Image src={profile.logoUrl} alt={profile.name} />}
            <Avatar.Fallback
              bc="$color6"
              width="100%"
              height="100%"
              jc="center"
              ai="center"
              asChild
            >
              <View>
                <SizableText>{profile.name[0]}</SizableText>
              </View>
            </Avatar.Fallback>
          </Avatar>
          <YStack>
            <SizableText size="$7" fontWeight="bold">
              {profile.name}
            </SizableText>
            <SizableText size="$3" theme="alt1">
              {profile.stats.members} members • {profile.stats.events} events
            </SizableText>
          </YStack>
          <View flex={1} />
          <Button size="$3">
            <Button.Text>Join Community</Button.Text>
          </Button>
        </XStack>
        <Paragraph px="$4" mt="$2" size="$3">
          {profile.description || 'No description available.'}
        </Paragraph>
      </YStack>

      <Tabs defaultValue="events" flexDirection="column" px="$4">
        <Tabs.List mb="$3" borderColor="$borderColor" borderWidth={1}>
          <Tabs.Tab value="events">
            <SizableText>Events</SizableText>
          </Tabs.Tab>
          <Tabs.Tab value="members">
            <SizableText>Members</SizableText>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Content value="events">
          <YStack gap="$3">
            {profile.events.length === 0 ? (
              <Card bordered p="$4">
                <YStack gap="$2" ai="center">
                  <SizableText size="$3" theme="alt1">
                    No events yet
                  </SizableText>
                  <SizableText size="$2" theme="alt1">
                    This community hasn&apos;t hosted any events.
                  </SizableText>
                </YStack>
              </Card>
            ) : (
              profile.events.map((event) => (
                <Card key={event._id} bordered p="$3" hoverStyle={{ borderColor: '$color8' }}>
                  <XStack gap="$3" alignItems="flex-start">
                    {event.imageUrl && (
                      <Image
                        src={event.imageUrl}
                        width={80}
                        height={80}
                        borderRadius="$3"
                        objectFit="cover"
                      />
                    )}
                    <YStack flex={1} gap="$2">
                      <SizableText size="$5" fontWeight="600">
                        {event.name}
                      </SizableText>
                      {event.description && (
                        <SizableText size="$2" theme="alt1" numberOfLines={2}>
                          {event.description}
                        </SizableText>
                      )}
                      <XStack gap="$2" alignItems="center">
                        <Calendar size={14} />
                        <SizableText size="$2" theme="alt1">
                          {new Date(event.startDate).toLocaleDateString()}
                        </SizableText>
                      </XStack>
                      <XStack gap="$4" alignItems="center">
                        {event.location && (
                          <XStack gap="$2" alignItems="center">
                            {typeof event.location === 'object' &&
                            event.location.type === 'online' ? (
                              <Globe size={14} />
                            ) : (
                              <MapPin size={14} />
                            )}
                            <SizableText size="$2" theme="alt1">
                              {typeof event.location === 'string'
                                ? event.location
                                : event.location.type === 'online'
                                ? 'Online Event'
                                : event.location.address || 'In-person'}
                            </SizableText>
                          </XStack>
                        )}
                        <Text>•</Text>
                        <SizableText size="$2" theme="alt1">
                          {event.registrationCount}{' '}
                          {event.registrationCount === 1 ? 'attendee' : 'attendees'}
                        </SizableText>
                      </XStack>
                    </YStack>
                  </XStack>
                </Card>
              ))
            )}
          </YStack>
        </Tabs.Content>

        <Tabs.Content value="members">
          {profile.members.length === 0 ? (
            <Card bordered p="$4">
              <YStack gap="$2" ai="center">
                <SizableText size="$3" theme="alt1">
                  No members yet
                </SizableText>
              </YStack>
            </Card>
          ) : (
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
              <XStack flexWrap="wrap" gap="$3" flex={1}>
                {profile.members.map((member) => (
                  <YStack key={member._id} alignItems="center" gap="$2" width={100}>
                    <Avatar circular size="$4">
                      {member.imageUrl && (
                        <Avatar.Image src={member.imageUrl} alt={member.name || 'Member'} />
                      )}
                      <Avatar.Fallback asChild>
                        <View bc="$color6" width="100%" height="100%" jc="center" ai="center">
                          <SizableText>{member.name?.[0] || 'M'}</SizableText>
                        </View>
                      </Avatar.Fallback>
                    </Avatar>
                    <SizableText size="$2" textAlign="center" numberOfLines={1}>
                      {member.name || 'Unknown'}
                    </SizableText>
                    {member.role === 'admin' && (
                      <SizableText size="$1" theme="alt1">
                        Admin
                      </SizableText>
                    )}
                  </YStack>
                ))}
              </XStack>
            </ScrollView>
          )}
        </Tabs.Content>
      </Tabs>
    </YStack>
  );
}
