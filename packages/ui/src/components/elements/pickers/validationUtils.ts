// Shared validation utilities for file pickers

/**
 * Extracts the file extension from a filename.
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
}

/**
 * Validates files selected on the web platform.
 * Throws an error if validation fails.
 */
export function validateWebFiles(
  files: File[],
  props: {
    maxFileSize?: number;
    maxFiles?: number;
    allowedExtensions?: string[];
    validateFile?: (file: File) => boolean | string;
  }
) {
  const { maxFileSize, maxFiles, allowedExtensions, validateFile } = props;
  if (maxFiles && files.length > maxFiles) {
    throw new Error(`Too many files selected. Max allowed: ${maxFiles}`);
  }
  for (const file of files) {
    if (maxFileSize && file.size > maxFileSize) {
      throw new Error(`File ${file.name} is too large. Max size: ${maxFileSize} bytes`);
    }
    if (allowedExtensions && allowedExtensions.length > 0) {
      const ext = getFileExtension(file.name);
      if (!ext || !allowedExtensions.includes(ext)) {
        throw new Error(
          `File ${file.name} has an invalid extension. Allowed: ${allowedExtensions.join(', ')}`
        );
      }
    }
    if (validateFile) {
      const result = validateFile(file);
      if (typeof result === 'string') throw new Error(result);
      if (!result) throw new Error(`File ${file.name} failed custom validation.`);
    }
  }
}

/**
 * Validates files selected on native platforms (best-effort due to limited metadata).
 * Throws an error if validation fails.
 */
export function validateNativeFiles(
  nativeFiles: any,
  props: {
    maxFileSize?: number;
    maxFiles?: number;
    allowedExtensions?: string[];
    validateFile?: (file: File) => boolean | string;
  }
) {
  const { maxFileSize, maxFiles, allowedExtensions, validateFile } = props;
  if (!nativeFiles) return;
  const files = Array.isArray(nativeFiles) ? nativeFiles : [nativeFiles];
  if (maxFiles && files.length > maxFiles) {
    throw new Error(`Too many files selected. Max allowed: ${maxFiles}`);
  }
  for (const file of files) {
    if (maxFileSize && file.fileSize && file.fileSize > maxFileSize) {
      throw new Error(
        `File ${file.fileName || file.name || ''} is too large. Max size: ${maxFileSize} bytes`
      );
    }
    if (allowedExtensions && allowedExtensions.length > 0) {
      const ext = getFileExtension(file.fileName || file.name || '');
      if (!ext || !allowedExtensions.includes(ext)) {
        throw new Error(
          `File ${
            file.fileName || file.name || ''
          } has an invalid extension. Allowed: ${allowedExtensions.join(', ')}`
        );
      }
    }
    if (validateFile && file.uri) {
      // Native file objects may not be File, so skip or adapt as needed
      // Optionally, you could fetch the file and create a File object for validation
    }
  }
}
