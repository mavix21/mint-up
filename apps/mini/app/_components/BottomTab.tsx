import { Button, YStack } from '@my/ui';

interface BottomTabProps {
  isCenter?: boolean;
  label: string;
  isActive: boolean;
  onClick: () => void;
  Icon: React.ComponentProps<typeof Button>['icon'];
}

export const BottomTab = ({ isCenter, label, isActive, onClick, Icon }: BottomTabProps) => {
  return (
    <YStack flex={1} alignItems="center" justifyContent="center" minWidth={0} position="relative">
      {isCenter ? (
        // Center button with special styling
        <YStack position="absolute" bottom={0}>
          <Button
            backgroundColor="$green11"
            borderColor="$green10"
            borderWidth={1}
            hoverStyle={{ backgroundColor: '$green10', borderColor: '$green10' }}
            pressStyle={{
              backgroundColor: '$green10',
              borderColor: '$green10',
              elevation: 2,
              scale: 0.95,
            }}
            animation="100ms"
            elevation={15}
            circular={isCenter}
            icon={Icon}
            onPress={onClick}
            size="$6"
          />
        </YStack>
      ) : (
        // Regular tabs
        <Button
          onPress={onClick}
          size="$4"
          scaleIcon={1.5}
          chromeless
          icon={Icon}
          color={isActive ? '$color12' : '$color10'}
        />
      )}
    </YStack>
  );
};
