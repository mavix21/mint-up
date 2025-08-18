import React, { useCallback, useRef } from 'react';

export function useFileInput(
  onFileSelect: (file: File) => void,
  validateFile?: (file: File) => boolean | string
) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!validateFile) {
        onFileSelect(file);
        return;
      }

      const validationResult = validateFile(file);

      // If validation returns a string, it's an error message
      if (typeof validationResult === 'string') return;

      // Validation failed
      if (validationResult !== true) return;

      console.warn('Image size is valid', `${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      onFileSelect(file);
    },
    [onFileSelect, validateFile]
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
