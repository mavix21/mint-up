import { FileText } from '@tamagui/lucide-icons';
import { formatDescriptionText, getDescriptionColor } from 'app/shared';
import { Button, SizableText } from 'tamagui';

export interface DescriptionButtonProps {
  description: string;
  onPress: () => void;
}

export function DescriptionButton({ description, onPress }: DescriptionButtonProps) {
  return (
    <Button
      justifyContent="flex-start"
      backgroundColor="$color3"
      icon={<FileText color="$color11" size={16} />}
      onPress={onPress}
    >
      <SizableText color="$color11">Description</SizableText>
      {description && description.trim() !== '' && (
        <SizableText
          color={getDescriptionColor(description) as any}
          ml="$4"
          numberOfLines={1}
          flex={1}
          textAlign="right"
        >
          {formatDescriptionText(description)}
        </SizableText>
      )}
    </Button>
  );
}
