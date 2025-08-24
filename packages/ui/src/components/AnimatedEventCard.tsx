import { View, ViewProps, styled } from '@my/ui';
import React from 'react';

export const AnimatedEventCard = styled(View, {
  animation: [
    'bouncy',
    {
      y: { delay: 0 },
    },
  ],
  enterStyle: { y: 6 },

  variants: {
    delay: {
      none: {},
      small: {
        animation: [
          'bouncy',
          {
            y: { delay: 60 },
          },
        ],
      },
      medium: {
        animation: [
          'bouncy',
          {
            y: { delay: 120 },
          },
        ],
      },
      large: {
        animation: [
          'bouncy',
          {
            y: { delay: 180 },
          },
        ],
      },
    },
  } as const,
});

export type AnimatedEventCardProps = ViewProps & {
  children: React.ReactNode;
  index?: number;
  delay?: 'none' | 'small' | 'medium' | 'large';
};

// Helper component that automatically applies delay based on index
export const StaggeredEventCard = ({ children, index = 0, ...props }: AnimatedEventCardProps) => {
  const getDelayVariant = (index: number): 'none' | 'small' | 'medium' | 'large' => {
    if (index === 0) return 'none';
    if (index <= 2) return 'small';
    if (index <= 4) return 'medium';
    return 'large';
  };

  return (
    <AnimatedEventCard delay={getDelayVariant(index)} {...props}>
      {children}
    </AnimatedEventCard>
  );
};
