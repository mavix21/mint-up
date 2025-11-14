import {
  Button,
  Card,
  Chip,
  Form,
  H5,
  Input,
  Link,
  Paragraph,
  SizableText,
  Text,
  ToggleGroup,
  View,
  XStack,
  YStack,
} from '@my/ui';
import { BriefcaseBusiness, Edit3, Link2, Save, Tags, X } from '@tamagui/lucide-icons';

import type { ProfessionalProfileRole } from '../model/professional-profile-form';

type ProfessionalProfileViewModel = {
  worksAt?: string;
  roles?: ProfessionalProfileRole[];
  professionalLink?: string;
};

export interface ProfessionalProfileSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  roles: readonly ProfessionalProfileRole[];
  viewModel: ProfessionalProfileViewModel;
}

export function ProfessionalProfileSection({
  form,
  isEditing,
  onEdit,
  onCancel,
  roles,
  viewModel,
}: ProfessionalProfileSectionProps) {
  const allowedRoles = new Set<string>(roles);

  return (
    <Card backgroundColor="$color2" borderRadius="$4" padding="$4">
      <YStack gap="$4">
        <XStack alignItems="center" justifyContent="space-between">
          <H5 color="$color12">My Professional Profile</H5>
          {!isEditing ? (
            <Button size="$3" circular borderWidth={0} chromeless onPress={onEdit}>
              <Edit3 size={20} />
            </Button>
          ) : (
            <View height="$3" />
          )}
        </XStack>

        <Paragraph color="$color10">
          Share a snapshot of your professional identity once and reuse it across every event.
        </Paragraph>

        <form.AppForm>
          <Form onSubmit={form.handleSubmit} gap="$4">
            <form.Field
              name="worksAt"
              validators={{
                onChange: ({ value }) =>
                  getStringValue(value).length > 100
                    ? 'Company or protocol name must be less than 100 characters'
                    : undefined,
              }}
            >
              {(field) => {
                const currentValue = getStringValue(field.state.value);

                return (
                  <FieldRow
                    icon={<BriefcaseBusiness size={15} color="$color10" />}
                    label="I work at"
                    isEditing={isEditing}
                  >
                    {isEditing ? (
                      <Input
                        value={currentValue}
                        onChangeText={(text) => field.handleChange(text)}
                        onBlur={field.handleBlur}
                        placeholder="Add the team, protocol, or company"
                      />
                    ) : (
                      <ReadonlyValue
                        value={viewModel.worksAt}
                        emptyMessage="Let others know where you work"
                      />
                    )}
                    <FieldErrorMessage errors={field.state.meta.errors} />
                  </FieldRow>
                );
              }}
            </form.Field>

            <form.Field name="roles">
              {(field) => {
                const currentRoles = getRoleValues(field.state.value, allowedRoles);

                return (
                  <FieldRow
                    icon={<Tags size={15} color="$color10" />}
                    label="My Role"
                    isEditing={isEditing}
                  >
                    {isEditing ? (
                      <ToggleGroup
                        type="multiple"
                        orientation="horizontal"
                        flexWrap="wrap"
                        gap="$2"
                        value={currentRoles}
                        onValueChange={(next) =>
                          field.handleChange(
                            getRoleValues(next ?? [], allowedRoles) as ProfessionalProfileRole[]
                          )
                        }
                      >
                        {roles.map((role) => {
                          const isSelected = currentRoles.includes(role);
                          return (
                            <ToggleGroup.Item
                              key={role}
                              value={role}
                              borderRadius="$4"
                              paddingHorizontal="$3"
                              paddingVertical="$2"
                              borderWidth={isSelected ? 2 : 1}
                              borderColor={isSelected ? '$color8' : '$color6'}
                              backgroundColor={isSelected ? '$color5' : '$color3'}
                              hoverStyle={{ backgroundColor: '$color4' }}
                              pressStyle={{ backgroundColor: '$color4' }}
                            >
                              <SizableText size="$3" fontWeight="600">
                                {role}
                              </SizableText>
                            </ToggleGroup.Item>
                          );
                        })}
                      </ToggleGroup>
                    ) : viewModel.roles && viewModel.roles.length > 0 ? (
                      <XStack gap="$2" flexWrap="wrap">
                        {viewModel.roles.map((role) => (
                          <Chip key={role} size="$2" rounded>
                            <Chip.Text fontWeight="600">{role}</Chip.Text>
                          </Chip>
                        ))}
                      </XStack>
                    ) : (
                      <ReadonlyValue
                        value={undefined}
                        emptyMessage="Highlight the roles that describe you"
                      />
                    )}
                    <FieldErrorMessage errors={field.state.meta.errors} />
                  </FieldRow>
                );
              }}
            </form.Field>

            <form.Field
              name="professionalLink"
              validators={{
                onChange: ({ value }) => {
                  const nextValue = getStringValue(value);
                  if (nextValue.length > 2048) {
                    return 'Link is too long';
                  }
                  if (nextValue && !/^https?:\/\//i.test(nextValue)) {
                    return 'Link must start with http or https';
                  }
                  return undefined;
                },
              }}
            >
              {(field) => {
                const currentValue = getStringValue(field.state.value);

                return (
                  <FieldRow
                    icon={<Link2 size={15} color="$color10" />}
                    label="Professional Link"
                    isEditing={isEditing}
                  >
                    {isEditing ? (
                      <Input
                        value={currentValue}
                        onChangeText={(text) => field.handleChange(text)}
                        onBlur={field.handleBlur}
                        placeholder="https://..."
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    ) : viewModel.professionalLink ? (
                      <Link
                        href={viewModel.professionalLink}
                        color="$blue10"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {viewModel.professionalLink}
                      </Link>
                    ) : (
                      <ReadonlyValue
                        value={undefined}
                        emptyMessage="Add a link to your site or socials"
                      />
                    )}
                    <FieldErrorMessage errors={field.state.meta.errors} />
                  </FieldRow>
                );
              }}
            </form.Field>

            {isEditing && (
              <XStack gap="$2" justifyContent="space-between" mt="$2">
                <Button flex={1} theme="red" fontWeight="600" icon={X} onPress={onCancel}>
                  Cancel
                </Button>
                <Form.Trigger asChild>
                  <Button flex={1} fontWeight="600" borderRadius="$4" icon={Save} themeInverse>
                    Save
                  </Button>
                </Form.Trigger>
              </XStack>
            )}
          </Form>
        </form.AppForm>
      </YStack>
    </Card>
  );
}

