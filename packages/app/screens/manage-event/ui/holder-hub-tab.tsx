import { api } from '@my/backend/_generated/api';
import { Doc } from '@my/backend/_generated/dataModel';
import { useQuery } from '@my/backend/react';
import { YStack, XStack, SizableText, Button, Card, Separator, ScrollView, Spinner } from '@my/ui';
import { Users, UserCheck, UserX, Download, Mail, MessageSquare } from '@tamagui/lucide-icons';
import { SkeletonLine } from 'app/shared/ui/SkeletonLine';

interface HolderHubTabProps {
  event: Doc<'events'>;
}

export const HolderHubTab = ({ event }: HolderHubTabProps) => {
  // Mock data - in real app this would come from the backend
  const registrations = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      status: 'confirmed',
      registeredAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'pending',
      registeredAt: '2024-01-16',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      status: 'confirmed',
      registeredAt: '2024-01-17',
    },
  ];

  // const confirmedCount = registrations.filter((r) => r.status === 'confirmed').length;
  // const pendingCount = registrations.filter((r) => r.status === 'pending').length;

  const registrationCounts = useQuery(api.registrations.getRegistrationCountsByEventId, {
    eventId: event._id,
  });

  return (
    <ScrollView>
      <YStack gap="$4" padding="$4">
        {/* Statistics Cards */}
        <XStack gap="$3" flexWrap="wrap">
          <Card
            backgroundColor="$background"
            padding="$4"
            borderRadius="$4"
            flex={1}
            minWidth={150}
          >
            <YStack alignItems="center" gap="$2">
              <UserCheck size={24} color="$color10" />
              <SizableText size="$4" fontWeight="bold" color="$color12">
                {registrationCounts ? (
                  registrationCounts.approved
                ) : (
                  <SkeletonLine width={30} height={20} />
                )}
              </SizableText>
              <SizableText size="$2" color="$color11" textAlign="center">
                Confirmed
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
              <UserX size={24} color="$color10" />
              <SizableText size="$4" fontWeight="bold" color="$color12">
                {registrationCounts ? (
                  registrationCounts.pending
                ) : (
                  <SkeletonLine width={30} height={20} />
                )}
              </SizableText>
              <SizableText size="$2" color="$color11" textAlign="center">
                Pending
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
                {registrationCounts ? (
                  registrationCounts.total
                ) : (
                  <SkeletonLine width={30} height={20} />
                )}
              </SizableText>
              <SizableText size="$2" color="$color11" textAlign="center">
                Total
              </SizableText>
            </YStack>
          </Card>
        </XStack>

        <Separator />

        {/* Actions */}
        <YStack gap="$3">
          <SizableText size="$5" fontWeight="bold" color="$color12">
            Manage Registrations
          </SizableText>

          <XStack gap="$3" flexWrap="wrap">
            <Button
              backgroundColor="$color3"
              borderColor="$borderColor"
              borderWidth={1}
              icon={<Download size={16} />}
              flex={1}
              minWidth={120}
            >
              <SizableText size="$3">Export List</SizableText>
            </Button>

            <Button
              backgroundColor="$color3"
              borderColor="$borderColor"
              borderWidth={1}
              icon={<Mail size={16} />}
              flex={1}
              minWidth={120}
            >
              <SizableText size="$3">Send Email</SizableText>
            </Button>

            <Button
              backgroundColor="$color3"
              borderColor="$borderColor"
              borderWidth={1}
              icon={<MessageSquare size={16} />}
              flex={1}
              minWidth={120}
            >
              <SizableText size="$3">Send SMS</SizableText>
            </Button>
          </XStack>
        </YStack>

        <Separator />

        {/* Registrations List */}
        <YStack gap="$3">
          <SizableText size="$5" fontWeight="bold" color="$color12">
            Recent Registrations
          </SizableText>

          <YStack gap="$2">
            {registrations.map((registration) => (
              <Card
                key={registration.id}
                backgroundColor="$background"
                padding="$3"
                borderRadius="$3"
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <YStack gap="$1">
                    <SizableText size="$3" fontWeight="bold" color="$color12">
                      {registration.name}
                    </SizableText>
                    <SizableText size="$2" color="$color11">
                      {registration.email}
                    </SizableText>
                    <SizableText size="$2" color="$color10">
                      Registered: {new Date(registration.registeredAt).toLocaleDateString()}
                    </SizableText>
                  </YStack>

                  <XStack gap="$2" alignItems="center">
                    <SizableText
                      size="$2"
                      color={registration.status === 'confirmed' ? '$color10' : '$color9'}
                      fontWeight="bold"
                    >
                      {registration.status.toUpperCase()}
                    </SizableText>
                    <Button
                      size="$2"
                      backgroundColor="$color3"
                      borderColor="$borderColor"
                      borderWidth={1}
                    >
                      <SizableText size="$2">View</SizableText>
                    </Button>
                  </XStack>
                </XStack>
              </Card>
            ))}
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
};
