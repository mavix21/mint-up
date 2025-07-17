import { useState } from 'react';
import {
  Button,
  Input,
  Label,
  Switch,
  Text,
  TextArea,
  XStack,
  YStack,
  Card,
  Avatar,
  Separator,
  Sheet,
  Select,
  Theme,
  View,
  SizableText,
  H4,
  H5,
  H6,
  Paragraph,
  Checkbox,
  ListItem,
  ScrollView,
  Spacer,
  Group,
  XGroup,
  YGroup,
  ThemeName,
} from 'tamagui';

export function CreateEventScreen() {
  const [theme, setTheme] = useState<string>('alt1');
  return (
    <Theme name={theme as ThemeName}>
      <ScrollView flex={1} width="100%" backgroundColor="$color1">
        <YStack gap="$4" px="$4" py="$4" maxWidth={480} marginHorizontal="auto">
          {/* Event Image */}
          <Card
            elevate
            size="$6"
            width="100%"
            height={180}
            backgroundColor="$color3"
            borderRadius={24}
            overflow="hidden"
          >
            <YStack flex={1} alignItems="flex-end" justifyContent="flex-end" p="$3">
              <Avatar circular size="$4" backgroundColor="$color5">
                <Avatar.Fallback bc="$color4" />
              </Avatar>
            </YStack>
          </Card>
          {/* Theme Selector */}
          <XGroup size="$3">
            <XGroup.Item>
              <Button iconAfter={<Text>⟳</Text>} size="$3">
                <XStack alignItems="center" gap="$2">
                  <Text fontWeight="600">Theme</Text>
                  <Text color="$color11">Minimal</Text>
                </XStack>
              </Button>
            </XGroup.Item>
            <XGroup.Item>
              <Button size="$3">
                <Text>⇅</Text>
              </Button>
            </XGroup.Item>
          </XGroup>
          {/* Event Name */}
          <YStack>
            <Label htmlFor="event-name" fontSize={18} fontWeight="700" mb="$2">
              Event Name
            </Label>
            <Input
              id="event-name"
              placeholder="Event Name"
              borderRadius={12}
              fontSize={18}
              py="$3"
              px="$4"
            />
          </YStack>
          {/* Start/End DateTime */}
          <YStack gap="$2">
            <XStack alignItems="center" gap="$2">
              <YStack flex={1}>
                <Label fontWeight="600">Start</Label>
                <Button size="$3" borderRadius={12} justifyContent="space-between">
                  <Text>Wed, Jul 16</Text>
                  <Text>11:09 PM</Text>
                </Button>
              </YStack>
              <YStack flex={1}>
                <Label fontWeight="600">End</Label>
                <Button size="$3" borderRadius={12} justifyContent="space-between">
                  <Text>Thu, Jul 17</Text>
                  <Text>12:09 AM</Text>
                </Button>
              </YStack>
            </XStack>
            <XStack alignItems="center" space="$2">
              <Button size="$2" borderRadius={12}>
                <Text>GMT-05:00</Text>
              </Button>
              <Text>Lima</Text>
            </XStack>
          </YStack>
          {/* Location */}
          <YStack>
            <Button size="$3" borderRadius={12} justifyContent="flex-start">
              <Text>Add Event Location</Text>
              <Text color="$color11" ml="$2">
                Offline location or virtual link
              </Text>
            </Button>
          </YStack>
          {/* Description */}
          <YStack>
            <Button size="$3" borderRadius={12} justifyContent="flex-start">
              <Text>Add Description</Text>
            </Button>
          </YStack>
          {/* Event Options */}
          <YStack space="$2">
            <Text fontWeight="700" mb="$2">
              Event Options
            </Text>
            <YGroup borderRadius="$6" borderCurve="circular" size="$4" backgroundColor="$color3">
              <YGroup.Item>
                <XStack alignItems="center" justifyContent="space-between" px="$4" py="$3">
                  <XStack alignItems="center" space="$2">
                    <Text>🎟️</Text>
                    <Text>Tickets</Text>
                  </XStack>
                  <Text color="$color11">Free</Text>
                  <Button size="$2" backgroundColor="transparent">
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
                  <Switch size="$2" />
                </XStack>
              </YGroup.Item>
              <YGroup.Item>
                <XStack alignItems="center" justifyContent="space-between" px="$4" py="$3">
                  <XStack alignItems="center" space="$2">
                    <Text>📏</Text>
                    <Text>Capacity</Text>
                  </XStack>
                  <Text color="$color11">Unlimited</Text>
                  <Button size="$2" backgroundColor="transparent">
                    <Text color="$color10">✎</Text>
                  </Button>
                </XStack>
              </YGroup.Item>
            </YGroup>
          </YStack>
          {/* Create Event Button */}
          <Button
            size="$5"
            backgroundColor="$color12"
            color="$color1"
            borderRadius={16}
            fontWeight="700"
          >
            Create Event
          </Button>
        </YStack>
      </ScrollView>
    </Theme>
  );
}
