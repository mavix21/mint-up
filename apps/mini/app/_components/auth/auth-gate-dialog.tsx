import { Button, Dialog, Theme, YStack } from '@my/ui';
import { X } from '@tamagui/lucide-icons';
import { useSignIn } from 'app/shared/lib/hooks/use-sign-in';
import { ConnectButton } from 'app/widgets/auth';
import { useEffect, useState } from 'react';

interface AuthGateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
}

export function AuthGateDialog({ open, onOpenChange, title, description }: AuthGateDialogProps) {
  const { isSignedIn, isLoading } = useSignIn();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isSignedIn && open) {
      onOpenChange(false);
    }
  }, [isSignedIn, open, onOpenChange]);

  if (!isMounted) {
    // Avoid rendering portaled dialog markup until after client hydration completes.
    return null;
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
          <Dialog.Title textAlign="center">{title}</Dialog.Title>

          <Dialog.Description size="$4" textAlign="center" color="$color9">
            {description}
          </Dialog.Description>

          <YStack gap="$3" mt="$2">
            <Theme name="green">
              <ConnectButton />
              <Button onPress={() => onOpenChange(false)} disabled={isLoading}>
                Maybe Later
              </Button>
            </Theme>
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
}
