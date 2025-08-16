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
  const shouldShowIcon = icon && (!isLoading || showIconWhenLoading);

  return (
    <Button disabled={disabled || isLoading} {...props}>
      <View
        animation="bouncy"
        flexDirection="row"
        x={isLoading ? 0 : 15}
        gap="$3"
        alignItems="center"
        justifyContent="center"
      >
        <Button.Text fontWeight="600">{displayLabel}</Button.Text>
        <Button.Icon>
          {shouldShowIcon ? (
            <View>{icon}</View>
          ) : (
            <Spinner
              key="loading-spinner"
              animation="slow"
              enterStyle={{
                scale: 1,
              }}
              exitStyle={{
                scale: 1,
              }}
              opacity={isLoading ? 1 : 0}
            />
          )}
        </Button.Icon>
      </View>
    </Button>
  );
};
