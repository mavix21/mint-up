import { api } from '@my/backend/_generated/api';
import type { Id } from '@my/backend/_generated/dataModel';
import { useMutation, useQuery } from '@my/backend/react';
import { Button, Sheet, YStack, Text, Spinner, H4, Paragraph, Image } from '@my/ui';
import { QrCode, Check } from '@tamagui/lucide-icons';
import { useState, useEffect } from 'react';

interface ConnectionButtonProps {
  eventId: Id<'events'>;
  targetUserId: Id<'users'>;
  targetUserName: string;
}

/**
 * ConnectionButton component for initiating a connection with another attendee.
 * When pressed, it generates a QR code that the other user must scan to confirm.
 */
export function ConnectionButton({ eventId, targetUserId, targetUserName }: ConnectionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [connectionData, setConnectionData] = useState<{
    connectionToken: string;
    expiresAt: number;
  } | null>(null);

  const initiateConnection = useMutation(api.connections.initiateConnection);
  const connectionStatus = useQuery(api.connections.checkConnectionExists, {
    eventId,
    otherUserId: targetUserId,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear connection data when sheet closes
  useEffect(() => {
    if (!isOpen) {
      setConnectionData(null);
      setError(null);
    }
  }, [isOpen]);

  const handleConnect = async () => {
    setIsOpen(true);
    setIsGenerating(true);
    setError(null);

    try {
      const result = await initiateConnection({ eventId, acceptorUserId: targetUserId });
      setConnectionData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate connection code');
    } finally {
      setIsGenerating(false);
    }
  };

  // Check if already connected
  if (connectionStatus?.status === 'confirmed') {
    return (
      <Button size="$3" disabled theme="green" icon={Check}>
        Connected
      </Button>
    );
  }

  // Generate QR code URL using external service (same as used in other parts of the app)
  const qrCodeUrl = connectionData
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        connectionData.connectionToken
      )}`
    : null;

  return (
    <>
      <Button size="$3" icon={QrCode} onPress={handleConnect} theme="blue">
        Connect
      </Button>

      <Sheet
        open={isOpen}
        onOpenChange={setIsOpen}
        modal
        dismissOnSnapToBottom
        snapPoints={[85]}
        snapPointsMode="percent"
      >
        <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Sheet.Frame padding="$4" gap="$4" backgroundColor="$background">
          <Sheet.Handle />

          <YStack gap="$4" ai="center" jc="center" flex={1}>
            <H4 ta="center">Connect with {targetUserName}</H4>

            {isGenerating ? (
              <YStack gap="$3" ai="center">
                <Spinner size="large" />
                <Text color="$gray11">Generating connection code...</Text>
              </YStack>
            ) : error ? (
              <YStack gap="$3" ai="center" maxWidth={300}>
                <Text color="$red10" ta="center">
                  {error}
                </Text>
                <Button onPress={() => setIsOpen(false)}>Close</Button>
              </YStack>
            ) : connectionData && qrCodeUrl ? (
              <YStack gap="$4" ai="center" maxWidth={400}>
                <Paragraph ta="center" color="$gray11" fontSize="$3">
                  Show this QR code to {targetUserName} so they can scan it with their device.
                </Paragraph>

                <YStack
                  padding="$4"
                  backgroundColor="white"
                  borderRadius="$4"
                  borderWidth={1}
                  borderColor="$borderColor"
                >
                  <Image
                    source={{ uri: qrCodeUrl }}
                    width={300}
                    height={300}
                    alt="Connection QR Code"
                  />
                </YStack>

                <YStack gap="$2" ai="center">
                  <Text fontSize="$2" color="$gray11">
                    Code expires in 5 minutes
                  </Text>
                  <Text fontSize="$1" color="$gray10" ta="center">
                    Expires at:{' '}
                    {new Date(connectionData.expiresAt).toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </YStack>

                <Button onPress={() => setIsOpen(false)} theme="gray" chromeless>
                  Cancel
                </Button>
              </YStack>
            ) : null}
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
