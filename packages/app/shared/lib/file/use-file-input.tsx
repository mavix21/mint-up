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
      if (file) {
        if (validateFile) {
          const validationResult = validateFile(file);
          if (validationResult !== true) {
            // If validation returns a string, it's an error message
            if (typeof validationResult === 'string') {
              // We'll need to handle this error in the component that uses this hook
              return;
            }
            return; // Validation failed
          }
        }
        onFileSelect(file);
      }
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
