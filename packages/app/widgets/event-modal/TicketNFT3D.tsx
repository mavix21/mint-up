import React from 'react';
import { Platform } from 'react-native';
import { View, SizableText, Image, Button } from '@my/ui';
import { Eye, Download, Share2 } from '@tamagui/lucide-icons';
import TicketNFT3DWeb from './TicketNFT3DWeb';

interface TicketNFT3DProps {
  nftURL: string;
  title: string;
  onView?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

export const TicketNFT3D: React.FC<TicketNFT3DProps> = (props) => {
  // On web, use the enhanced Three.js version
  if (Platform.OS === 'web') {
    return <TicketNFT3DWeb {...props} />;
  }

  // On native platforms, use a simplified 3D effect
  return <TicketNFT3DNative {...props} />;
};

// Native implementation with CSS-like 3D effects
const TicketNFT3DNative: React.FC<TicketNFT3DProps> = ({
  nftURL,
  title,
  onView,
  onDownload,
  onShare,
}) => {
  return (
    <View padding="$4" alignItems="center" justifyContent="center">
      <View
        width={300}
        height={400}
        backgroundColor="$background"
        borderRadius="$4"
        borderWidth={2}
        borderColor="$borderColor"
        overflow="hidden"
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.3}
        shadowRadius={8}
        // elevation={8} // Not supported on all platforms
        transform={[{ scale: 0.98 }]}
        animation="bouncy"
        pressStyle={{ scale: 0.95 }}
      >
        {/* NFT Image Container */}
        <View flex={1} position="relative" overflow="hidden" backgroundColor="$color2">
          <Image
            source={{ uri: nftURL }}
            width="100%"
            height="100%"
            resizeMode="cover"
            // fallback prop not supported on all platforms
          />
        </View>

        {/* Ticket Info */}
        <View padding="$3" backgroundColor="$background" gap="$2">
          <SizableText size="$4" fontWeight="600" numberOfLines={2} textAlign="center">
            {title}
          </SizableText>

          {/* Action Buttons */}
          <View gap="$2" flexDirection="row" justifyContent="center">
            {onView && (
              <Button size="$2" theme="blue" onPress={onView} icon={<Eye size={16} />}>
                <Button.Text>View</Button.Text>
              </Button>
            )}

            {onDownload && (
              <Button size="$2" theme="green" onPress={onDownload} icon={<Download size={16} />}>
                <Button.Text>Download</Button.Text>
              </Button>
            )}

            {onShare && (
              <Button size="$2" theme="orange" onPress={onShare} icon={<Share2 size={16} />}>
                <Button.Text>Share</Button.Text>
              </Button>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default TicketNFT3D;
