import React from 'react';
import { View, styled, SizableText } from 'tamagui';

// Simple animated dot using opacity changes
const PulsingDot = styled(View, {
  width: 6,
  height: 6,
  borderRadius: 3,
  backgroundColor: 'white',
  // Use a simple opacity animation that should work across platforms
  animation: 'fade 2s ease-in-out infinite' as any,
});

export interface LiveIndicatorProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'outlined';
}

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({
  size = 'medium',
  variant = 'default',
}) => {
  const sizeMap = {
    small: '$1',
    medium: '$2',
    large: '$3',
  };

  const sizeValue = sizeMap[size];

  return (
    <View
      backgroundColor={variant === 'outlined' ? 'transparent' : '$red9'}
      borderColor={variant === 'outlined' ? '$red9' : 'transparent'}
      borderWidth={variant === 'outlined' ? 1 : 0}
      borderRadius="$10"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      paddingHorizontal="$2"
      paddingVertical="$1"
      gap="$1.5"
    >
      <PulsingDot />
      <SizableText
        size={sizeValue as any}
        color="white"
        fontWeight="600"
        textTransform="uppercase"
        letterSpacing={0.5}
      >
        LIVE
      </SizableText>
    </View>
  );
};
