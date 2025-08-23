'use client';

import { api } from '@my/backend/_generated/api';
import { useQuery } from '@my/backend/react';
import {
  YStack,
  XStack,
  Avatar,
  H2,
  H4,
  Paragraph,
  Button,
  Text,
  Input,
  Card,
  Separator,
  Form,
  useToastController,
  ScrollView,
  TextArea,
} from '@my/ui';
import { Edit3, Mail, Phone, Users, ChevronRight, Save } from '@tamagui/lucide-icons';
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
  const profile = useQuery(api.users.getUserByFid, {
    fid: Number(id),
  });

  const toast = useToastController();

  const [isEditing, setIsEditing] = useState(false);

  // Initialize form with default values from profile or defaults
  const form = useAppForm({
    defaultValues: {
      bio: profile?.bio ?? 'Hi, there!',
      personalEmail: 'michael@example.com',
      phoneNumber: '(209) 555-0104',
      team: 'Project Operation Team',
      leadsBy: 'Darrell Steward',
    },
    onSubmit: async ({ value }) => {
      try {
        // Here you would implement the actual save logic
        console.log('Saving changes:', value);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

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

  return (
    <form.AppForm>
      <Form
        onSubmit={() => {
          console.log('form state', { formState: form.state });
          form.handleSubmit();
        }}
      >
        <YStack height="100%" width="100%" maxWidth={800} gap="$3" px="$4" py="$4">
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

          <XStack alignItems="center" justifyContent="space-between">
            <H4 fontSize="$6" fontWeight="600" color="$gray12">
              Información de contacto
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

          <ScrollView flex={1} contentContainerStyle={{ paddingBottom: 20 }}>
            <YStack gap="$4" marginHorizontal="auto" width="100%">
              {/* Contact Information Section Header */}

              <Card backgroundColor="$background" borderRadius="$4" padding="$4">
                <YStack gap="$4">
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
                      <XStack alignItems="center" gap="$3" paddingVertical="$2">
                        <Mail size={20} color="$gray10" />
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

                  <Separator />
                </YStack>
              </Card>

              {/* Farcaster Profile Button */}
              {/* <Button
                size="$4"
                fontWeight="600"
                borderRadius="$4"
                backgroundColor="$blue8"
                color="white"
                onPress={() => {}}
                marginTop="$2"
              >
                Ver mi perfil en Farcaster
              </Button> */}

              {/* Save Button (only visible when editing) */}
              {isEditing && (
                <Form.Trigger asChild>
                  <form.SubmitButton
                    size="$4"
                    fontWeight="600"
                    borderRadius="$4"
                    icon={Save}
                    themeInverse
                    label="Guardar"
                  />
                </Form.Trigger>
              )}
            </YStack>
          </ScrollView>
        </YStack>
      </Form>
    </form.AppForm>
  );
};
