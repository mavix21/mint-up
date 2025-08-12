import React from 'react';
import { View, YStack, SizableText, Button } from '@my/ui';
import TicketNFT3D from './TicketNFT3D';

export const TicketNFT3DDemo: React.FC = () => {
  const sampleNFTData = {
    nftURL: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop',
    title: 'Sample Event NFT Ticket',
  };

  const handleView = () => {
    console.log('View NFT clicked');
    // You can implement actual view logic here
  };

  const handleDownload = () => {
    console.log('Download NFT clicked');
    // You can implement actual download logic here
  };

  const handleShare = () => {
    console.log('Share NFT clicked');
    // You can implement actual share logic here
  };

  return (
    <View padding="$4" backgroundColor="$background">
      <YStack gap="$4" alignItems="center">
        <SizableText size="$6" fontWeight="600" textAlign="center">
          Ticket NFT 3D Component Demo
        </SizableText>

        <SizableText size="$3" textAlign="center" color="$color8">
          This component showcases a 3D ticket NFT with interactive features. On web, it uses
          Three.js for enhanced 3D effects. On mobile, it provides smooth animations and touch
          interactions.
        </SizableText>

        <TicketNFT3D
          nftURL={sampleNFTData.nftURL}
          title={sampleNFTData.title}
          onView={handleView}
          onDownload={handleDownload}
          onShare={handleShare}
        />

        <YStack gap="$2" alignItems="center">
          <SizableText size="$2" color="$color8" textAlign="center">
            Features:
          </SizableText>
          <SizableText size="$2" color="$color8" textAlign="center">
            • 3D rotation on mouse hover (web)
          </SizableText>
          <SizableText size="$2" color="$color8" textAlign="center">
            • Three.js integration (web)
          </SizableText>
          <SizableText size="$2" color="$color8" textAlign="center">
            • Smooth animations and shadows
          </SizableText>
          <SizableText size="$2" color="$color8" textAlign="center">
            • Cross-platform compatibility
          </SizableText>
        </YStack>
      </YStack>
    </View>
  );
};

export default TicketNFT3DDemo;
