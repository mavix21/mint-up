import { Doc } from '@my/backend/_generated/dataModel';
import { ThemeName } from '@my/ui';
import {
  Music,
  Briefcase,
  Palette,
  Code,
  Gamepad2,
  Utensils,
  Heart,
  Dumbbell,
  GraduationCap,
  Users,
  PartyPopper,
  Puzzle,
} from '@tamagui/lucide-icons';

export type EventCategory = Exclude<Doc<'events'>['category'], 'other'>;

export interface CategoryConfig {
  icon: React.ComponentType<any>;
  theme: ThemeName;
}

export const EVENT_CATEGORIES: Record<EventCategory, CategoryConfig> = {
  'music & performing arts': {
    icon: Music,
    theme: 'blue',
  },
  'business & professional': {
    icon: Briefcase,
    theme: 'gray',
  },
  'arts & culture': {
    icon: Palette,
    theme: 'purple',
  },
  tech: {
    icon: Code,
    theme: 'green',
  },
  gaming: {
    icon: Gamepad2,
    theme: 'orange',
  },
  'food & drink': {
    icon: Utensils,
    theme: 'red',
  },
  'health & wellness': {
    icon: Heart,
    theme: 'pink',
  },
  'sports & fitness': {
    icon: Dumbbell,
    theme: 'yellow',
  },
  'education & learning': {
    icon: GraduationCap,
    theme: 'blue',
  },
  'community & causes': {
    icon: Users,
    theme: 'green',
  },
  'parties & socials': {
    icon: PartyPopper,
    theme: 'red',
  },
  'hobbies & interests': {
    icon: Puzzle,
    theme: 'blue',
  },
};

export function getCategoryConfig(category: EventCategory): CategoryConfig {
  return EVENT_CATEGORIES[category];
}

export function getCategoryIcon(category: EventCategory) {
  return getCategoryConfig(category).icon;
}

export function getCategoryTheme(category: EventCategory): ThemeName {
  return getCategoryConfig(category).theme;
}
