import React, { useCallback, useRef } from 'react';

export function useFileInput(onFileSelect: (file: File) => void) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const FileInput = useCallback(
    () => (
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    ),
    [handleFileChange]
  );

  return {
    FileInput,
    openFilePicker,
  };
}
