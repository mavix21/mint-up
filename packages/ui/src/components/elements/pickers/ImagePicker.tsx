import { X, Upload } from '@tamagui/lucide-icons';
import React, { useId, useState, useEffect, useRef } from 'react';
import { Button, Image, Label, View, YStack } from 'tamagui';

import { useFilePicker } from './hooks/useFilePicker';

/**
 * ImagePicker discriminated union prop types
 *
 * Now supports both { fileURL, path } objects and string (blob/file URL) for image representation.
 */
export type ImageSource = { fileURL: string; path: string } | string;

// Shared props for both modes
interface SharedImagePickerProps {
  disabled?: boolean;
  placeholder?: string;
  ref: React.Ref<HTMLInputElement>;
  onBlur?: () => void;
  renderImage?: (image: ImageSource, index: number) => React.ReactNode;
}

// Single mode, cropping true
export type SingleImagePickerWithCropping = SharedImagePickerProps & {
  mode: 'single';
  value?: ImageSource;
  onChange?: (image: ImageSource | undefined) => void;
  onRemove?: () => void;
  cropping: true;
  aspectRatio?: [number, number]; // defaults to [1,1]
};
// Single mode, cropping false or omitted
export type SingleImagePickerWithoutCropping = SharedImagePickerProps & {
  mode: 'single';
  value?: ImageSource;
  onChange?: (image: ImageSource | undefined) => void;
  onRemove?: () => void;
  cropping?: false;
  aspectRatio?: never;
};
export type SingleImagePickerProps =
  | SingleImagePickerWithCropping
  | SingleImagePickerWithoutCropping;

// Multiple mode, cropping/aspectRatio not allowed
export type MultipleImagePickerProps = SharedImagePickerProps & {
  mode: 'multiple';
  maxFiles: number;
  value?: ImageSource[];
  onChange?: (images: ImageSource[]) => void;
  onRemove?: (removed: ImageSource, images: ImageSource[]) => void;
  cropping?: never;
  aspectRatio?: never;
};

export type ImagePickerProps = SingleImagePickerProps | MultipleImagePickerProps;

function isMultiple(props: ImagePickerProps): props is MultipleImagePickerProps {
  return props.mode === 'multiple';
}

function isSingleWithCropping(props: ImagePickerProps): props is SingleImagePickerWithCropping {
  return props.mode === 'single' && props.cropping === true;
}

function getImageUri(image: ImageSource): string {
  if (typeof image === 'string') return image;
  return image.fileURL;
}

