'use client';

import { api } from '@my/backend/_generated/api';
import { Id } from '@my/backend/_generated/dataModel';
import { useMutation, useQuery } from '@my/backend/react';
import {
  YStack,
  XStack,
  Avatar,
  H2,
  H4,
  Paragraph,
  Button,
  Text,
  Card,
  Separator,
  Form,
  useToastController,
  ScrollView,
  TextArea,
  Tabs,
  SizableText,
} from '@my/ui';
import {
  Edit3,
  Mail,
  Save,
  User,
  Link2,
  IdCard,
  WalletMinimal,
  Phone,
  X,
} from '@tamagui/lucide-icons';
import { useAppForm } from 'app/shared/lib/form';
import { SkeletonLine } from 'app/shared/ui/SkeletonLine';
import { useState } from 'react';

// Helper function to safely get error message
const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return 'Invalid input';
};

export const ProfileScreen = ({ id }: { id: string }) => {
  const profile = useQuery(api.users.getUserById, {
    userId: id as Id<'users'>,
  });
  const linkedAccounts = useQuery(api.linkedAccounts.getLinkedAccountsByUserId, {
    userId: id as Id<'users'>,
  });

  const updateUserProfile = useMutation(api.users.updateUserProfile);

  const toast = useToastController();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Initialize form with default values from profile or defaults
  const form = useAppForm({
    defaultValues: {
      bio: profile?.bio ?? 'Hi, there!',
    },
    onSubmit: async ({ value }) => {
      try {
        // Here you would implement the actual save logic
        console.log('Saving changes:', value);

        // Simulate API call
        await updateUserProfile({
          userId: id as Id<'users'>,
          bio: value.bio,
        });

        toast.show('Profile updated successfully!', {
          type: 'success',
          preset: 'success',
        });

        setIsEditing(false);
      } catch {
        toast.show('Failed to update profile', {
          type: 'error',
          preset: 'error',
        });
      }
    },
  });

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  return (
    <YStack width="100%" maxWidth={800} marginInline="auto" height="100%" gap="$4" px="$4" py="$4">
      {/* Avatar Section - Fixed */}
      <YStack alignItems="center" gap="$2">
        <Avatar size="$12" circular>
          {profile?.pfpUrl ? (
            <Avatar.Image src={profile.pfpUrl} />
          ) : (
            <Avatar.Fallback backgroundColor="$color2" />
          )}
        </Avatar>

        {/* Name and Title */}
        <YStack alignItems="center">
          {profile ? (
            <>
              <H2 fontSize="$8" fontWeight="700" textAlign="center">
                {profile.displayName}
              </H2>
              <Paragraph fontSize="$4" color="$color10" textAlign="center">
                @{profile.username}
              </Paragraph>
            </>
          ) : (
            <YStack alignItems="center" gap="$1">
              <SkeletonLine width={90} height={20} />
              <SkeletonLine width={90} height={20} />
            </YStack>
          )}
        </YStack>
      </YStack>

      {/* Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        flexDirection="column"
        height="100%"
        flex={1}
        size="$3"
      >
        <Tabs.List mb="$4" borderWidth={1} borderColor="$borderColor" width="100%">
          <Tabs.Tab value="profile" $sm={{ flexBasis: '50%' }}>
            <XStack gap="$2" alignItems="center">
              <User size={16} />
              <SizableText>Profile</SizableText>
            </XStack>
          </Tabs.Tab>
          <Tabs.Tab value="linked-accounts" $sm={{ flexBasis: '50%' }}>
            <XStack gap="$2" alignItems="center">
              <Link2 size={16} />
              <SizableText>Linked accounts</SizableText>
            </XStack>
          </Tabs.Tab>
        </Tabs.List>

        {/* Profile Tab Content */}
        <Tabs.Content value="profile" flex={1}>
          <XStack alignItems="center" justifyContent="space-between" mb="$3">
            <H4 fontSize="$6" fontWeight="600" color="$gray12">
              Information
            </H4>
            {!isEditing && (
              <Button
                size="$3"
                circular
                borderWidth={0}
                chromeless
                onPress={() => setIsEditing(true)}
              >
                <Edit3 size={20} />
              </Button>
            )}
            {isEditing && <YStack width={40} />}
          </XStack>

          <ScrollView flex={1} contentContainerStyle={{ paddingBottom: 24 }}>
            <YStack gap="$4" width="100%">
              <Card backgroundColor="$background" borderRadius="$4" padding="$4">
                <YStack gap="$4">
                  {/* Bio */}
                  <form.AppForm>
                    <Form
                      onSubmit={() => {
                        console.log('form state', { formState: form.state });
                        form.handleSubmit();
                      }}
                    >
                      <form.Field
                        name="bio"
                        validators={{
                          onChange: ({ value }) => {
                            if (!value) return undefined;
                            if (value.length > 500) return 'Bio must be less than 500 characters';
                            return undefined;
                          },
                        }}
                        children={(field) => (
                          <XStack alignItems="flex-start" gap="$3" paddingVertical="$2">
                            <Mail size={15} color="$color10" mt="$1.5" />
                            <YStack flex={1}>
                              <Text fontSize="$3" color="$gray10" marginBottom="$1">
                                Bio
                              </Text>
                              {isEditing ? (
                                <YStack>
                                  <TextArea
                                    value={field.state.value || ''}
                                    onChangeText={field.handleChange}
                                    onBlur={field.handleBlur}
                                    placeholder="Tell us about yourself..."
                                    size="$3"
                                    borderWidth={1}
                                    borderColor={
                                      field.state.meta.errors.length > 0 ? '$red8' : '$color9'
                                    }
                                    minHeight={80}
                                  />
                                  {field.state.meta.errors.length > 0 && (
                                    <Text fontSize="$2" color="$red10" marginTop="$1">
                                      {getErrorMessage(field.state.meta.errors[0])}
                                    </Text>
                                  )}
                                </YStack>
                              ) : (
                                <Text fontSize="$4" color="$gray12">
                                  {field.state.value}
                                </Text>
                              )}
                            </YStack>
                          </XStack>
                        )}
                      />

                      {isEditing && (
                        <XStack gap="$2" alignItems="center" justifyContent="space-between" mt="$4">
                          <Button
                            fontWeight="600"
                            icon={X}
                            variant="outlined"
                            onPress={handleCancel}
                            width="48%"
                          >
                            Cancel
                          </Button>
                          <Form.Trigger asChild>
                            <form.SubmitButton
                              fontWeight="600"
                              borderRadius="$4"
                              icon={Save}
                              themeInverse
                              label="Save"
                              width="48%"
                            />
                          </Form.Trigger>
                        </XStack>
                      )}
                    </Form>
                  </form.AppForm>

                  <Separator />
                </YStack>
              </Card>
            </YStack>
          </ScrollView>
        </Tabs.Content>

        {/* Linked Accounts Tab Content */}
        <Tabs.Content value="linked-accounts" flex={1}>
          <H4 fontSize="$6" fontWeight="600" color="$gray12" mb="$3">
            Linked Accounts
          </H4>

          <ScrollView flex={1} contentContainerStyle={{ paddingBottom: 24 }}>
            <YStack gap="$4" width="100%">
              <Card backgroundColor="$background" borderRadius="$4" padding="$4">
                <YStack gap="$4">
                  {linkedAccounts?.map((linkedAccount) => {
                    if (linkedAccount.account.protocol === 'farcaster') {
                      return (
                        <XStack
                          alignItems="flex-start"
                          gap="$3"
                          paddingVertical="$2"
                          key={linkedAccount._id}
                        >
                          <IdCard size={15} color="$color10" mt="$1.5" />
                          <YStack flex={1}>
                            <Text fontSize="$3" color="$color10" marginBottom="$1">
                              {linkedAccount.account.protocol}
                            </Text>
                            <Text fontSize="$4" color="$color12">
                              @{linkedAccount.account.username}
                            </Text>
                          </YStack>
                          <YStack justifyContent="center" themeInverse>
                            <Button size="$3">Sync using Farcaster</Button>
                          </YStack>
                        </XStack>
                      );
                    } else if (linkedAccount.account.protocol === 'wallet') {
                      return (
                        <XStack
                          alignItems="flex-start"
                          gap="$3"
                          paddingVertical="$2"
                          key={linkedAccount._id}
                        >
                          <WalletMinimal size={15} color="$color10" mt="$1.5" />
                          <YStack flex={1}>
                            <Text fontSize="$3" color="$color10" marginBottom="$1">
                              {linkedAccount.account.protocol}
                            </Text>
                            <Text fontSize="$4" color="$color12">
                              @{linkedAccount.account.address}
                            </Text>
                          </YStack>
                        </XStack>
                      );
                    } else if (linkedAccount.account.protocol === 'email') {
                      return (
                        <XStack
                          alignItems="flex-start"
                          gap="$3"
                          paddingVertical="$2"
                          key={linkedAccount._id}
                        >
                          <Mail size={15} color="$color10" mt="$1.5" />
                          <YStack flex={1}>
                            <Text fontSize="$3" color="$color10" marginBottom="$1">
                              {linkedAccount.account.protocol}
                            </Text>
                            <Text fontSize="$4" color="$color12">
                              {linkedAccount.account.email}
                            </Text>
                          </YStack>
                        </XStack>
                      );
                    } else if (linkedAccount.account.protocol === 'phone') {
                      return (
                        <XStack
                          alignItems="flex-start"
                          gap="$3"
                          paddingVertical="$2"
                          key={linkedAccount._id}
                        >
                          <Phone size={15} color="$color10" mt="$1.5" />
                          <YStack flex={1}>
                            <Text fontSize="$3" color="$color10" marginBottom="$1">
                              {linkedAccount.account.protocol}
                            </Text>
                            <Text fontSize="$4" color="$color12">
                              {linkedAccount.account.phone}
                            </Text>
                          </YStack>
                        </XStack>
                      );
                    } else {
                      return (
                        <SizableText key={linkedAccount._id}>Unknown account type</SizableText>
                      );
                    }
                  })}

                  <Separator />
                </YStack>
              </Card>
            </YStack>
          </ScrollView>
        </Tabs.Content>
      </Tabs>
    </YStack>
  );
};
