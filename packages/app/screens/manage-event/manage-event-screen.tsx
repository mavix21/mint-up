'use client';

import { api } from '@my/backend/_generated/api';
import { useQuery } from '@my/backend/react';
import {
  YStack,
  XStack,
  SizableText,
  Button,
  Tabs,
  FullscreenSpinner,
  Separator,
  View,
  Theme,
  ThemeName,
  ScrollView,
} from '@my/ui';
import { ArrowLeft, BarChart3, Users, Eye } from '@tamagui/lucide-icons';
import { useRouter } from 'next/navigation';

import { OverviewTab, HolderHubTab, InsightsTab } from './ui';

export const ManageEventScreen = ({ id }: { id: string }) => {
  const router = useRouter();
  const event = useQuery(api.events.getEventById, {
    eventId: id,
  });

  if (!event) {
    return (
      <YStack height="100%" justifyContent="center" alignItems="center" gap="$4">
        <FullscreenSpinner />
      </YStack>
    );
  }

  return (
    <Theme name={event.theme as ThemeName}>
      <View
        width="100%"
        height={'100vh' as any}
        backgroundColor="$background"
        flex={1}
        marginInline="auto"
      >
        <YStack
          height="100%"
          overflowBlock="hidden"
          flex={1}
          maxWidth={800}
          marginInline="auto"
          width="100%"
        >
          {/* Header */}
          <YStack padding="$4" gap="$3" borderColor="$borderColor">
            {/* Back Link */}
            <Button
              backgroundColor="transparent"
              hoverStyle={{ backgroundColor: 'transparent' }}
              padding={0}
              borderWidth={0}
              chromeless
              onPress={() => router.back()}
              alignSelf="flex-start"
              icon={<ArrowLeft color="$color10" />}
              size="$3"
            >
              <Button.Text color="$color10">Back</Button.Text>
            </Button>
            {/* Event Name */}
            <SizableText size="$8" fontWeight="bold" color="$color12" lineHeight="$6">
              {event.name}
            </SizableText>
            <Separator />
          </YStack>
          {/* Tabs */}
          <Tabs
            defaultValue="overview"
            flex={1}
            flexDirection="column"
            backgroundColor="$background"
            size="$4"
            height="100%"
            overflowBlock="hidden"
          >
            <Tabs.List backgroundColor="$background" paddingHorizontal="$4" paddingVertical="$2">
              <Tabs.Tab
                value="overview"
                flex={1}
                backgroundColor="transparent"
                borderWidth={0}
                paddingVertical="$3"
                paddingHorizontal="$4"
              >
                <XStack gap="$2" alignItems="center" justifyContent="center">
                  <Eye size={18} color="$color12" />
                  <SizableText size="$3" color="$color12">
                    Overview
                  </SizableText>
                </XStack>
              </Tabs.Tab>
              <Tabs.Tab
                value="holder-hub"
                flex={1}
                backgroundColor="transparent"
                borderWidth={0}
                paddingVertical="$3"
                paddingHorizontal="$4"
              >
                <XStack gap="$2" alignItems="center" justifyContent="center">
                  <Users size={18} color="$color12" />
                  <SizableText size="$3" color="$color12">
                    Holder Hub
                  </SizableText>
                </XStack>
              </Tabs.Tab>
              <Tabs.Tab
                value="insights"
                flex={1}
                backgroundColor="transparent"
                borderWidth={0}
                paddingVertical="$3"
                paddingHorizontal="$4"
                disabled
                opacity={0.5}
              >
                <XStack gap="$2" alignItems="center" justifyContent="center">
                  <BarChart3 size={18} color="$color11" />
                  <SizableText size="$3" color="$color11">
                    Insights
                  </SizableText>
                </XStack>
              </Tabs.Tab>
            </Tabs.List>
            {/* Tab Content */}
            <Tabs.Content value="overview" flex={1} overflowBlock="hidden" height="100%">
              <ScrollView flex={1}>
                <OverviewTab event={event} />
              </ScrollView>
            </Tabs.Content>
            <Tabs.Content value="holder-hub" flex={1} overflowBlock="hidden" height="100%">
              <ScrollView flex={1}>
                <HolderHubTab event={event} />
              </ScrollView>
            </Tabs.Content>
            <Tabs.Content value="insights" flex={1} overflowBlock="hidden" height="100%">
              <ScrollView flex={1}>
                <InsightsTab event={event} />
              </ScrollView>
            </Tabs.Content>
          </Tabs>
        </YStack>
      </View>
    </Theme>
  );
};
