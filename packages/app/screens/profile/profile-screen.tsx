'use client';

import { api } from '@my/backend/_generated/api';
import { Id } from '@my/backend/_generated/dataModel';
import { useMutation, useQuery } from '@my/backend/react';
import {
  YStack,
  XStack,
  Avatar,
  H2,
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
  View,
  Container,
  H5,
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
  BriefcaseBusiness,
} from '@tamagui/lucide-icons';
import { useAppForm } from 'app/shared/lib/form';
import { SkeletonLine } from 'app/shared/ui/SkeletonLine';
import { useEffect, useState } from 'react';

import {
  PROFESSIONAL_PROFILE_ROLES,
  emptyProfessionalProfileFormValues,
  mapProfessionalProfileToFormValues,
  professionalProfileFormSchema,
} from './model/professional-profile-form';
import { ProfessionalProfileSection } from './ui/ProfessionalProfileSection';

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
  const syncWithFarcaster = useMutation(api.farcaster.syncWithFarcaster);

  const toast = useToastController();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isProfessionalEditing, setIsProfessionalEditing] = useState(false);

  // Initialize form with default values from profile or defaults
  const form = useAppForm({
    defaultValues: {
      bio: profile?.bio ?? 'Hi, there!',
      displayName: profile?.displayName ?? 'Anonymous',
      username: profile?.username ?? 'anonymous',
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

  const professionalProfileForm = useAppForm({
    defaultValues: emptyProfessionalProfileFormValues,
    onSubmit: async ({ value }) => {
      try {
        const parsed = professionalProfileFormSchema.parse(value);
        const sanitizedWorksAt = parsed.worksAt.trim();
        const sanitizedLink = parsed.professionalLink.trim();

        await updateUserProfile({
          userId: id as Id<'users'>,
          professionalProfile: {
            worksAt: sanitizedWorksAt.length > 0 ? sanitizedWorksAt : undefined,
            roles: parsed.roles,
            professionalLink: sanitizedLink.length > 0 ? sanitizedLink : undefined,
          },
        });

        professionalProfileForm.reset({
          worksAt: sanitizedWorksAt,
          roles: parsed.roles,
          professionalLink: sanitizedLink,
        });

        toast.show('Professional profile updated!', {
          type: 'success',
          preset: 'success',
        });

        setIsProfessionalEditing(false);
      } catch (error) {
        console.error('Error updating professional profile:', error);
        toast.show('Failed to update professional profile', {
          type: 'error',
          preset: 'error',
        });
        throw error;
      }
    },
  });

  const syncProfessionalProfileForm = () =>
    mapProfessionalProfileToFormValues(profile?.professionalProfile);

  const handleProfessionalEdit = () => {
    professionalProfileForm.reset(syncProfessionalProfileForm());
    setIsProfessionalEditing(true);
  };

  const handleProfessionalCancel = () => {
    professionalProfileForm.reset(syncProfessionalProfileForm());
    setIsProfessionalEditing(false);
  };

  useEffect(() => {
    if (!profile || isProfessionalEditing) {
      return;
    }

    professionalProfileForm.reset(syncProfessionalProfileForm());
  }, [
    profile?.professionalProfile?.worksAt,
    profile?.professionalProfile?.professionalLink,
    profile?.professionalProfile?.roles?.join('|'),
    isProfessionalEditing,
    professionalProfileForm,
  ]);

  if (profile === null) {
    return (
      <Container center size="wide" gap="$4" px="$4" py="$4">
        <SizableText>No profile found!</SizableText>
      </Container>
    );
  }

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const handleSyncWithFarcaster = async () => {
    setIsSyncing(true);
    try {
      await syncWithFarcaster({
        userId: id as Id<'users'>,
      });

      toast.show('Sync requested!', {
        type: 'success',
        preset: 'success',
        message: 'This may take a few seconds to complete.',
      });
    } catch (error) {
      console.error('Error syncing with Farcaster:', error);
      toast.show('Failed to sync with Farcaster', {
        type: 'error',
        preset: 'error',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Container size="wide" gap="$4" px="$4" pt="$4" overflow="hidden">
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
        overflowBlock="hidden"
        height="100%"
        flex={1}
        size="$3"
      >
        <Tabs.List mb="$4" borderWidth={1} borderColor="$borderColor">
          <Tabs.Tab value="profile" $sm={{ flexBasis: '33.33%' }}>
            <XStack gap="$2" alignItems="center">
              <User size={16} />
              <SizableText>Profile</SizableText>
            </XStack>
          </Tabs.Tab>
          <Tabs.Tab value="professional" $sm={{ flexBasis: '33.33%' }}>
            <XStack gap="$2" alignItems="center">
              <BriefcaseBusiness size={16} />
              <SizableText>Professional</SizableText>
            </XStack>
          </Tabs.Tab>
          <Tabs.Tab value="linked-accounts" $sm={{ flexBasis: '33.33%' }}>
            <XStack gap="$2" alignItems="center">
              <Link2 size={16} />
              <SizableText>Linked accounts</SizableText>
            </XStack>
          </Tabs.Tab>
        </Tabs.List>

        {/* Profile Tab Content */}
        <Tabs.Content value="profile" flex={1} overflowBlock="hidden" height="100%">
          <XStack alignItems="center" justifyContent="space-between" mb="$2">
            <H5 color="$color12">Information</H5>
            <View height="$3">
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
            </View>
            {isEditing && <YStack width={40} />}
          </XStack>

          <ScrollView flex={1} paddingBottom="$4">
            <YStack gap="$4" width="100%">
              <Card backgroundColor="$color2" borderRadius="$4" padding="$4">
                <YStack gap="$4">
                  <form.AppForm>
                    <Form
                      onSubmit={() => {
                        console.log('form state', { formState: form.state });
                        form.handleSubmit();
                      }}
                      gap="$3"
                    >
                      {/* Username */}
                      <form.Field
                        name="username"
                        children={(field) => (
                          <YStack alignItems="flex-start" gap="$2">
                            <XStack alignItems="center" gap="$2">
                              <User size={15} color="$color10" />
                              <SizableText size="$3" color="$gray10">
                                Username
                              </SizableText>
                            </XStack>
                            <YStack flex={1} width="100%">
                              <SizableText size="$4" color="$color12">
                                @{field.state.value}
                              </SizableText>
                            </YStack>
                          </YStack>
                        )}
                      />

                      <Separator />

                      {/* Display Name */}
                      <form.Field
                        name="displayName"
                        children={(field) => (
                          <YStack alignItems="flex-start" gap="$2">
                            <XStack alignItems="center" gap="$2">
                              <User size={15} color="$color10" />
                              <SizableText size="$3" color="$gray10">
                                Display Name
                              </SizableText>
                            </XStack>
                            <YStack flex={1} width="100%">
                              {/* <Input
                                flex={1}
                                value={field.state.value || ''}
                                onChangeText={field.handleChange}
                                onBlur={field.handleBlur}
                                placeholder="Enter your display name"
                              /> */}
                              <SizableText size="$4" color="$color12">
                                {field.state.value}
                              </SizableText>
                            </YStack>
                          </YStack>
                        )}
                      />

                      <Separator />

                      {/* Bio */}
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
                          <YStack alignItems="flex-start" gap="$2">
                            <XStack alignItems="center" gap="$2">
                              <Mail size={15} color="$color10" />
                              <SizableText size="$3" color="$gray10">
                                Bio
                              </SizableText>
                            </XStack>
                            <YStack flex={1} width="100%">
                              {isEditing ? (
                                <YStack flex={1}>
                                  <TextArea
                                    flex={1}
                                    value={field.state.value || ''}
                                    onChangeText={field.handleChange}
                                    onBlur={field.handleBlur}
                                    placeholder="Tell us about yourself..."
                                    size="$3"
                                    borderWidth={1}
                                    borderColor={
                                      field.state.meta.errors.length > 0 ? '$red8' : '$color9'
                                    }
                                    minHeight={120}
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
                          </YStack>
                        )}
                      />

                      {isEditing && (
                        <XStack
                          gap="$2"
                          alignItems="center"
                          flex={1}
                          justifyContent="space-between"
                          mt="$4"
                        >
                          <Button
                            flex={1}
                            theme="red"
                            fontWeight="600"
                            icon={X}
                            onPress={handleCancel}
                          >
                            Cancel
                          </Button>
                          <Form.Trigger asChild>
                            <form.SubmitButton
                              flex={1}
                              fontWeight="600"
                              borderRadius="$4"
                              icon={Save}
                              themeInverse
                              label="Save"
                            />
                          </Form.Trigger>
                        </XStack>
                      )}
                    </Form>
                  </form.AppForm>
                </YStack>
              </Card>
            </YStack>
          </ScrollView>
        </Tabs.Content>

        {/* Professional Tab Content */}
        <Tabs.Content value="professional" flex={1} overflowBlock="hidden" height="100%">
          <XStack alignItems="center" justifyContent="space-between" mb="$2">
            <H5 color="$color12">Professional Profile</H5>
            <View height="$3" />
          </XStack>

          <ScrollView flex={1} paddingBottom="$4">
            <YStack gap="$4" width="100%">
              <ProfessionalProfileSection
                form={professionalProfileForm}
                isEditing={isProfessionalEditing}
                onEdit={handleProfessionalEdit}
                onCancel={handleProfessionalCancel}
                roles={PROFESSIONAL_PROFILE_ROLES}
                viewModel={profile?.professionalProfile ?? {}}
              />
            </YStack>
          </ScrollView>
        </Tabs.Content>

        {/* Linked Accounts Tab Content */}
        <Tabs.Content value="linked-accounts" flex={1}>
          <XStack alignItems="center" justifyContent="space-between" mb="$2">
            <H5 color="$color12">Linked Accounts</H5>
            <View height="$3" />
          </XStack>

          <ScrollView flex={1} contentContainerStyle={{ paddingBottom: 24 }}>
            <YStack gap="$4" width="100%">
              <Card backgroundColor="$background" borderRadius="$4" padding="$4">
                <YStack gap="$4">
                  {linkedAccounts?.map((linkedAccount) => {
                    if (linkedAccount.account.protocol === 'farcaster') {
                      const canSync =
                        linkedAccount.account.lastSyncedAt === undefined ||
                        linkedAccount.account.lastSyncedAt < Date.now() - 1000 * 60 * 60 * 1;

                      return (
                        <YStack alignItems="flex-start" gap="$3" key={linkedAccount._id}>
                          <XStack alignItems="center" gap="$2">
                            <IdCard size={15} color="$color10" />
                            <SizableText size="$3" color="$color10">
                              Farcaster
                            </SizableText>
                          </XStack>
                          <XStack
                            width="100%"
                            flex={1}
                            alignItems="center"
                            jc="space-between"
                            ai="center"
                            gap="$2"
                          >
                            <YStack flex={1}>
                              <SizableText size="$4" color="$color12">
                                @{linkedAccount.account.username}
                              </SizableText>
                            </YStack>
                            <Button
                              theme="purple"
                              onPress={handleSyncWithFarcaster}
                              disabled={!canSync || isSyncing}
                              opacity={!canSync || isSyncing ? 0.5 : 1}
                            >
                              {isSyncing ? 'Syncing...' : 'Sync using Farcaster'}
                            </Button>
                          </XStack>
                        </YStack>
                      );
                    } else if (linkedAccount.account.protocol === 'wallet') {
                      return (
                        <YStack
                          alignItems="flex-start"
                          gap="$3"
                          paddingVertical="$2"
                          key={linkedAccount._id}
                        >
                          <XStack alignItems="center" gap="$2">
                            <WalletMinimal size={15} color="$color10" />
                            <SizableText size="$3" color="$color10">
                              Wallet
                            </SizableText>
                          </XStack>
                          <YStack flex={1}>
                            <SizableText size="$4" color="$color12">
                              @{linkedAccount.account.address}
                            </SizableText>
                          </YStack>
                        </YStack>
                      );
                    } else if (linkedAccount.account.protocol === 'email') {
                      return (
                        <YStack
                          alignItems="flex-start"
                          gap="$3"
                          paddingVertical="$2"
                          key={linkedAccount._id}
                        >
                          <XStack alignItems="center" gap="$2">
                            <Mail size={15} color="$color10" />
                            <SizableText size="$3" color="$color10">
                              Email
                            </SizableText>
                          </XStack>
                          <YStack flex={1}>
                            <SizableText size="$4" color="$color12">
                              {linkedAccount.account.email}
                            </SizableText>
                          </YStack>
                        </YStack>
                      );
                    } else if (linkedAccount.account.protocol === 'phone') {
                      return (
                        <YStack
                          alignItems="flex-start"
                          gap="$3"
                          paddingVertical="$2"
                          key={linkedAccount._id}
                        >
                          <XStack alignItems="center" gap="$2">
                            <Phone size={15} color="$color10" />
                            <SizableText size="$3" color="$color10">
                              Phone
                            </SizableText>
                          </XStack>
                          <YStack flex={1}>
                            <SizableText size="$4" color="$color12">
                              {linkedAccount.account.phone}
                            </SizableText>
                          </YStack>
                        </YStack>
                      );
                    } else {
                      return (
                        <SizableText key={linkedAccount._id}>Unknown account type</SizableText>
                      );
                    }
                  })}
                </YStack>
              </Card>
            </YStack>
          </ScrollView>
        </Tabs.Content>
      </Tabs>
    </Container>
  );
};
