import { useTheme, getTokens } from '@my/ui';

export interface NumberInputProps {
  id?: string;
  value?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  ref?: React.RefObject<HTMLInputElement>;
  style?: React.CSSProperties;
}

export const NumberInput = ({
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder,
  ref,
  style,
  ...props
}: NumberInputProps) => {
  const theme = useTheme();
  const tokens = getTokens();

  return (
    <input
      id={id}
      ref={ref}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      type="number"
      placeholder={placeholder}
      style={{
        padding: tokens.space.$3.val,
        backgroundColor: theme.color4.val,
        borderColor: theme.color5.val,
        borderRadius: tokens.radius.$4.val,
        border: `1px solid ${theme.color5.val}`,
        fontSize: '14px',
        fontFamily: 'inherit',
        ...style,
      }}
      {...props}
    />
  );
};
