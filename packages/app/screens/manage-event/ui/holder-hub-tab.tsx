import { api } from '@my/backend/_generated/api';
import { Doc, Id } from '@my/backend/_generated/dataModel';
import { useMutation, useQuery } from '@my/backend/react';
import { YStack, XStack, SizableText, Button, Card, Separator, ScrollView, Spinner } from '@my/ui';
import { Users, UserCheck, UserX, X, Check } from '@tamagui/lucide-icons';
import { SkeletonLine } from 'app/shared/ui/SkeletonLine';

interface HolderHubTabProps {
  event: Doc<'events'>;
}

export const HolderHubTab = ({ event }: HolderHubTabProps) => {
  const registrationCounts = useQuery(api.registrations.getRegistrationCountsByEventId, {
    eventId: event._id,
  });

  const registrations = useQuery(api.registrations.getDetailedRegistrationsByEventId, {
    eventId: event._id,
  });

  const approveRegistration = useMutation(api.registrations.approveRegistration);
  const rejectRegistration = useMutation(api.registrations.rejectRegistration);

  const handleApproveRegistration = (registrationId: Id<'registrations'>) => {
    approveRegistration({ registrationId });
  };

  const handleRejectRegistration = (registrationId: Id<'registrations'>) => {
    rejectRegistration({ registrationId });
  };

  return (
    <ScrollView>
      <YStack gap="$4" padding="$4">
        {/* Statistics Cards */}
        <XStack gap="$3" flex={1}>
          <Card backgroundColor="$color2" padding="$4" borderRadius="$4" flex={1} flexBasis="30%">
            <YStack alignItems="center" gap="$2">
              <UserCheck size={24} color="$color11" />
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

          <Card backgroundColor="$color2" padding="$4" borderRadius="$4" flex={1} flexBasis="30%">
            <YStack alignItems="center" gap="$2">
              <UserX size={24} color="$color11" />
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

          <Card backgroundColor="$color2" padding="$4" borderRadius="$4" flex={1} flexBasis="30%">
            <YStack alignItems="center" gap="$2">
              <Users size={24} color="$color11" />
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

        {/* Registrations List */}
        <YStack gap="$3">
          <SizableText size="$5" fontWeight="bold" color="$color12">
            Recent Registrations
          </SizableText>

          <YStack gap="$2">
            {registrations && registrations.length > 0 ? (
              registrations.map((registration) => (
                <Card
                  key={registration.userId}
                  backgroundColor="$background"
                  padding="$3"
                  borderRadius="$3"
                >
                  <XStack justifyContent="space-between" alignItems="center">
                    <YStack gap="$1">
                      <SizableText size="$3" fontWeight="bold" color="$color12">
                        {registration.user.displayName}
                      </SizableText>
                      <SizableText size="$2" color="$color10">
                        Registered: {new Date(registration._creationTime).toLocaleDateString()}
                      </SizableText>
                    </YStack>

                    <XStack gap="$2" alignItems="center">
                      <SizableText
                        size="$2"
                        color={registration.status.type === 'approved' ? '$color12' : '$color9'}
                        fontWeight="bold"
                      >
                        {registration.status.type.toUpperCase()}
                      </SizableText>

                      {registration.status.type === 'pending' && (
                        <XStack gap="$1">
                          <Button
                            size="$2"
                            padding="$1"
                            borderWidth={1}
                            theme="green"
                            onPress={() => {
                              handleApproveRegistration(registration._id);
                            }}
                          >
                            <Check size={12} />
                          </Button>
                          <Button
                            size="$2"
                            padding="$1"
                            borderWidth={1}
                            theme="red"
                            onPress={() => {
                              handleRejectRegistration(registration._id);
                            }}
                          >
                            <X size={12} />
                          </Button>
                        </XStack>
                      )}
                    </XStack>
                  </XStack>
                </Card>
              ))
            ) : registrations === undefined ? (
              <Spinner size="large" />
            ) : (
              <SizableText size="$2" color="$color10">
                No registrations found
              </SizableText>
            )}
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
};
