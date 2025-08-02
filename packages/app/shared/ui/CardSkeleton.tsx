import { View } from 'tamagui';

import { SkeletonLine } from './SkeletonLine';

export const CardSkeleton = () => {
  return (
    // Main container for the card, mimicking its general shape and shadow
    <View
      width={320} // Approximate width based on image
      minHeight={150} // Approximate height
      padding="$4"
      borderRadius="$4"
      backgroundColor="$background" // Card background
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={8}
      flexDirection="row" // Arrange content horizontally (text left, image right)
      alignItems="center"
      justifyContent="space-between" // Space out text and image
      marginBottom="$4" // Add some space if rendering multiple skeletons
    >
      {/* Left section: Title, time/location, button */}
      <View flex={1} marginRight="$4">
        {/* Title placeholder */}
        <SkeletonLine width="90%" height={24} marginBottom="$2" />
        <SkeletonLine width="70%" height={24} marginBottom="$3" />

        {/* Time placeholder */}
        <SkeletonLine width="50%" height={16} marginBottom="$2" />

        {/* Location/Online placeholder */}
        <SkeletonLine width="60%" height={16} marginBottom="$4" />

        {/* Manage Event Button placeholder */}
        <SkeletonLine width={140} height={36} borderRadius="$4" />
      </View>

      {/* Right section: Image placeholder */}
      <SkeletonLine
        width={100} // Approximate image width
        height={100} // Approximate image height
        borderRadius="$3" // Image corner radius
      />
    </View>
  );
};
