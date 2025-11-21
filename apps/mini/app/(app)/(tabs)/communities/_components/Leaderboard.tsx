import type { Id } from '@my/backend/_generated/dataModel';
import { Avatar, Card, SizableText, View, XStack, YStack } from '@my/ui';
import { Trophy, Flame } from '@tamagui/lucide-icons';

export type LeaderboardEntry = {
  userId: Id<'users'>;
  name?: string;
  imageUrl: string | null;
  rank: number;
  value: number; // Can be totalEventsAttended or streak
};

type LeaderboardListProps = {
  entries: LeaderboardEntry[];
  type: 'attendees' | 'streak';
};

export function LeaderboardList({ entries, type }: LeaderboardListProps) {
  if (entries.length === 0) {
    return (
      <Card bordered p="$4">
        <YStack gap="$2" ai="center">
          <SizableText size="$3" theme="alt1">
            No data yet
          </SizableText>
          <SizableText size="$2" theme="alt1">
            Be the first to appear on the leaderboard!
          </SizableText>
        </YStack>
      </Card>
    );
  }

  return (
    <YStack gap="$3">
      {entries.map((entry) => (
        <LeaderboardItem key={entry.userId} entry={entry} type={type} />
      ))}
    </YStack>
  );
}

type LeaderboardItemProps = {
  entry: LeaderboardEntry;
  type: 'attendees' | 'streak';
};

function LeaderboardItem({ entry, type }: LeaderboardItemProps) {
  const isTop3 = entry.rank <= 3;
  const rankColor =
    entry.rank === 1
      ? '$yellow10'
      : entry.rank === 2
      ? '$gray10'
      : entry.rank === 3
      ? '$orange10'
      : '$color';

  return (
    <Card bordered p="$3" hoverStyle={{ borderColor: '$color8' }}>
      <XStack gap="$3" alignItems="center">
        <View width={30} alignItems="center">
          {isTop3 ? (
            <Trophy size={20} color={rankColor} />
          ) : (
            <SizableText size="$4" fontWeight="bold" color="$color10">
              #{entry.rank}
            </SizableText>
          )}
        </View>

        <Avatar circular size="$4">
          {entry.imageUrl && <Avatar.Image src={entry.imageUrl} alt={entry.name || 'User'} />}
          <Avatar.Fallback asChild>
            <View bc="$color6" width="100%" height="100%" jc="center" ai="center">
              <SizableText>{entry.name?.[0] || 'U'}</SizableText>
            </View>
          </Avatar.Fallback>
        </Avatar>

        <YStack flex={1}>
          <SizableText size="$4" fontWeight="600">
            {entry.name || 'Unknown User'}
          </SizableText>
        </YStack>

        <XStack gap="$2" alignItems="center">
          {type === 'streak' && <Flame size={16} color="$orange10" />}
          <SizableText size="$4" fontWeight="bold">
            {entry.value}
          </SizableText>
          <SizableText size="$2" theme="alt1">
            {type === 'attendees' ? 'events' : 'streak'}
          </SizableText>
        </XStack>
      </XStack>
    </Card>
  );
}

export const Leaderboard = {
  List: LeaderboardList,
  Item: LeaderboardItem,
};
