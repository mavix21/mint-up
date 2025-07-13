import type * as DocumentPicker from 'expo-document-picker';
import type * as ImagePicker from 'expo-image-picker/src/ImagePicker';
import type { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';
import { useEvent } from 'tamagui';

import { useDropZone } from '../useDropZone';
import { validateWebFiles, validateNativeFiles } from '../validationUtils';

export type MediaTypeOptions = 'All' | 'Videos' | 'Images' | 'Audios';
export type UseFilePickerControl = {
  open: () => void;
  getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T;
  getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T;
  dragStatus?: {
    isDragAccept: boolean;
    isDragActive: boolean;
    isDragReject: boolean;
  };
};

type NativeFiles<MT extends MediaTypeOptions[]> = MT[number] extends 'Images'
  ? ImagePicker.ImagePickerResult['assets']
  : DocumentPicker.DocumentPickerResult[];

export type OnPickType<MT extends MediaTypeOptions[]> = (param: {
  webFiles: File[] | null;
  nativeFiles: NativeFiles<MT> | null;
}) => void | Promise<void>;

type UseFilePickerProps<MT extends MediaTypeOptions> = {
  mediaTypes: readonly MT[];
  onPick: OnPickType<MT[]>;
  /** multiple only works for image only types on native, but on web it works regarding the media types */
  multiple: boolean;
  typeOfPicker: 'file' | 'image';
  onError?: (error: Error) => void;
  maxFileSize?: number; // in bytes, per file
  maxFiles?: number; // max number of files
  allowedExtensions?: string[]; // e.g., ['jpg', 'png']
  validateFile?: (file: File) => boolean | string; // custom validation
};

export function useFilePicker<MT extends MediaTypeOptions>(props?: UseFilePickerProps<MT>) {
  const {
    mediaTypes,
    onPick,
    onError,
    maxFileSize,
    maxFiles,
    allowedExtensions,
    validateFile,
    ...rest
  } = props || {};

  const _onDrop = useEvent((webFiles) => {
    try {
      if (webFiles) {
        validateWebFiles(webFiles, {
          maxFileSize,
          maxFiles,
          allowedExtensions,
          validateFile,
        } as UseFilePickerProps<any>);
      }
      if (onPick) {
        onPick({ webFiles, nativeFiles: null });
      }
    } catch (error) {
      if (onError && error instanceof Error) {
        onError(error);
      } else {
        console.error('useFilePicker: Error in onPick (web):', error);
      }
    }
  });

  const onOpen = useEvent((nativeFiles) => {
    try {
      if (nativeFiles) {
        validateNativeFiles(nativeFiles, {
          maxFileSize,
          maxFiles,
          allowedExtensions,
          validateFile,
        } as UseFilePickerProps<any>);
      }
      if (onPick) {
        onPick({ webFiles: null, nativeFiles });
      }
    } catch (error) {
      if (onError && error instanceof Error) {
        onError(error);
      } else {
        console.error('useFilePicker: Error in onPick (native):', error);
      }
    }
  });

  const { open, getInputProps, getRootProps, isDragAccept, isDragActive, isDragReject } =
    useDropZone({
      // this is web only, it triggers both on drop and open
      onDrop: _onDrop,
      // this is native only
      onOpen,
      // @ts-ignore
      mediaTypes,
      noClick: true,
      ...rest,
    });

  const control = {
    open,
    getInputProps,
    getRootProps,
    dragStatus: {
      isDragAccept,
      isDragActive,
      isDragReject,
    },
  };

  return { control, ...control };
}
