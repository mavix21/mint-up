export const DEFAULT_IMAGES = [
  '/images/event-image-example-01.png',
  '/images/event-image-example-02.png',
  '/images/event-image-example-03.png',
];

export const getRandomDefaultImage = (): string => {
  return DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)];
};

export const convertImagePathToFile = async (imagePath: string): Promise<File> => {
  try {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    return new File([blob], 'default-image.jpg', { type: blob.type });
  } catch (error) {
    console.error('Error converting image to file:', error);
    throw error;
  }
};

/**
 * Convert a blob URL back to a File object
 */
export async function blobUrlToFile(blobUrl: string, fileName: string): Promise<File> {
  const res = await fetch(blobUrl);
  const blob = await res.blob();
  return new File([blob], fileName, { type: blob.type });
}

/**
 * Get file extension from MIME type
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const extensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
  };

  return extensions[mimeType] || 'bin';
}

/**
 * Validate if a file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Get file size in a human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
