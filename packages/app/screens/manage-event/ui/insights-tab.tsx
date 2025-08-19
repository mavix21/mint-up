import { Doc } from '@my/backend/_generated/dataModel';
import { YStack, XStack, SizableText, Card, Separator, ScrollView } from '@my/ui';
import { TrendingUp, Eye, Share2, Users, Calendar, BarChart3 } from '@tamagui/lucide-icons';

interface InsightsTabProps {
  event: Doc<'events'>;
}

export const InsightsTab = ({ event }: InsightsTabProps) => {
  // Mock analytics data - in real app this would come from the backend
  const analytics = {
    views: 1250,
    shares: 89,
    registrations: 45,
    conversionRate: 3.6,
    topReferrers: [
      { source: 'Social Media', count: 45 },
      { source: 'Direct', count: 32 },
      { source: 'Email', count: 18 },
      { source: 'Search', count: 15 },
    ],
    dailyViews: [
      { date: '2024-01-15', views: 120 },
      { date: '2024-01-16', views: 180 },
      { date: '2024-01-17', views: 95 },
      { date: '2024-01-18', views: 210 },
      { date: '2024-01-19', views: 165 },
      { date: '2024-01-20', views: 140 },
      { date: '2024-01-21', views: 340 },
    ],
  };

  return (
    <ScrollView>
      <YStack gap="$4" padding="$4">
        {/* Key Metrics */}
        <XStack gap="$3" flexWrap="wrap">
          <Card
            backgroundColor="$background"
            padding="$4"
            borderRadius="$4"
            flex={1}
            minWidth={150}
          >
            <YStack alignItems="center" gap="$2">
              <Eye size={24} color="$color10" />
              <SizableText size="$4" fontWeight="bold" color="$color12">
                {analytics.views.toLocaleString()}
              </SizableText>
              <SizableText size="$2" color="$color11" textAlign="center">
                Total Views
              </SizableText>
            </YStack>
          </Card>

          <Card
            backgroundColor="$background"
            padding="$4"
            borderRadius="$4"
            flex={1}
            minWidth={150}
          >
            <YStack alignItems="center" gap="$2">
              <Share2 size={24} color="$color10" />
              <SizableText size="$4" fontWeight="bold" color="$color12">
                {analytics.shares}
              </SizableText>
              <SizableText size="$2" color="$color11" textAlign="center">
                Shares
              </SizableText>
            </YStack>
          </Card>

          <Card
            backgroundColor="$background"
            padding="$4"
            borderRadius="$4"
            flex={1}
            minWidth={150}
          >
            <YStack alignItems="center" gap="$2">
              <Users size={24} color="$color10" />
              <SizableText size="$4" fontWeight="bold" color="$color12">
                {analytics.registrations}
              </SizableText>
              <SizableText size="$2" color="$color11" textAlign="center">
                Registrations
              </SizableText>
            </YStack>
          </Card>

          <Card
            backgroundColor="$background"
            padding="$4"
            borderRadius="$4"
            flex={1}
            minWidth={150}
          >
            <YStack alignItems="center" gap="$2">
              <TrendingUp size={24} color="$color10" />
              <SizableText size="$4" fontWeight="bold" color="$color12">
                {analytics.conversionRate}%
              </SizableText>
              <SizableText size="$2" color="$color11" textAlign="center">
                Conversion
              </SizableText>
            </YStack>
          </Card>
        </XStack>

        <Separator />

        {/* Top Referrers */}
        <Card backgroundColor="$background" padding="$4" borderRadius="$4">
          <YStack gap="$3">
            <SizableText size="$5" fontWeight="bold" color="$color12">
              Top Traffic Sources
            </SizableText>

            <YStack gap="$2">
              {analytics.topReferrers.map((referrer, index) => (
                <XStack key={referrer.source} justifyContent="space-between" alignItems="center">
                  <XStack gap="$2" alignItems="center">
                    <SizableText size="$3" color="$color10" fontWeight="bold">
                      {index + 1}.
                    </SizableText>
                    <SizableText size="$3" color="$color12">
                      {referrer.source}
                    </SizableText>
                  </XStack>
                  <SizableText size="$3" color="$color11" fontWeight="bold">
                    {referrer.count}
                  </SizableText>
                </XStack>
              ))}
            </YStack>
          </YStack>
        </Card>

        <Separator />

        {/* Daily Views Chart */}
        <Card backgroundColor="$background" padding="$4" borderRadius="$4">
          <YStack gap="$3">
            <SizableText size="$5" fontWeight="bold" color="$color12">
              Daily Views (Last 7 Days)
            </SizableText>

            <YStack gap="$2">
              {analytics.dailyViews.map((day) => (
                <XStack key={day.date} justifyContent="space-between" alignItems="center">
                  <XStack gap="$2" alignItems="center">
                    <Calendar size={16} color="$color10" />
                    <SizableText size="$3" color="$color12">
                      {new Date(day.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </SizableText>
                  </XStack>
                  <XStack gap="$2" alignItems="center">
                    <BarChart3 size={16} color="$color10" />
                    <SizableText size="$3" color="$color11" fontWeight="bold">
                      {day.views}
                    </SizableText>
                  </XStack>
                </XStack>
              ))}
            </YStack>
          </YStack>
        </Card>

        <Separator />

        {/* Performance Summary */}
        <Card backgroundColor="$background" padding="$4" borderRadius="$4">
          <YStack gap="$3">
            <SizableText size="$5" fontWeight="bold" color="$color12">
              Performance Summary
            </SizableText>

            <YStack gap="$2">
              <XStack justifyContent="space-between" alignItems="center">
                <SizableText size="$3" color="$color11">
                  Average Daily Views
                </SizableText>
                <SizableText size="$3" color="$color10" fontWeight="bold">
                  {Math.round(analytics.views / analytics.dailyViews.length)}
                </SizableText>
              </XStack>

              <XStack justifyContent="space-between" alignItems="center">
                <SizableText size="$3" color="$color11">
                  Peak Day
                </SizableText>
                <SizableText size="$3" color="$color10" fontWeight="bold">
                  {new Date(
                    analytics.dailyViews.reduce((max, day) =>
                      day.views > max.views ? day : max
                    ).date
                  ).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </SizableText>
              </XStack>

              <XStack justifyContent="space-between" alignItems="center">
                <SizableText size="$3" color="$color11">
                  Engagement Rate
                </SizableText>
                <SizableText size="$3" color="$color10" fontWeight="bold">
                  {((analytics.shares / analytics.views) * 100).toFixed(1)}%
                </SizableText>
              </XStack>
            </YStack>
          </YStack>
        </Card>
      </YStack>
    </ScrollView>
  );
};
