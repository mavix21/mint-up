import { Label, TextArea, Theme, VisuallyHidden, YStack, getTokens } from '@my/ui';
import { createEventFormOpts } from 'app/screens/create-event/model/shared-form';
import { withForm } from 'app/shared/lib/form';
import { FieldInfo } from 'app/shared/ui/FieldInfo';

export const NameField = withForm({
  ...createEventFormOpts,
  render: function NameField({ form }) {
    const tamaguiTokens = getTokens();
    return (
      <form.Field
        name="name"
        children={(field) => {
          return (
            <Theme
              name={
                field.state.meta.isTouched &&
                !field.state.meta.isValid &&
                field.state.meta.errors.length > 0
                  ? 'red'
                  : null
              }
              forceClassName
            >
              <YStack gap="$1">
                <VisuallyHidden>
                  <Label htmlFor={field.name}>Event Name</Label>
                </VisuallyHidden>
                <TextArea
                  id={field.name}
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  placeholder="Event Name"
                  flexGrow={1}
                  unstyled
                  fontWeight="700"
                  placeholderTextColor="$color7"
                  fontSize={tamaguiTokens.size.$3.val}
                  style={
                    {
                      fieldSizing: 'content',
                    } as any
                  }
                />
                <FieldInfo field={field} />
              </YStack>
            </Theme>
          );
        }}
      />
    );
  },
}) as typeof NameField;
