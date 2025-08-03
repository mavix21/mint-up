import { Image as ImageIcon } from '@tamagui/lucide-icons';
import { useCallback, useRef, useState } from 'react';
import { YStack, Image, View, Button } from 'tamagui';

import ImageCropSheet from './image-crop-sheet';

export interface EventImageProps {
  imageUrl?: string;
  onPress?: () => void;
  onImageChange?: (imageUrl: string) => void;
}

// Convert default image path to blob URL
const convertDefaultImageToBlob = async (imagePath: string) => {
  try {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error converting default image to blob:', error);
    return imagePath; // fallback to original path
  }
};

// Default images array - easy to extend in the future
const DEFAULT_IMAGES = [
  '/images/event-image-example-01.png',
  '/images/event-image-example-02.png',
  '/images/event-image-example-03.png',
];

export function EventImage({ imageUrl, onPress, onImageChange }: EventImageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCropSheet, setShowCropSheet] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>('');

  // Select random default image
  const defaultImage = useCallback(
    () => DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)],
    []
  );

  // Use provided imageUrl or convert default image to blob
  const displayImageUrl = imageUrl || defaultImage();

  // Process default image if no imageUrl is provided
  if (!imageUrl && onImageChange) {
    convertDefaultImageToBlob(defaultImage()).then((blobUrl) => {
      onImageChange(blobUrl);
    });
  }

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImageSrc(imageUrl);
      setShowCropSheet(true);
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    onImageChange?.(croppedImageUrl);
    setShowCropSheet(false);
    setSelectedImageSrc('');
  };

  const handleCropClose = () => {
    setShowCropSheet(false);
    setSelectedImageSrc('');
  };

  return (
    <>
      <View flex={1} position="relative">
        <Image
          width="100%"
          zIndex={1}
          aspectRatio={1}
          borderRadius="$6"
          overflow="hidden"
          source={{
            uri: displayImageUrl,
          }}
        />
        <YStack
          flex={1}
          alignItems="flex-end"
          justifyContent="flex-end"
          p="$3"
          position="absolute"
          zIndex={2}
          bottom={2}
          right={2}
        >
          <Button
            theme="alt1"
            borderWidth={1}
            circular
            icon={<ImageIcon size={20} />}
            onPress={handlePress}
          />
        </YStack>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </View>
      {selectedImageSrc && (
        <ImageCropSheet
          isOpen={showCropSheet}
          onClose={handleCropClose}
          imageSrc={selectedImageSrc}
          onCropComplete={handleCropComplete}
        />
      )}
    </>
  );
}
