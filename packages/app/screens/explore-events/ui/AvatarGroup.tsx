import { View, getTokenValue } from '@my/ui';
import type { SizeTokens } from '@my/ui';
import React from 'react';

export function AvatarGroup({ size, items }: { size: SizeTokens; items: React.ReactNode[] }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <View
      flexDirection="row"
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {items.map((item, index) => (
        <View
          key={index}
          zIndex={index}
          marginLeft={index !== 0 ? -(getTokenValue(size as any) ?? 20) * 1.5 : undefined}
          animation="bouncy"
          x={0}
          {...(hovered && {
            x: index * 8,
          })}
        >
          {item}
        </View>
      ))}
    </View>
  );
}
