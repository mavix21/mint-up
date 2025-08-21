import { Chip, Group, Label, Separator, SizableText, XStack, YStack, TimePicker } from '@my/ui';
import { Globe, Clock4, Clock2 } from '@tamagui/lucide-icons';
import { createEventFormOpts } from 'app/screens/create-event/model/shared-form';
import { timezoneUtils, timeUtils } from 'app/shared/lib/date';
import { withForm } from 'app/shared/lib/form';

interface DateTimeFieldsProps {
  minStartDate?: string;
}

export const DateTimeFields = withForm({
  ...createEventFormOpts,
  props: { minStartDate: undefined as string | undefined } as DateTimeFieldsProps,
  render: function DateTimeFields({ minStartDate, form }) {
    const clientTimezone = timezoneUtils.getClientTimezone();

    // Fallbacks used for HTML min attributes if not provided by parent
    const today = timeUtils.getTodayDateString();
    const startMinDate = minStartDate ?? today;

    return (
      <YStack gap="$2">
        <SizableText>Date & Time</SizableText>
        <YStack gap="$2">
          <Group orientation="vertical" size="$2" separator={<Separator />} borderRadius="$4">
            <Group.Item>
              <XStack
                flex={1}
                alignItems="center"
                gap="$2"
                px="$true"
                py="$1.5"
                borderRadius="$true"
                backgroundColor="$color3"
              >
                <XStack alignItems="center" gap="$2" flex={1}>
                  <Clock2 color="$color11" size={16} />
                  <Label htmlFor="start" fontWeight="500" color="$color11">
                    Start
                  </Label>
                </XStack>
                <XStack gap="$4" alignItems="center">
                  <form.AppField
                    name="startDate"
                    children={(field) => {
                      return (
                        <input
                          id="start"
                          type="date"
                          style={{ textAlign: 'center' }}
                          min={startMinDate}
                          value={field.state.value}
                          onChange={(e) => {
                            field.handleChange(e.target.value);
                          }}
                        />
                      );
                    }}
                  />
                  <form.AppField
                    name="startTime"
                    children={(field) => {
                      return (
                        <TimePicker
                          value={field.state.value}
                          onChangeText={(value) => {
                            field.handleChange(value);
                          }}
                        />
                      );
                    }}
                  />
                </XStack>
              </XStack>
            </Group.Item>
            <Group.Item>
              <form.Subscribe selector={(state) => state.errors[0]?.['endTime']?.[0]}>
                {(error) => (
                  <XStack
                    theme={error ? 'red' : null}
                    flex={1}
                    alignItems="center"
                    gap="$2"
                    px="$true"
                    py="$1.5"
                    backgroundColor="$color3"
                  >
                    <XStack alignItems="center" gap="$2" flex={1}>
                      <Clock4 color="$color11" size={16} />
                      <Label htmlFor="end" fontWeight="500" color="$color11">
                        End
                      </Label>
                    </XStack>
                    <XStack gap="$4" alignItems="center">
                      <form.AppField
                        name="endDate"
                        children={(field) => {
                          return (
                            <input
                              id="end"
                              type="date"
                              style={{ textAlign: 'center' }}
                              min={startMinDate}
                              value={field.state.value}
                              onChange={(e) => {
                                field.handleChange(e.target.value);
                              }}
                            />
                          );
                        }}
                      />
                      <form.AppField
                        name="endTime"
                        children={(field) => {
                          return (
                            <TimePicker
                              value={field.state.value}
                              onChangeText={(value) => {
                                field.handleChange(value);
                              }}
                            />
                          );
                        }}
                      />
                    </XStack>
                  </XStack>
                )}
              </form.Subscribe>
            </Group.Item>
            <Group.Item>
              <XStack
                flex={1}
                alignItems="center"
                gap="$2"
                px="$true"
                py="$1.5"
                borderRadius="$true"
                backgroundColor="$color3"
              >
                <XStack alignItems="center" gap="$2" flex={1}>
                  <Globe color="$color11" size={16} />
                  <Label fontWeight="500" color="$color11">
                    Timezone
                  </Label>
                </XStack>
                <XStack gap="$4" alignItems="center">
                  <Chip size="$3" py="$2" borderRadius="$4">
                    <Chip.Text>
                      <SizableText mr="$2">GMT{clientTimezone.offset}</SizableText>
                      <SizableText>{clientTimezone.city}</SizableText>
                    </Chip.Text>
                  </Chip>
                </XStack>
              </XStack>
            </Group.Item>
          </Group>
        </YStack>
      </YStack>
    );
  },
}) as typeof DateTimeFields;
