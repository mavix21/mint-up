import { View, styled } from 'tamagui';

export const SkeletonLine = styled(View, {
  backgroundColor: '$color6',
  borderRadius: '$2',
  animation: 'slow',
  variants: {
    // Definimos una variante para la animación
    animated: {
      true: {
        // Animación de opacidad para un efecto de parpadeo suave
        opacity: 0.6,
        animation: 'quick',
      },
    },
  },
});
