import { Button, Dialog, YStack } from '@my/ui';
import { LogIn, X } from '@tamagui/lucide-icons';
import { useSignIn } from 'app/shared/lib/hooks/use-sign-in';
import { memo } from 'react';

interface SignInPromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SignInPromptModal = memo(function SignInPromptModal({
  open,
  onOpenChange,
}: SignInPromptModalProps) {
  const { signIn, isLoading, isSignedIn } = useSignIn();

  const handleSignIn = () => {
    signIn();
  };

  // Close modal when user is signed in
  if (isSignedIn && open) {
    onOpenChange(false);
  }

  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="slow"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={['transform', 'opacity']}
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
          w="90%"
          maxWidth={400}
          p="$4"
        >
          <Dialog.Title textAlign="center">Create digital experiences ✨</Dialog.Title>

          <Dialog.Description size="$4" textAlign="center" color="$color9">
            Join our community to create amazing events and build your digital experiences
            collection.
          </Dialog.Description>

          <YStack gap="$3" mt="$2">
            <Button
              theme="green"
              icon={<LogIn size={16} />}
              onPress={handleSignIn}
              disabled={isLoading || isSignedIn}
            >
              {isLoading ? 'Signing In...' : isSignedIn ? 'Signed In' : 'Sign In'}
            </Button>

            <Button onPress={() => onOpenChange(false)} disabled={isLoading}>
              Maybe Later
            </Button>
          </YStack>

          <Dialog.Close asChild>
            <Button
              position="absolute"
              top="$3"
              right="$3"
              size="$2"
              circular
              chromeless
              icon={<X size={16} />}
              disabled={isLoading}
            />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
});
