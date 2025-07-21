import { Button, Text } from 'tamagui';

export interface DescriptionButtonProps {
  description?: string;
  onPress: () => void;
}

export function DescriptionButton({ description, onPress }: DescriptionButtonProps) {
  const getDescriptionText = () => {
    if (!description || description.trim() === '') {
      return 'Add Description';
    }

    // Show first 50 characters of description
    const preview = description.trim();
    return preview.length > 50 ? `${preview.substring(0, 50)}...` : preview;
  };

  const getDescriptionColor = () => {
    if (!description || description.trim() === '') {
      return '$color11';
    }
    return '$color12';
  };

  return (
    <Button justifyContent="flex-start" backgroundColor="$color3" onPress={onPress}>
      <Text>Description</Text>
      {description && description.trim() !== '' && (
        <Text color={getDescriptionColor()} ml="$2" numberOfLines={1} flex={1} textAlign="right">
          {getDescriptionText()}
        </Text>
      )}
    </Button>
  );
}
