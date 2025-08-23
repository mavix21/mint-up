'use client';

import {
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
  Separator,
} from '@my/ui';
import { useParams } from 'next/navigation';

import {
  getCommunityProfileById,
  communityProfileData,
  type LeaderboardEntry,
} from '@/app/(app)/(tabs)/communities/data';

function Podium({ top3 }: { top3: LeaderboardEntry[] }) {
  const [first, second, third] = top3;
  return (
    <XStack gap="$3" alignItems="flex-end" justifyContent="center" mt="$2">
      <YStack alignItems="center" gap="$2">
        <Avatar circular size="$4">
          <Avatar.Image src={second?.user.pfpUrl} alt={second?.user.name} />
          <Avatar.Fallback asChild>
            <View bc="$color6" width="100%" height="100%" jc="center" ai="center">
              <SizableText>2</SizableText>
            </View>
          </Avatar.Fallback>
        </Avatar>
        <SizableText size="$2" fontWeight="600">
          2
        </SizableText>
        <SizableText size="$2" theme="alt1">
          {second?.user.name}
        </SizableText>
      </YStack>
      <YStack alignItems="center" gap="$2">
        <Avatar circular size="$6">
          <Avatar.Image src={first?.user.pfpUrl} alt={first?.user.name} />
          <Avatar.Fallback asChild>
            <View bc="$color6" width="100%" height="100%" jc="center" ai="center">
              <SizableText>1</SizableText>
            </View>
          </Avatar.Fallback>
        </Avatar>
        <SizableText size="$3" fontWeight="700">
          1
        </SizableText>
        <SizableText size="$2" theme="alt1">
          {first?.user.name}
        </SizableText>
      </YStack>
      <YStack alignItems="center" gap="$2">
        <Avatar circular size="$4">
          <Avatar.Image src={third?.user.pfpUrl} alt={third?.user.name} />
          <Avatar.Fallback asChild>
            <View bc="$color6" width="100%" height="100%" jc="center" ai="center">
              <SizableText>3</SizableText>
            </View>
          </Avatar.Fallback>
        </Avatar>
        <SizableText size="$2" fontWeight="600">
          3
        </SizableText>
        <SizableText size="$2" theme="alt1">
          {third?.user.name}
        </SizableText>
      </YStack>
    </XStack>
  );
}

function RankingList({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <YStack gap="$2">
      {entries.map((e) => (
        <XStack
          key={`${e.user.name}-${e.rank ?? e.streak ?? 'r'}`}
          alignItems="center"
          justifyContent="space-between"
          p="$2"
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius="$4"
        >
          <XStack alignItems="center" gap="$3">
            <SizableText size="$2" width={24} textAlign="center">
              {e.rank ?? ''}
            </SizableText>
            <Avatar circular size="$3">
              <Avatar.Image src={e.user.pfpUrl} alt={e.user.name} />
              <Avatar.Fallback asChild>
                <View bc="$color6" width="100%" height="100%" jc="center" ai="center">
                  <SizableText>{e.user.name[0]}</SizableText>
                </View>
              </Avatar.Fallback>
            </Avatar>
            <SizableText size="$3">{e.user.name}</SizableText>
          </XStack>
          {'totalAttended' in e && e.totalAttended !== undefined ? (
            <SizableText size="$2" theme="alt1">
              {e.totalAttended} attended
            </SizableText>
          ) : (
            <SizableText size="$2" theme="alt1">
              {e.streak} 🔥
            </SizableText>
          )}
        </XStack>
      ))}
    </YStack>
  );
}

export default function CommunityProfilePage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string | undefined);
  const profile = id ? getCommunityProfileById(id) : communityProfileData;

  if (!profile) {
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
          <Image
            alt="banner"
            src={profile.bannerUrl}
            width="100%"
            height="100%"
            objectFit="cover"
          />
        </View>
        <XStack px="$4" mt={-32} alignItems="flex-end" gap="$3">
          <Avatar circular size="$6" borderWidth={2} borderColor="$background">
            <Avatar.Image src={profile.logoUrl} alt={profile.name} />
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
          <Button size="$3">Join Community</Button>
        </XStack>
        <Paragraph px="$4" mt="$2" size="$3">
          {profile.description}
        </Paragraph>
      </YStack>

      <Tabs defaultValue="events" flexDirection="column" px="$4">
        <Tabs.List
          mb="$3"
          borderColor="$borderColor"
          borderWidth={1}
          $gtSm={{ width: 'fit-content' as any }}
        >
          <Tabs.Tab value="events">
            <SizableText>Events</SizableText>
          </Tabs.Tab>
          <Tabs.Tab value="members">
            <SizableText>Members</SizableText>
          </Tabs.Tab>
          <Tabs.Tab value="leaderboard">
            <SizableText>Leaderboard</SizableText>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Content value="events">
          <Card bordered p="$3">
            <SizableText size="$3" theme="alt1">
              Events list coming soon
            </SizableText>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="members">
          <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
            <XStack flexWrap="wrap" gap="$3" flex={1} justifyContent="center">
              {Array.from({ length: 12 }).map((_, i) => (
                <YStack key={i} alignItems="center" gap="$2" flex={1} flexGrow={0}>
                  <Avatar circular size="$4">
                    <Avatar.Fallback asChild>
                      <View bc="$color6" width="100%" height="100%" jc="center" ai="center">
                        <SizableText>M</SizableText>
                      </View>
                    </Avatar.Fallback>
                  </Avatar>
                  <SizableText size="$2">Member {i + 1}</SizableText>
                </YStack>
              ))}
            </XStack>
          </ScrollView>
        </Tabs.Content>

        <Tabs.Content value="leaderboard">
          <YStack gap="$4">
            <YStack gap="$2">
              <SizableText size="$5" fontWeight="bold">
                Top Attendees
              </SizableText>
              <Paragraph size="$3">
                The pillars of our community. This list recognizes members by the total number of
                events they&apos;ve attended.
              </Paragraph>
              <Podium top3={profile.leaderboard.topAttendees.slice(0, 3)} />
              <RankingList entries={profile.leaderboard.topAttendees.slice(3)} />
            </YStack>

            <Separator borderColor="$borderColor" />

            <YStack gap="$2">
              <SizableText size="$5" fontWeight="bold">
                Attendance Streak
              </SizableText>
              <Paragraph size="$3">
                Recognizing consistency. This list highlights members with the longest streak of
                attending our most recent events.
              </Paragraph>
              <RankingList entries={profile.leaderboard.attendanceStreak} />
            </YStack>
          </YStack>
        </Tabs.Content>
      </Tabs>
    </YStack>
  );
}
