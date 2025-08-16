import { Button, ButtonProps, Spinner, useTheme, View } from '@my/ui';

export interface LoadingButtonProps extends ButtonProps {
  /**
   * The text to display on the button
   */
  label: string;
  /**
   * Whether the button is in a loading state
   */
  isLoading?: boolean;
  /**
   * The text to display when loading (defaults to label if not provided)
   */
  loadingLabel?: string;
  /**
   * Whether to show the icon during loading state
   */
  showIconWhenLoading?: boolean;
}

/**
 * A reusable button component that shows loading state with spinner
 * Can be used throughout the application for consistent loading button UX
 */
export const LoadingButton = ({
  label,
  isLoading = false,
  loadingLabel,
  icon,
  showIconWhenLoading = false,
  disabled,
  themeInverse,
  ...props
}: LoadingButtonProps) => {
  const displayLabel = isLoading ? loadingLabel || label : label;

  return (
    <Button icon={icon} themeInverse={themeInverse} disabled={disabled || isLoading} {...props}>
      <View
        flexDirection="row"
        gap="$3"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        <View
          animation="bouncy"
          enterStyle={{
            transform: [{ translateX: 15 }],
          }}
          transform={[
            {
              translateX: isLoading ? 0 : 15,
            },
          ]}
        >
          <Button.Text fontWeight="600">{displayLabel}</Button.Text>
        </View>
        <View
          animation="bouncy"
          enterStyle={{
            opacity: 0,
            scale: 0.8,
          }}
          opacity={isLoading ? 1 : 0}
          scale={isLoading ? 1 : 0.8}
        >
          <Spinner color="$color11" key="loading-spinner" animation="slow" />
        </View>
      </View>
    </Button>
  );
};
