'use client';

import { api } from '@my/backend/_generated/api';
import {
  Avatar,
  Button,
  Card,
  Input,
  Paragraph,
  Popover,
  ScrollView,
  Separator,
  SizableText,
  View,
  XStack,
  YStack,
  Link,
  Container,
  Spinner,
} from '@my/ui';
import { Filter } from '@tamagui/lucide-icons';
import { useQuery } from 'convex/react';

type Community = {
  _id: string;
  name: string;
  description?: string;
  logoUrl: string | null;
  memberCount: number;
  eventCount: number;
};

function CommunityCard({ community }: { community: Community }) {
  return (
    <Card bordered p="$4" width="100%">
      <YStack gap="$3">
        <XStack alignItems="center" gap="$3">
          <Avatar circular size="$4">
            <Avatar.Image src={community.logoUrl || undefined} alt={community.name} />
            <Avatar.Fallback width="100%" height="100%" jc="center" ai="center" asChild>
              <View>
                <SizableText>{community.name[0]}</SizableText>
              </View>
            </Avatar.Fallback>
          </Avatar>
          <YStack>
            <SizableText size="$5" fontWeight="bold">
              {community.name}
            </SizableText>
            <SizableText size="$2" theme="alt1">
              {community.memberCount} members • {community.eventCount} events
            </SizableText>
          </YStack>
        </XStack>

        <Paragraph size="$3">{community.description}</Paragraph>

        <Separator borderColor="$borderColor" />

        <XStack justifyContent="space-between" alignItems="center">
          <XStack gap="$4">
            <YStack>
              <SizableText size="$1" theme="alt1">
                Members
              </SizableText>
              <SizableText size="$4" fontWeight="600">
                {community.memberCount}
              </SizableText>
            </YStack>
            <YStack>
              <SizableText size="$1" theme="alt1">
                Events
              </SizableText>
              <SizableText size="$4" fontWeight="600">
                {community.eventCount}
              </SizableText>
            </YStack>
          </XStack>

          <Link href={`/communities/${community._id}`} asChild>
            <Button size="$3">View</Button>
          </Link>
        </XStack>
      </YStack>
    </Card>
  );
}

export default function CommunitiesPage() {
  const communities = useQuery(api.communities.getAllCommunities);

  return (
    <Container size="wide" gap="$4" px="$4" py="$4">
      <YStack gap="$1">
        <SizableText size="$8" fontWeight="bold">
          Communities
        </SizableText>
        <SizableText size="$4" theme="alt1">
          Discover and join the best communities in web3.
        </SizableText>
      </YStack>

      <XStack gap="$2" alignItems="center">
        <Input flex={1} size="$3" placeholder="Search communities" />

        <Popover size="$2">
          <Popover.Trigger asChild>
            <Button icon={Filter} size="$3" aria-label="Filters" />
          </Popover.Trigger>
          <Popover.Content borderWidth={1} borderColor="$borderColor" elevate>
            <YStack p="$3" gap="$2" width={220}>
              <SizableText size="$3" fontWeight="600">
                Filters
              </SizableText>
              <SizableText size="$2" theme="alt1">
                Coming soon
              </SizableText>
            </YStack>
          </Popover.Content>
        </Popover>
      </XStack>

      <ScrollView flex={1} contentContainerStyle={{ paddingBottom: 24 }}>
        {communities === undefined ? (
          <YStack flex={1} alignItems="center" justifyContent="center" paddingVertical="$10">
            <Spinner size="large" />
          </YStack>
        ) : communities.length === 0 ? (
          <YStack flex={1} alignItems="center" justifyContent="center" paddingVertical="$10">
            <SizableText size="$5" theme="alt1">
              No communities found
            </SizableText>
          </YStack>
        ) : (
          <XStack flexWrap="wrap" gap="$3">
            {communities.map((c) => (
              <View key={c._id} flex={1}>
                <CommunityCard community={c} />
              </View>
            ))}
          </XStack>
        )}
      </ScrollView>
    </Container>
  );
}
