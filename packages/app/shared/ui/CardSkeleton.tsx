import { View } from 'tamagui';

import { SkeletonLine } from './SkeletonLine';

export const CardSkeleton = () => {
  return (
    <View
      width={300}
      height={250}
      padding="$4"
      borderRadius="$4"
      backgroundColor="$background"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={8}
      alignItems="center"
      justifyContent="center"
    >
      <SkeletonLine width="100%" height={120} marginBottom="$3" />
    </View>
  );
};
