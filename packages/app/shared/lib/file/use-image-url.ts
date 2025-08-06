import { useEffect, useMemo, useRef } from 'react';

export function useImageUrl(file: File | undefined) {
  const blobUrlref = useRef<string>('');
  const fileRef = useRef<File | undefined>(undefined);

  const imageUrl = useMemo(() => {
    if (file) {
      // Only create new blob URL if file has actually changed
      if (fileRef.current !== file) {
        if (blobUrlref.current) {
          console.log('revoking blobUrlref.current', blobUrlref.current);
          URL.revokeObjectURL(blobUrlref.current);
        }

        console.log('creating new blobUrl', file);
        const url = URL.createObjectURL(file);
        blobUrlref.current = url;
        fileRef.current = file;
        return url;
      }

      return blobUrlref.current;
    }

    return null;
  }, [file]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (blobUrlref.current) {
        console.log('revoking blobUrlref.current on cleanup', blobUrlref.current);
        URL.revokeObjectURL(blobUrlref.current);
      }
    };
  }, []);

  return imageUrl;
}
