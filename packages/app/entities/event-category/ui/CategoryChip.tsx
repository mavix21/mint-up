import { Chip, Theme } from '@my/ui';

import { getCategoryConfig, getCategoryIcon, EventCategory } from '../models/event-categories';

interface CategoryChipProps {
  category: EventCategory;
  size?: '$1' | '$2' | '$3' | '$4';
  showIcon?: boolean;
  showTheme?: boolean;
}

export function CategoryChip({
  category,
  size = '$1',
  showIcon = true,
  showTheme = true,
}: CategoryChipProps) {
  const config = getCategoryConfig(category);
  const IconComponent = getCategoryIcon(category);

  const chipContent = (
    <Chip size={size} rounded paddingInline="$2">
      {showIcon && (
        <Chip.Icon>
          <IconComponent size={12} />
        </Chip.Icon>
      )}
      <Chip.Text fontWeight="600">{category}</Chip.Text>
    </Chip>
  );

  if (showTheme) {
    return <Theme name={config.theme}>{chipContent}</Theme>;
  }

  return chipContent;
}
