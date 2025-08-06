import { useEffect, useMemo } from 'react';

import { convertImagePathToFile, getRandomDefaultImage } from './utils';

interface UseDefaultImageProps {
  currentImage: File | undefined;
  onImageChange?: (file: File) => void;
  enabled?: boolean;
}

export function useDefaultImage({
  currentImage,
  onImageChange,
  enabled = true,
}: UseDefaultImageProps) {
  const defaultImagePath = useMemo(() => getRandomDefaultImage(), []);

  useEffect(() => {
    if (!enabled || currentImage || !onImageChange) return;

    let isMounted = true;

    const loadDefaultImage = async () => {
      try {
        const file = await convertImagePathToFile(defaultImagePath);
        if (isMounted) {
          onImageChange(file);
        }
      } catch (error) {
        console.error('Error loading default image:', error);
      }
    };

    loadDefaultImage();

    return () => {
      isMounted = false;
    };
  }, [enabled, currentImage, onImageChange]);

  return defaultImagePath;
}
