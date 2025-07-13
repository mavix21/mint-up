import { createElement } from 'react';
import { getTokens, useTheme } from 'tamagui';

interface TimePickerProps {
  value: string | undefined;
  onChangeText: (value: string) => void;
  disabled: boolean;
  placeholderTextColor: string;
  onBlur: () => void;
  id: string;
  ref: React.Ref<HTMLInputElement>;
}

export function TimePicker({
  value,
  onChangeText,
  disabled,
  placeholderTextColor,
  onBlur,
  id,
  ref: inputRef,
}: TimePickerProps) {
  const theme = useTheme();

  return createElement('input', {
    type: 'time',
    value: value || '',
    onChange: (e) => onChangeText(e.target.value),
    disabled,
    onBlur,
    ref: inputRef,
    id,
    style: {
      width: '100%',
      color: placeholderTextColor,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.borderColor.val,
      padding: getTokens().space[2].val,
      borderRadius: getTokens().radius.$true.val,
    },
  });
}
