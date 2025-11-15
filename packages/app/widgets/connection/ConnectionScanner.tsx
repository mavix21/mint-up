import { api } from '@my/backend/_generated/api';
import { useMutation } from '@my/backend/react';
import { Button, Sheet, YStack, Text, H4, Paragraph, Input } from '@my/ui';
import { ScanLine, Check, X } from '@tamagui/lucide-icons';
import { useState } from 'react';

interface ConnectionScannerProps {
  onSuccess?: () => void;
}

/**
 * ConnectionScanner component for scanning QR codes to confirm connections.
 * This provides a manual input option since camera access may not be available in all contexts.
 */
export function ConnectionScanner({ onSuccess }: ConnectionScannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [connectionToken, setConnectionToken] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const confirmConnection = useMutation(api.connections.confirmConnection);

  const handleConfirm = async () => {
    if (!connectionToken.trim()) {
      setStatus('error');
      setMessage('Please enter a connection code');
      return;
    }

    setIsConfirming(true);
    setStatus('idle');
    setMessage(null);

    try {
      await confirmConnection({ connectionToken: connectionToken.trim() });
      setStatus('success');
      setMessage('Connection confirmed successfully!');

      // Auto-close after success
      setTimeout(() => {
        setIsOpen(false);
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Failed to confirm connection');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setConnectionToken('');
    setStatus('idle');
    setMessage(null);
  };

  return (
    <>
      <Button size="$4" icon={ScanLine} onPress={() => setIsOpen(true)} theme="blue">
        Scan Connection
      </Button>

      <Sheet
        open={isOpen}
        onOpenChange={setIsOpen}
        modal
        dismissOnSnapToBottom
        snapPoints={[75]}
        snapPointsMode="percent"
      >
        <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Sheet.Frame padding="$4" gap="$4" backgroundColor="$background">
          <Sheet.Handle />

          <YStack gap="$4" flex={1}>
            <YStack gap="$2" ai="center">
              <H4 ta="center">Scan Connection Code</H4>
              <Paragraph ta="center" color="$gray11" fontSize="$3">
                Enter the connection code shown on the other person&apos;s device
              </Paragraph>
            </YStack>

            {status === 'idle' && (
              <YStack gap="$3" flex={1} jc="center">
                <Input
                  placeholder="Enter connection code"
                  value={connectionToken}
                  onChangeText={setConnectionToken}
                  autoCapitalize="none"
                  autoCorrect={false}
                  size="$4"
                />

                <Button
                  size="$4"
                  theme="blue"
                  onPress={handleConfirm}
                  disabled={isConfirming || !connectionToken.trim()}
                  icon={isConfirming ? undefined : Check}
                >
                  {isConfirming ? 'Confirming...' : 'Confirm Connection'}
                </Button>

                <Button size="$4" theme="gray" chromeless onPress={handleClose}>
                  Cancel
                </Button>
              </YStack>
            )}

            {status === 'success' && message && (
              <YStack gap="$3" ai="center" jc="center" flex={1}>
                <YStack
                  width={80}
                  height={80}
                  borderRadius="$12"
                  backgroundColor="$green4"
                  ai="center"
                  jc="center"
                >
                  <Check size={48} color="$green10" />
                </YStack>
                <Text fontSize="$5" fontWeight="600" color="$green10" ta="center">
                  {message}
                </Text>
              </YStack>
            )}

            {status === 'error' && message && (
              <YStack gap="$3" ai="center" jc="center" flex={1}>
                <YStack
                  width={80}
                  height={80}
                  borderRadius="$12"
                  backgroundColor="$red4"
                  ai="center"
                  jc="center"
                >
                  <X size={48} color="$red10" />
                </YStack>
                <Text fontSize="$5" fontWeight="600" color="$red10" ta="center">
                  {message}
                </Text>
                <Button size="$4" onPress={() => setStatus('idle')}>
                  Try Again
                </Button>
              </YStack>
            )}
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
