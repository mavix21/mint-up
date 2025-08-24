import { Button, YStack, Link, Avatar } from '@my/ui';
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

interface ProfileTabProps {
  type: 'profile';
  avatarUrl: string | undefined;
  href: string;
  disabled?: boolean;
}

type BottomTabProps = MainButtonTabProps | LinkTabProps | ProfileTabProps;

export const BottomTab = (props: BottomTabProps) => {
  const pathname = usePathname();

  // Determine if the route is active based on pathname matching
  const isActive =
    (props.type === 'link' && pathname === props.href) ||
    (props.type === 'profile' && pathname === props.href);

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
      ) : props.type === 'profile' ? (
        <Link asChild href={props.href} disabled={props.disabled}>
          <Avatar
            outlineOffset={1}
            outlineStyle={isActive ? 'solid' : 'none'}
            outlineColor="green"
            circular
            size="$3"
            pressStyle={{ elevation: 2, scale: 0.97 }}
            animation="100ms"
          >
            <Avatar.Image src={props.avatarUrl} />
            <Avatar.Fallback bc="$color10" />
          </Avatar>
        </Link>
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
