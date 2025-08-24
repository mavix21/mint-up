'use client';

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
} from '@my/ui';
import { Filter } from '@tamagui/lucide-icons';

import { communityListData, type CommunityListItem } from '@/app/(app)/(tabs)/communities/data';

function CommunityCard({ community }: { community: CommunityListItem }) {
  return (
    <Card bordered p="$4" width="100%">
      <YStack gap="$3">
        <XStack alignItems="center" gap="$3">
          <Avatar circular size="$4">
            <Avatar.Image src={community.logoUrl} alt={community.name} />
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

          <Link href={`/communities/${community.id}`} asChild>
            <Button size="$3">View</Button>
          </Link>
        </XStack>
      </YStack>
    </Card>
  );
}

export default function CommunitiesPage() {
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
        <XStack flexWrap="wrap" gap="$3">
          {communityListData.map((c) => (
            <View key={c.id} flex={1} $gtSm={{ flexBasis: '0%' }}>
              <CommunityCard community={c} />
            </View>
          ))}
        </XStack>
      </ScrollView>
    </Container>
  );
}
