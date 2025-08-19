import { getCategoryIcon, EventCategory } from '../models/event-categories';

interface CategoryIconProps {
  category: EventCategory;
  size?: number;
  color?: string;
}

export function CategoryIcon({ category, size = 16, color }: CategoryIconProps) {
  const IconComponent = getCategoryIcon(category);

  return <IconComponent size={size} />;
}
