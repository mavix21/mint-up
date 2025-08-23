'use client';
import { useViewProfile } from '@coinbase/onchainkit/minikit';
import { api } from '@my/backend/_generated/api';
import { useQuery } from '@my/backend/react';
import { YStack, XStack, Avatar, H2, Paragraph, Button, Text } from '@my/ui';
import { useSession } from 'next-auth/react';

export const ProfileScreen = () => {
  const { data: session } = useSession();
  const profile = useQuery(api.users.getUserByFid, {
    fid: session?.user.fid ?? 0,
  });

  const viewProfile = useViewProfile();

  return (
    <YStack flex={1}>
      {/* Profile Content */}
      <YStack flex={1} alignItems="center" paddingHorizontal="$6" paddingTop="$4" gap="$4">
        {/* Profile Avatar */}
        <Avatar size="$12" circular>
          <Avatar.Image src={profile?.pfpUrl ?? ''} />
          <Avatar.Fallback>
            <Text fontSize="$9" fontWeight="600">
              OC
            </Text>
          </Avatar.Fallback>
        </Avatar>

        {/* User Information */}
        <YStack gap="$2" alignItems="center">
          {/* Full Name */}
          <H2 fontSize="$8" fontWeight="700" textAlign="center">
            {profile?.displayName ?? 'Guest'}
          </H2>

          {/* Username */}
          <Paragraph fontSize="$4" color="$color10" textAlign="center">
            {profile?.username ?? '@guest'}
          </Paragraph>
        </YStack>

        {/* Bio */}
        <Paragraph fontSize="$4" color="$color" textAlign="center" lineHeight="$5" maxWidth={280}>
          {profile?.bio ?? 'No bio yet'}
        </Paragraph>

        {/* Action Buttons */}
        <XStack marginTop="$4" alignItems="center">
          <Button
            size="$4"
            fontWeight="600"
            borderRadius="$8"
            paddingHorizontal="$6"
            onPress={() => viewProfile()}
          >
            View my profile on Farcaster
          </Button>
        </XStack>
      </YStack>
    </YStack>
  );
};
