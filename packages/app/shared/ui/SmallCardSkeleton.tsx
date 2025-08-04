import { View } from '@my/ui';

import { SkeletonLine } from './SkeletonLine';

export const SmallCardSkeleton = () => {
  return (
    // Main container for the card
    <View
      flex={1}
      padding="$3"
      borderRadius="$4"
      backgroundColor="$color3" // Card background
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 1 }} // Lighter shadow
      shadowOpacity={0.08}
      shadowRadius={5}
      flexDirection="row" // Arrange content horizontally (image left, text right)
      alignItems="center"
      marginHorizontal="$4"
      marginTop="$3"
      marginBottom="$3" // Space between multiple cards
    >
      {/* Left section: Image placeholder */}
      <SkeletonLine
        width={100} // Match the actual image size
        height={100}
        borderRadius="$2" // Match the actual image border radius
        marginRight="$3" // Space between image and text
      />

      {/* Right section: Text content */}
      <View flex={1}>
        {/* Date and Time placeholder */}
        <SkeletonLine width="70%" height={16} marginBottom="$1" />
        {/* Title placeholder */}
        <SkeletonLine width="85%" height={20} marginBottom="$3" />
        {/* Tag placeholder (pill shape) */}
        <SkeletonLine width={120} height={28} borderRadius="$true" />
        {/* $true makes it fully rounded */}
      </View>
    </View>
  );
};