interface FieldRowProps {
  icon: React.ReactNode;
  label: string;
  isEditing: boolean;
  children: React.ReactNode;
}

function FieldRow({ icon, label, isEditing, children }: FieldRowProps) {
  return (
    <YStack gap="$2">
      <XStack alignItems="center" gap="$2">
        {icon}
        <SizableText size="$3" color="$gray10">
          {label}
        </SizableText>
      </XStack>
      <YStack gap="$1">{children}</YStack>
      {!isEditing && <View height={1} backgroundColor="$color3" />}
    </YStack>
  );
}

interface ReadonlyValueProps {
  value?: string;
  emptyMessage: string;
}

function ReadonlyValue({ value, emptyMessage }: ReadonlyValueProps) {
  return (
    <Text fontSize="$3" color={value ? '$gray12' : '$color9'}>
      {value ?? emptyMessage}
    </Text>
  );
}

function FieldErrorMessage({ errors }: { errors: unknown[] }) {
  if (!errors || errors.length === 0) {
    return null;
  }

  const [firstError] = errors;

  return (
    <Text fontSize="$2" color="$red10">
      {typeof firstError === 'string' ? firstError : 'Invalid value'}
    </Text>
  );
}

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value : '');

const getRoleValues = (value: unknown, allowed: ReadonlySet<string>): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((role): role is string => typeof role === 'string' && allowed.has(role));
};
