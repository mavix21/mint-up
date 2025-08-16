import { Authenticated } from '@my/backend/react';
import { Button, Popover, styled, Text, View } from '@my/ui';
import { LogOut, Settings } from '@tamagui/lucide-icons';
import { signOut } from 'next-auth/react';

interface SettingsDropdownProps {
  triggerOpen: boolean;
  setTriggerOpen: (open: boolean) => void;
}

export function SettingsDropdown({ triggerOpen, setTriggerOpen }: SettingsDropdownProps) {
  const logout = signOut;

  const handleLogout = () => {
    logout();
    setTriggerOpen(false);
  };

  return (
    <Popover
      offset={{ mainAxis: 5 }}
      placement="bottom-end"
      open={triggerOpen}
      onOpenChange={setTriggerOpen}
    >
      <Popover.Trigger asChild>
        <Button circular chromeless icon={<Settings size={16} />} />
      </Popover.Trigger>
      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        backgroundColor="$color2"
        minWidth={100}
        p="$0"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
        elevation={5}
        overflow="hidden"
      >
        <DropdownItem>
          <Settings size={14} color="$color10" />
          <DropdownText>Settings</DropdownText>
        </DropdownItem>

        <Authenticated>
          <DropdownItem onPress={handleLogout}>
            <LogOut size={14} color="$color10" />
            <DropdownText>Logout</DropdownText>
          </DropdownItem>
        </Authenticated>
      </Popover.Content>
    </Popover>
  );
}

const DropdownItem = styled(View, {
  backgroundColor: '$color2',
  width: '100%',
  hoverStyle: {
    backgroundColor: '$color4',
  },
  pressStyle: {
    backgroundColor: '$color4',
  },
  cursor: 'pointer',
  paddingHorizontal: '$4',
  paddingVertical: '$2',
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexDirection: 'row',
  gap: '$2',
});

const DropdownText = styled(Text, {
  fontWeight: '$2',
  lineHeight: '$2',
  fontSize: '$2',
  $xs: {
    fontWeight: '$1',
    lineHeight: '$1',
    fontSize: '$1',
  },
});
