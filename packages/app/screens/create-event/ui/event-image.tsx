import { useToastController } from '@my/ui';
import { Image as ImageIcon } from '@tamagui/lucide-icons';
import { useFileInput, useImageCrop, useImageUrl } from 'app/shared/lib/file';
import { useDefaultImage } from 'app/shared/lib/file/use-default-image';
import { YStack, Image, View, Button } from 'tamagui';

import ImageCropSheet from './image-crop-sheet';

export interface EventImageProps {
  image: File | undefined;
  onImageChange?: (file: File) => void;
  autoLoadDefaultImage?: boolean;
}

export function EventImage({ image, onImageChange, autoLoadDefaultImage = true }: EventImageProps) {
  const toast = useToastController();
  const defaultImagePath = useDefaultImage({
    currentImage: image,
    onImageChange,
    enabled: autoLoadDefaultImage,
  });
  const blobUrl = useImageUrl(image);
  const displayUrl = blobUrl ?? defaultImagePath;

  const { cropState, openCropSheet, closeCropSheet, handleCropComplete } = useImageCrop({
    onImageChange,
  });

  const validateImageSize = (file: File): boolean | string => {
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      return 'Image size must be less than 2MB';
    }
    return true;
  };

  const handleFileSelect = (file: File) => {
    const validationResult = validateImageSize(file);
    if (validationResult !== true) {
      toast.show('Image too large', {
        message:
          typeof validationResult === 'string'
            ? validationResult
            : 'Image size must be less than 2MB',
        type: 'error',
      });
      return;
    }
    openCropSheet(file);
  };

  const { FileInput, openFilePicker } = useFileInput(handleFileSelect);

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
            uri: displayUrl ?? undefined,
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
            onPress={openFilePicker}
          />
        </YStack>
        <FileInput />
      </View>
      {cropState.previewUrl && (
        <ImageCropSheet
          isOpen={cropState.isOpen}
          onClose={closeCropSheet}
          imageSrc={cropState.previewUrl}
          onCropComplete={handleCropComplete}
        />
      )}
    </>
  );
}