function ImagePickerComponent(props: ImagePickerProps) {
  const id = useId();
  const { disabled = false, placeholder, onBlur, renderImage, ref, ...rest } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  // State management
  const [images, setImages] = useState<ImageSource[]>(
    isMultiple(props) ? props.value || [] : props.value ? [props.value] : []
  );

  // Keep local state in sync with controlled value
  useEffect(() => {
    if (isMultiple(props)) {
      if (props.value) setImages(props.value);
    } else {
      if (props.value) setImages([props.value]);
      else setImages([]);
    }
  }, [props.value, props.mode]);

  // File picker config
  const filePickerConfig = {
    typeOfPicker: 'image' as const,
    mediaTypes: ['Images'] as const,
    multiple: isMultiple(props),
    maxFiles: isMultiple(props) ? props.maxFiles : 1,
    onPick: ({ webFiles, nativeFiles }: any) => {
      let pickedImages: ImageSource[] = [];
      if (webFiles?.length) {
        pickedImages = webFiles.map((file: File) => ({
          fileURL: URL.createObjectURL(file),
          path: (file as any).path,
        }));
        console.log('pickedImages (webFiles)', pickedImages);
      } else if (nativeFiles?.length) {
        pickedImages = nativeFiles.map((file: any) => file.uri);
        console.log('pickedImages (nativeFiles)', pickedImages);
      }
      if (isMultiple(props)) {
        const newImages = [...images, ...pickedImages].slice(0, props.maxFiles);
        setImages(newImages);
        props.onChange?.(newImages);
      } else {
        const newImage = pickedImages[0];
        setImages(newImage ? [newImage] : []);
        props.onChange?.(newImage);
      }
    },
  };

  const { open, getInputProps, getRootProps, dragStatus } = useFilePicker(filePickerConfig);
  const { isDragActive } = dragStatus;

  // Remove logic
  const handleRemove = (index: number) => {
    if (isMultiple(props)) {
      const removed = images[index];
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      props.onChange?.(newImages);
      props.onRemove?.(removed, newImages);
    } else {
      setImages([]);
      props.onChange?.(undefined);
      props.onRemove?.();
    }
  };

  // Default image renderer
  const defaultRenderImage = (image: ImageSource, i: number) => {
    console.log('image inside defaultRenderImage', image);
    return (
      <Image borderRadius={10} width={100} height={100} source={{ uri: getImageUri(image) }} />
    );
  };

  // Web: trigger file input click on button press
  const handlePickImageClick = (e: any) => {
    if (typeof window !== 'undefined' && window.document) {
      e.preventDefault();
      if (inputRef.current) {
        inputRef.current.click();
      } else {
        open();
      }
    } else {
      open();
    }
  };

  // UI
  return (
    <>
      {images.length > 0 ? (
        // Image preview area, no scrollbars, always 200x200px
        // @ts-expect-error reason: getRootProps() which is web specific return some react-native incompatible props, but it's fine
        <View
          flexDirection="column"
          {...getRootProps()}
          borderStyle="dashed"
          justifyContent="center"
          alignItems="center"
          borderWidth={isDragActive ? 2 : 1}
          borderColor={isDragActive ? '$gray11' : '$gray9'}
          gap="$2"
          borderRadius="$true"
          padding="$4"
          minBlockSize={200}
        >
          {images.map((image, i) => (
            <View key={i} position="relative">
              <View
                width={100}
                height={100}
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius="$true"
              >
                {(renderImage || defaultRenderImage)(image, i)}
              </View>
              <Button
                onPress={() => handleRemove(i)}
                right={4}
                top={4}
                size="$1"
                circular
                position="absolute"
                disabled={disabled}
                aria-label="Remove image"
                zIndex={2}
                icon={<X />}
              />
            </View>
          ))}
        </View>
      ) : (
        <>
          {/* Hidden file input for web, visible to screen readers */}
          {/* @ts-expect-error reason: getRootProps() which is web specific return some react-native incompatible props, but it's fine */}
          <View
            flexDirection="column"
            {...getRootProps()}
            borderStyle="dashed"
            justifyContent="center"
            alignItems="center"
            borderWidth={isDragActive ? 2 : 1}
            borderColor={isDragActive ? '$gray11' : '$gray9'}
            borderRadius="$true"
            padding="$4"
            minBlockSize={200}
          >
            {/* @ts-expect-error reason: getInputProps() which is web specific return some react-native incompatible props, but it's fine */}
            <View tag="input" width={0} height={0} {...getInputProps()} ref={inputRef} />
            <YStack flex={1} alignItems="center" justifyContent="center" gap="$2">
              <Upload h="$2" w="$2" color="$color10" />
              {/* Show button only if: multiple mode and not maxed out, or single mode and no image selected */}
              <Label
                display={images.length > 0 ? 'none' : 'flex'}
                $platform-native={{ display: 'none' }}
                size="$3"
                htmlFor={id}
                color="$color9"
                t="$1"
                whiteSpace="nowrap"
              >
                {placeholder || 'Drag image into this area'}
              </Label>
              {((isMultiple(props) && images.length < props.maxFiles) ||
                (!isMultiple(props) && images.length === 0)) && (
                <Button
                  onPress={handlePickImageClick}
                  disabled={disabled}
                  marginBottom={images.length ? 0 : 8}
                >
                  Pick image
                </Button>
              )}
            </YStack>
          </View>
        </>
      )}
    </>
  );
}

export const ImagePicker = ImagePickerComponent;
