import { useState, useEffect } from 'react';
import DatePicker from 'react-native-date-picker';
import { Button, SizableText, YStack } from 'tamagui';

function formatTime(date: Date) {
  const hh = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

export const TimePicker = ({
  value,
  onChangeText,
  disabled,
  placeholderTextColor,
  onBlur,
  id,
  ref: inputRef,
  ...props
}) => {
  // Parse value (HH:mm) to Date
  const [date, setDate] = useState(() => {
    if (!value) return new Date();
    const [h, m] = value.split(':');
    const d = new Date();
    d.setHours(Number(h), Number(m), 0, 0);
    return d;
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      const d = new Date();
      d.setHours(Number(h), Number(m), 0, 0);
      setDate(d);
    }
  }, [value]);

  const handleConfirm = (selectedDate: Date) => {
    setOpen(false);
    setDate(selectedDate);
    onChangeText(formatTime(selectedDate));
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <YStack>
      <Button
        onPress={() => setOpen(true)}
        disabled={disabled}
        id={id}
        ref={inputRef}
        theme={disabled ? 'alt2' : undefined}
      >
        <SizableText color={value ? '$color' : placeholderTextColor}>
          {value || 'Select time'}
        </SizableText>
      </Button>
      <DatePicker
        modal
        open={open}
        date={date}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        {...props}
      />
    </YStack>
  );
};
