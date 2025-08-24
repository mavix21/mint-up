import { YStack, YStackProps, styled } from '@my/ui';

export const PageContainer = styled(YStack, {
  width: '100%',
  height: '100vh' as any,
  flex: 1,
  overflow: 'hidden',
  bg: '$background',
});

export type PageContainerProps = YStackProps;
