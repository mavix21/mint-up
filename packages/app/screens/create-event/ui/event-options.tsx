import { Button, Switch, Text, XStack, YStack, YGroup, Separator } from 'tamagui';

export interface EventOptionsProps {
  tickets?: string;
  requireApproval?: boolean;
  capacity?: string;
  onTicketsPress?: () => void;
  onCapacityPress?: () => void;
  onRequireApprovalChange?: (value: boolean) => void;
}

export function EventOptions({
  tickets = 'Free',
  requireApproval = false,
  capacity = 'Unlimited',
  onTicketsPress,
  onCapacityPress,
  onRequireApprovalChange,
}: EventOptionsProps) {
  return (
    <YStack gap="$2">
      <Text fontWeight="700" mb="$2">
        Event Options
      </Text>
      <YGroup
        borderRadius="$4"
        $platform-native={{ borderCurve: 'circular' }}
        size="$4"
        backgroundColor="$color3"
        separator={<Separator />}
      >
        <YGroup.Item>
          <XStack alignItems="center" justifyContent="space-between" px="$4" py="$3">
            <XStack alignItems="center" space="$2">
              <Text>🎟️</Text>
              <Text>Tickets</Text>
            </XStack>
            <Text color="$color11">{tickets}</Text>
            <Button size="$2" backgroundColor="transparent" onPress={onTicketsPress}>
              <Text color="$color10">✎</Text>
            </Button>
          </XStack>
        </YGroup.Item>
        <YGroup.Item>
          <XStack alignItems="center" justifyContent="space-between" px="$4" py="$3">
            <XStack alignItems="center" space="$2">
              <Text>👤</Text>
              <Text>Require Approval</Text>
            </XStack>
            <Switch size="$2" checked={requireApproval} onCheckedChange={onRequireApprovalChange}>
              <Switch.Thumb animation="bouncy" />
            </Switch>
          </XStack>
        </YGroup.Item>
        <YGroup.Item>
          <XStack alignItems="center" justifyContent="space-between" px="$4" py="$3">
            <XStack alignItems="center" space="$2">
              <Text>📏</Text>
              <Text>Capacity</Text>
            </XStack>
            <Text color="$color11">{capacity}</Text>
            <Button size="$2" backgroundColor="transparent" onPress={onCapacityPress}>
              <Text color="$color10">✎</Text>
            </Button>
          </XStack>
        </YGroup.Item>
      </YGroup>
    </YStack>
  );
}
