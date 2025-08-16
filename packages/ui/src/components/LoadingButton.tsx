import { Button, ButtonProps, Spinner, View } from '@my/ui';

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
  ...props
}: LoadingButtonProps) => {
  const displayLabel = isLoading ? loadingLabel || label : label;

  return (
    <Button disabled={disabled || isLoading} {...props}>
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
            transform: [{ translateX: isLoading ? 15 : 0 }],
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
            opacity: isLoading ? 0 : 1,
            scale: isLoading ? 0.8 : 1,
          }}
          opacity={isLoading ? 1 : 0}
          scale={isLoading ? 1 : 0.8}
        >
          <Spinner key="loading-spinner" animation="slow" />
        </View>
      </View>
    </Button>
  );
};
