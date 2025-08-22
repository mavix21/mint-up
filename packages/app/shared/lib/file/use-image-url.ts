import { useMemo, useRef } from 'react';

export function useImageUrl(file: File | undefined) {
  const blobUrlref = useRef<string>('');
  const fileRef = useRef<File | undefined>(undefined);

  const imageUrl = useMemo(() => {
    if (!file) {
      return null;
    }

    // Use a more stable comparison - compare file name, size, and last modified
    const isSameFile =
      fileRef.current &&
      fileRef.current.name === file.name &&
      fileRef.current.size === file.size &&
      fileRef.current.lastModified === file.lastModified;

    if (isSameFile) {
      return blobUrlref.current;
    }

    // Only create new blob URL if file has actually changed
    if (blobUrlref.current) {
      URL.revokeObjectURL(blobUrlref.current);
    }

    const url = URL.createObjectURL(file);
    blobUrlref.current = url;
    fileRef.current = file;
    return url;
  }, [file]);

  // Cleanup on unmount
  // TODO: this is executing right away
  // useEffect(() => {
  //   return () => {
  //     if (blobUrlref.current) {
  //       console.log('revoking blob url on unmount', blobUrlref.current);
  //       URL.revokeObjectURL(blobUrlref.current);
  //     }
  //   };
  // }, []);

  return imageUrl;
}
