import { Button, Sheet, YStack, XStack, SizableText, View } from '@my/ui';
import { useCallback, useRef, useState } from 'react';
import ReactCrop from 'react-image-crop';
import type { Crop, PixelCrop } from 'react-image-crop';

import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropSheetProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedImageUrl: string) => void;
}

const ImageCropSheet = ({ isOpen, onClose, imageSrc, onCropComplete }: ImageCropSheetProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const size = Math.min(width, height);
    const x = (width - size) / 2;
    const y = (height - size) / 2;

    const initialCrop = {
      unit: 'px' as const,
      width: size,
      height: size,
      x,
      y,
    };

    setCrop(initialCrop);
    setCompletedCrop(initialCrop);
  }, []);

  const getCroppedImg = useCallback(async () => {
    if (!imgRef.current || !completedCrop) return;

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Use natural dimensions for better quality
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );

    return new Promise<string>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          resolve(url);
        },
        'image/jpeg', // Use PNG for better quality
        0.8
      );
    });
  }, [completedCrop]);

  const handleCropComplete = async () => {
    const croppedImageUrl = await getCroppedImg();
    if (croppedImageUrl) {
      onCropComplete(croppedImageUrl);
      onClose();
    }
  };

  return (
    <Sheet
      disableDrag
      dismissOnOverlayPress
      open={isOpen}
      forceRemoveScrollEnabled={isOpen}
      modal
      onOpenChange={onClose}
      zIndex={200_000}
      snapPoints={[100]}
      snapPointsMode="percent"
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        backgroundColor="$shadowColor"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Frame flex={1} width="100%" alignItems="center" justifyContent="center">
        <YStack gap="$4" p="$4" width="100%">
          <YStack gap="$2">
            <View flex={1}>
              <SizableText size="$6" fontWeight="600">
                Crop Image
              </SizableText>
              <SizableText size="$3" color="$color9">
                Select a square area for your event image
              </SizableText>
            </View>
          </YStack>

          <YStack gap="$4">
            <YStack
              backgroundColor="$color3"
              borderRadius="$4"
              overflow="hidden"
              height={400}
              alignItems="center"
              justifyContent="center"
            >
              <ReactCrop
                crop={crop}
                onChange={(newCrop) => setCrop(newCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                minWidth={50}
                minHeight={50}
                keepSelection
                style={{ maxHeight: '100%', maxWidth: '100%' }}
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Crop preview"
                  onLoad={onImageLoad}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                  }}
                />
              </ReactCrop>
            </YStack>

            <XStack gap="$2" justifyContent="flex-end">
              <Button variant="outlined" onPress={onClose}>
                <Button.Text>Cancel</Button.Text>
              </Button>
              <Button onPress={handleCropComplete}>
                <Button.Text>Apply Crop</Button.Text>
              </Button>
            </XStack>
          </YStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};

export default ImageCropSheet;
