import { Button, YStack } from '@my/ui';

interface BottomTabProps {
  isCenter?: boolean;
  Icon: React.ReactElement;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const BottomTab = ({ isCenter, Icon, label, isActive, onClick }: BottomTabProps) => {
  return (
    <YStack flex={1} alignItems="center" justifyContent="center" minWidth={0} position="relative">
      {isCenter ? (
        // Center button with special styling
        <YStack position="absolute" bottom={0}>
          <Button circular={isCenter} icon={Icon} onPress={onClick} size="$6" />
        </YStack>
      ) : (
        // Regular tabs
        <Button onPress={onClick} size="$4" chromeless>
          {Icon}
          {/* <span
            className={`text-xs font-medium ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {label}
          </span> */}
        </Button>
      )}
    </YStack>
  );
};
