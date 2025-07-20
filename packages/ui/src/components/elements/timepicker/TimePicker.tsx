import React, { useState } from 'react';
import {
  Popover,
  YStack,
  Button,
  Paragraph,
  useTheme,
  getTokens,
  XStack,
  isWebTouchable,
} from 'tamagui';

interface TimeInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  id?: string;
  ref?: React.Ref<any>;
  fill?: boolean;
  onBlur?: () => void;
}

const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  ({ value, onChange, disabled, id, onBlur, fill = false }, ref) => {
    const theme = useTheme();
    const tokens = getTokens();

    return (
      <input
        type="time"
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
        id={id}
        ref={ref}
        onBlur={onBlur}
        style={{
          width: fill ? '100%' : 'fit-content',
          minWidth: tokens.size.$4.val,
          textAlign: fill ? 'center' : 'left',
          padding: tokens.space.$2.val,
          fontSize: '14px',
          color: theme.color.val,
          backgroundColor: theme.color6.val,
          borderRadius: tokens.radius.$4.val,
          appearance: 'none',
          fontVariantNumeric: 'tabular-nums',
        }}
      />
    );
  }
);

interface TimePickerProps {
  value?: string;
  onChangeText?: (value: string) => void;
  disabled?: boolean;
  placeholderTextColor?: string;
  onBlur?: () => void;
  id?: string;
  ref?: React.Ref<any>;
}

interface TimeOption {
  value: string;
  label: string;
}

// Generate time options from 12:00 AM to 11:30 PM in 30-minute intervals
const generateTimeOptions = (): TimeOption[] => {
  const times: TimeOption[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const date = new Date();
      date.setHours(hour, minute, 0, 0);

      const timeString = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      // Format for 24-hour time (HH:mm) for the value
      const value = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

      times.push({ value, label: timeString });
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

const TimeOptionsList = ({
  timeValue,
  handleTimeOptionSelect,
}: {
  timeValue: string;
  handleTimeOptionSelect: (value: string) => void;
}) => (
  <YStack maxHeight={200} overflow="scroll">
    {timeOptions.map((option, index) => (
      <YStack
        key={option.value}
        padding="$2"
        borderRadius="$2"
        cursor="pointer"
        hoverStyle={{
          backgroundColor: '$color4',
        }}
        pressStyle={{
          backgroundColor: '$color5',
        }}
        backgroundColor={timeValue === option.value ? '$color5' : 'transparent'}
        onPress={() => handleTimeOptionSelect(option.value)}
      >
        <XStack alignItems="center" justifyContent="center" gap="$2" position="relative">
          <Paragraph textAlign="center">{option.label}</Paragraph>
        </XStack>
      </YStack>
    ))}
  </YStack>
);

export function TimePicker({
  value,
  onChangeText,
  disabled = false,
  placeholderTextColor = '$color',
  onBlur,
  id,
  ref: inputRef,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const [timeValue, setTimeValue] = useState(value || '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTimeValue(newValue);
    if (onChangeText) {
      onChangeText(newValue);
    }
  };

  const handleTimeOptionSelect = (selectedValue: string) => {
    setTimeValue(selectedValue);
    if (onChangeText) {
      onChangeText(selectedValue);
    }
    setOpen(false);
    if (onBlur) {
      onBlur();
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && onBlur) {
      onBlur();
    }
  };

  // On mobile browsers, just render the native time input without the popover
  if (isWebTouchable) {
    return (
      <TimeInput
        value={timeValue}
        onChange={handleInputChange}
        disabled={disabled}
        id={id}
        ref={inputRef}
        onBlur={onBlur}
      />
    );
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <Button onPress={() => setOpen(true)} unstyled>
          <TimeInput
            value={timeValue}
            onChange={handleInputChange}
            disabled={disabled}
            id={id}
            ref={inputRef}
            onBlur={onBlur}
          />
        </Button>
      </Popover.Trigger>

      <Popover.Content zIndex={200000} p="$2" backgroundColor="$color1">
        <Popover.ScrollView>
          <TimeOptionsList timeValue={timeValue} handleTimeOptionSelect={handleTimeOptionSelect} />
        </Popover.ScrollView>
      </Popover.Content>

      {/* <Adapt when="md" platform="touch">
        <Popover.Sheet modal dismissOnSnapToBottom snapPoints={[35]} position={0} zIndex={200000}>
          <Popover.Sheet.Frame>
            <Popover.Sheet.ScrollView backgroundColor="$color2">
              <YStack padding="$4" gap="$4">
                <TimeInput
                  value={timeValue}
                  onChange={handleInputChange}
                  disabled={disabled}
                  id={id}
                  ref={inputRef}
                  onBlur={onBlur}
                  fill
                />
                <TimeOptionsList
                  timeValue={timeValue}
                  handleTimeOptionSelect={handleTimeOptionSelect}
                />
              </YStack>
            </Popover.Sheet.ScrollView>
          </Popover.Sheet.Frame>
          <Popover.Sheet.Overlay />
        </Popover.Sheet>
      </Adapt> */}
    </Popover>
  );
}
