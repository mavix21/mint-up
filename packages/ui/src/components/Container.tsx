import { styled, YStack } from 'tamagui';

export const Container = styled(YStack, {
  width: '100%',
  height: '100%',
  marginInline: 'auto',
  flex: 1, // This is important for the page to take up the full height of the viewport

  variants: {
    forceViewportHeight: {
      true: {
        height: '100vh' as any,
      },
    },
    size: {
      default: {},
      narrow: {
        maxWidth: 496,
      },
      wide: {
        maxWidth: 600,
      },
    },
    variant: {
      default: {},
      withPadding: {
        paddingHorizontal: '$4',
      },
    },
    center: {
      true: {
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  } as const,

  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});
