import { useCallback, useState } from 'react';

interface UseImageCrop {
  onImageChange?: (file: File) => void;
}

export function useImageCrop({ onImageChange }: UseImageCrop) {
  const [cropState, setCropState] = useState<{
    isOpen: boolean;
    previewUrl: string;
    selectedFile: File | null;
  }>({
    isOpen: false,
    previewUrl: '',
    selectedFile: null,
  });

  const openCropSheet = useCallback((file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setCropState({
      isOpen: true,
      previewUrl,
      selectedFile: file,
    });
  }, []);

  const closeCropSheet = useCallback(() => {
    setCropState((prevState) => {
      if (prevState.previewUrl) {
        URL.revokeObjectURL(prevState.previewUrl);
      }

      return {
        isOpen: false,
        previewUrl: '',
        selectedFile: null,
      };
    });
  }, []);

  const handleCropComplete = useCallback(
    async (croppedImageUrl: string) => {
      try {
        const response = await fetch(croppedImageUrl);
        const blob = await response.blob();
        const croppedFile = new File([blob], 'cropped-image.jpg', { type: blob.type });

        onImageChange?.(croppedFile);
        closeCropSheet();
      } catch (error) {
        console.error('Error cropping image:', error);
      }
    },
    [onImageChange, closeCropSheet]
  );

  return {
    cropState,
    openCropSheet,
    closeCropSheet,
    handleCropComplete,
  };
}
