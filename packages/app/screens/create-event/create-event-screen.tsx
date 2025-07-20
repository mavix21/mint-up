import { TimePicker, Chip, Drawer } from '@my/ui';
import { Globe, MapPin } from '@tamagui/lucide-icons';
import { useState } from 'react';
import {
  Button,
  Label,
  Switch,
  Text,
  XStack,
  YStack,
  Card,
  Avatar,
  Sheet,
  Theme,
  ScrollView,
  YGroup,
  ThemeName,
  ToggleGroup,
  Stack,
  VisuallyHidden,
  getTokens,
  TextArea,
  Group,
  Separator,
  SizableText,
  useWindowDimensions,
  View,
  isWeb,
} from 'tamagui';

import {
  getClientTimezone,
  calculateDefaultEventTimes,
  getTodayDateString,
  getThemeOptions,
  getThemeColor,
} from '../../utils';

export function CreateEventScreen() {
  const tamaguiTokens = getTokens();
  const [theme, setTheme] = useState<string>('');
  const [showThemeSheet, setShowThemeSheet] = useState(false);

  // Get client timezone
  const clientTimezone = getClientTimezone();

  // Calculate closest time and default end time
  const { startTime, endTime } = calculateDefaultEventTimes();
  const themeOptions = getThemeOptions();
  const todayDateString = getTodayDateString();

  const [showLocationDrawer, setShowLocationDrawer] = useState(false);

  return (
    <Theme name={theme as ThemeName}>
      <YStack flex={1} fullscreen backgroundColor="$color1">
        <YStack flex={1} py="$4">
          <ScrollView flex={1} width="100%">
            <YStack gap="$4" px="$4" py="$4" marginHorizontal="auto" width="100%" maxWidth={496}>
              {/* Event Image */}
              <Card
                size="$6"
                width="100%"
                height={180}
                backgroundColor="$color4"
                borderRadius="$6"
                overflow="hidden"
              >
                <YStack flex={1} alignItems="flex-end" justifyContent="flex-end" p="$3">
                  <Avatar circular size="$4" backgroundColor="$color2">
                    <Avatar.Fallback bc="$color2" />
                  </Avatar>
                </YStack>
              </Card>
              {/* Theme Selector (at the top) */}
              <XStack gap="$2">
                <Button onPress={() => setShowThemeSheet(true)} backgroundColor="$color3">
                  <XStack alignItems="center" gap="$2">
                    <Text fontWeight="500">Theme</Text>
                    <Stack
                      width={20}
                      height={20}
                      borderRadius={4}
                      backgroundColor={getThemeColor(theme) as any}
                    />
                  </XStack>
                </Button>
              </XStack>
              {/* Event Name */}
              <YStack>
                <VisuallyHidden>
                  <Label htmlFor="event-name" fontSize={18} fontWeight="700" mb="$2">
                    Event Name
                  </Label>
                </VisuallyHidden>
                <TextArea
                  id="event-name"
                  placeholder="Event Name"
                  flexGrow={1}
                  unstyled
                  borderWidth={0}
                  fontWeight="700"
                  placeholderTextColor="$color8"
                  style={
                    {
                      fontSize: tamaguiTokens.size.$3.val,
                      fieldSizing: 'content',
                    } as any
                  }
                />
              </YStack>

              {/* Start/End DateTime */}
              <YStack gap="$2">
                <Group orientation="vertical" size="$2" separator={<Separator />} borderRadius="$4">
                  <Group.Item>
                    <XStack
                      flex={1}
                      alignItems="center"
                      gap="$2"
                      px="$true"
                      py="$1.5"
                      borderRadius="$true"
                      backgroundColor="$color3"
                    >
                      <Label htmlFor="start" flex={1} fontWeight="500">
                        Start
                      </Label>
                      <XStack gap="$4" alignItems="center">
                        <input
                          id="start"
                          type="date"
                          style={{ textAlign: 'center' }}
                          min={todayDateString}
                          defaultValue={todayDateString}
                        />
                        <TimePicker
                          value={startTime}
                          onChangeText={(value) => {
                            console.log(value);
                          }}
                        />
                      </XStack>
                    </XStack>
                  </Group.Item>
                  <Group.Item>
                    <XStack
                      flex={1}
                      alignItems="center"
                      gap="$2"
                      px="$true"
                      py="$1.5"
                      borderRadius="$true"
                      backgroundColor="$color3"
                    >
                      <Label htmlFor="end" flex={1} fontWeight="500">
                        End
                      </Label>
                      <XStack gap="$4" alignItems="center">
                        <input
                          id="end"
                          type="date"
                          style={{ textAlign: 'center' }}
                          min={todayDateString}
                          defaultValue={todayDateString}
                        />
                        <TimePicker
                          value={endTime}
                          onChangeText={(value) => {
                            console.log(value);
                          }}
                        />
                      </XStack>
                    </XStack>
                  </Group.Item>
                  <Group.Item>
                    <XStack
                      flex={1}
                      alignItems="center"
                      gap="$2"
                      px="$true"
                      py="$1.5"
                      borderRadius="$true"
                      backgroundColor="$color3"
                    >
                      <Label flex={1} fontWeight="500">
                        Timezone
                      </Label>
                      <XStack gap="$4" alignItems="center">
                        <Chip
                          size="$4"
                          py="$2"
                          borderRadius="$4"
                          backgroundColor="$color5"
                          hoverStyle={{ backgroundColor: '$color6' }}
                          pressStyle={{ backgroundColor: '$color7' }}
                          focusStyle={{ backgroundColor: '$color8' }}
                        >
                          <Chip.Icon>
                            <Globe size={16} />
                          </Chip.Icon>
                          <Chip.Text>
                            <SizableText mr="$2">GMT{clientTimezone.offset}</SizableText>
                            <SizableText>{clientTimezone.city}</SizableText>
                          </Chip.Text>
                        </Chip>
                      </XStack>
                    </XStack>
                  </Group.Item>
                </Group>
              </YStack>

              {/* Location */}
              <YStack>
                <Button
                  onPress={() => setShowLocationDrawer(true)}
                  justifyContent="space-between"
                  backgroundColor="$color3"
                  iconAfter={<MapPin size={16} />}
                >
                  <Text>Location</Text>
                  <Text color="$color11" ml="$2">
                    Offline location or virtual link
                  </Text>
                </Button>
              </YStack>
              {/* Description */}
              <YStack>
                <Button justifyContent="flex-start" backgroundColor="$color3">
                  <Text>Add Description</Text>
                </Button>
              </YStack>
              {/* Event Options */}
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
                      <Switch size="$2">
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
                      <Text color="$color11">Unlimited</Text>
                      <Button size="$2" backgroundColor="transparent">
                        <Text color="$color10">✎</Text>
                      </Button>
                    </XStack>
                  </YGroup.Item>
                </YGroup>
              </YStack>
              {/* Create Event Button - Now part of the scrollable content */}
              <YStack py="$4" borderColor="$color3">
                <Button
                  size="$4"
                  themeInverse
                  fontWeight="600"
                  width="100%"
                  marginHorizontal="auto"
                >
                  Create Event
                </Button>
              </YStack>
            </YStack>
          </ScrollView>
        </YStack>
      </YStack>

      {/* Theme Selector Sheet (minimalistic, toggle group) */}
      <Sheet
        open={showThemeSheet}
        onOpenChange={setShowThemeSheet}
        snapPoints={[15]}
        defaultPosition={0}
        modal
      >
        <Sheet.Overlay
          animation="lazy"
          backgroundColor="$shadowColor"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle backgroundColor="$color3" />
        <Sheet.Frame padding="$4" alignItems="center" backgroundColor="$color3">
          <ToggleGroup
            type="single"
            value={theme}
            onValueChange={(val) => {
              setTheme(val);
            }}
            backgroundColor="$color3"
            orientation="horizontal"
            gap="$3"
          >
            {themeOptions.map((option) => (
              <ToggleGroup.Item
                key={option.value}
                value={option.value}
                unstyled
                width={32}
                height={32}
                borderRadius={16}
                backgroundColor={option.color as any}
                alignItems="center"
                justifyContent="center"
              >
                {/* Empty, just colored circle */}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup>
        </Sheet.Frame>
      </Sheet>

      <LocationDrawer open={showLocationDrawer} setOpen={setShowLocationDrawer} />
    </Theme>
  );
}

function LocationDrawer({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const { height, width } = useWindowDimensions();

  return (
    <View
      flexDirection="column"
      {...(isWeb && {
        onKeyDown: (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            setOpen(false);
          }
        },
      })}
      marginVertical="$-2"
      position="absolute"
    >
      <Drawer open={open} onOpenChange={setOpen} portalToRoot>
        <Drawer.Overlay
          animation="lazy"
          height={height + 12}
          width={width + 12}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Drawer.Swipeable>
          <Drawer.Content
            x={-30}
            paddingLeft={30}
            width={240}
            height={height + 12}
            backgroundColor="$color3"
          >
            <YStack p="$4">
              <Text fontWeight="600" mb="$4">
                Location
              </Text>
              <YStack gap="$3">
                <Button backgroundColor="$color4" justifyContent="flex-start">
                  <Text>📍 Offline Location</Text>
                </Button>
                <Button backgroundColor="$color4" justifyContent="flex-start">
                  <Text>🌐 Virtual Link</Text>
                </Button>
              </YStack>
            </YStack>
          </Drawer.Content>
        </Drawer.Swipeable>
      </Drawer>
    </View>
  );
}
