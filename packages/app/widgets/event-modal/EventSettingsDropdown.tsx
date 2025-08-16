import { Button, styled, Text, View, YStack, Theme } from '@my/ui';
import { MoreVertical } from '@tamagui/lucide-icons';
import { signOut } from 'next-auth/react';

interface EventSettingsDropdownProps {
  triggerOpen: boolean;
  setTriggerOpen: (open: boolean) => void;
  onCancelRegistration: () => void;
}

export function EventSettingsDropdown({
  triggerOpen,
  setTriggerOpen,
  onCancelRegistration,
}: EventSettingsDropdownProps) {
  const logout = signOut;

  const handleLogout = () => {
    logout();
    setTriggerOpen(false);
  };

  return (
    <View position="relative">
      <Button
        height="100%"
        size="$2"
        icon={<MoreVertical size={16} />}
        onPress={() => setTriggerOpen(!triggerOpen)}
      />

      {triggerOpen && (
        <View
          position="absolute"
          top="100%"
          right={0}
          zIndex={999_999}
          backgroundColor="$color2"
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius="$2"
          minWidth={150}
          overflow="hidden"
          marginTop="$1"
        >
          <YStack>
            <DropdownItem onPress={onCancelRegistration}>
              <DropdownText ai="center">Cancel Registration</DropdownText>
            </DropdownItem>
          </YStack>
        </View>
      )}
    </View>
  );
}

const DropdownItem = styled(View, {
  backgroundColor: '$red5',
  width: '100%',
  hoverStyle: {
    backgroundColor: '$red4',
  },
  pressStyle: {
    backgroundColor: '$red8',
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
