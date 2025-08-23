import { Button, YStack, Link } from '@my/ui';
import { usePathname } from 'app/utils';

interface MainButtonTabProps {
  type: 'main';
  mainButtonAction: () => void;
  Icon: React.ComponentProps<typeof Button>['icon'];
}

interface LinkTabProps {
  type: 'link';
  href: string;
  Icon: React.ComponentProps<typeof Button>['icon'];
}

type BottomTabProps = MainButtonTabProps | LinkTabProps;

export const BottomTab = (props: BottomTabProps) => {
  const pathname = usePathname();

  // Determine if the route is active based on pathname matching
  const isActive = props.type === 'link' && pathname === props.href;

  return (
    <YStack flex={1} alignItems="center" justifyContent="center" minWidth={0} position="relative">
      {props.type === 'main' ? (
        // Center button with special styling
        <YStack position="absolute" bottom={0}>
          <Button
            theme="green"
            pressStyle={{
              elevation: 2,
              scale: 0.95,
            }}
            animation="100ms"
            elevation={15}
            circular={props.type === 'main'}
            onPress={props.mainButtonAction}
            icon={props.Icon}
            size="$6"
          />
        </YStack>
      ) : (
        // Regular tabs
        <Link asChild href={props.href}>
          <Button
            size="$4"
            scaleIcon={1.5}
            chromeless
            icon={props.Icon}
            color={isActive ? '$color12' : '$color10'}
          />
        </Link>
      )}
    </YStack>
  );
};
