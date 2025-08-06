import { useEffect, useMemo, useRef } from 'react';

export function useImageUrl(file: File | undefined, fallbackUrl?: string) {
  const blobUrlref = useRef<string>('');

  const imageUrl = useMemo(() => {
    if (blobUrlref.current) {
      URL.revokeObjectURL(blobUrlref.current);
      blobUrlref.current = '';
    }

    if (file) {
      const url = URL.createObjectURL(file);
      blobUrlref.current = url;
      return url;
    }

    return fallbackUrl ?? '';
  }, [file, fallbackUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (blobUrlref.current) {
        URL.revokeObjectURL(blobUrlref.current);
      }
    };
  }, []);

  return imageUrl;
}
