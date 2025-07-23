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
  Sparkles,
} from '@tamagui/lucide-icons';
import {
  ScrollView,
  YStack,
  Text,
  Card,
  RadioGroup,
  SizableText,
  XStack,
  Theme,
  ThemeName,
} from 'tamagui';

export type EventCategory =
  | 'music & performing arts'
  | 'business & professional'
  | 'arts & culture'
  | 'tech'
  | 'gaming'
  | 'food & drink'
  | 'health & wellness'
  | 'sports & fitness'
  | 'education & learning'
  | 'community & causes'
  | 'parties & socials'
  | 'hobbies & interests';

const categoryData: {
  value: EventCategory;
  label: string;
  icon: any;
  theme: ThemeName;
}[] = [
  {
    value: 'music & performing arts',
    label: 'Music & Performing Arts',
    icon: Music,
    theme: 'blue',
  },
  {
    value: 'business & professional',
    label: 'Business & Professional',
    icon: Briefcase,
    theme: 'gray',
  },
  {
    value: 'arts & culture',
    label: 'Arts & Culture',
    icon: Palette,
    theme: 'purple',
  },
  {
    value: 'tech',
    label: 'Tech',
    icon: Code,
    theme: 'green',
  },
  {
    value: 'gaming',
    label: 'Gaming',
    icon: Gamepad2,
    theme: 'orange',
  },
  {
    value: 'food & drink',
    label: 'Food & Drink',
    icon: Utensils,
    theme: 'red',
  },
  {
    value: 'health & wellness',
    label: 'Health & Wellness',
    icon: Heart,
    theme: 'pink',
  },
  {
    value: 'sports & fitness',
    label: 'Sports & Fitness',
    icon: Dumbbell,
    theme: 'yellow',
  },
  {
    value: 'education & learning',
    label: 'Education & Learning',
    icon: GraduationCap,
    theme: 'orange',
  },
  {
    value: 'community & causes',
    label: 'Community & Causes',
    icon: Users,
    theme: 'blue',
  },
  {
    value: 'parties & socials',
    label: 'Parties & Socials',
    icon: PartyPopper,
    theme: 'purple',
  },
  {
    value: 'hobbies & interests',
    label: 'Hobbies & Interests',
    icon: Sparkles,
    theme: 'blue',
  },
];

export interface CategorySelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export function CategorySelector({ value, onValueChange }: CategorySelectorProps) {
  return (
    <YStack gap="$2">
      <SizableText>Category</SizableText>
      <ScrollView horizontal width="100%" height="$10">
        <XStack gap="$3" flex={1} flexWrap="nowrap">
          <RadioGroup value={value} onValueChange={onValueChange} orientation="horizontal" gap="$3">
            <XStack gap="$3">
              {categoryData.map((category) => {
                const Icon = category.icon;
                const isSelected = value === category.value;
                return (
                  <RadioGroup.Item
                    key={category.value}
                    value={category.value}
                    id={`category-${category.value}`}
                    unstyled
                  >
                    <Theme name={isSelected ? category.theme : undefined}>
                      <Card
                        size="$4"
                        width={120}
                        height={100}
                        borderRadius="$4"
                        padding="$3"
                        backgroundColor={isSelected ? '$color5' : '$color3'}
                        borderColor={isSelected ? '$color8' : '$color6'}
                        borderWidth={isSelected ? 2 : 1}
                        pressStyle={{
                          backgroundColor: isSelected ? '$color6' : '$color4',
                          scale: 0.98,
                          animation: 'lazy',
                        }}
                      >
                        <YStack flex={1} alignItems="center" justifyContent="center" gap="$2">
                          <Icon size={24} color={isSelected ? '$color12' : '$color10'} />
                          <Text
                            fontSize="$2"
                            fontWeight={isSelected ? '600' : '500'}
                            color={isSelected ? '$color12' : '$color10'}
                            textAlign="center"
                            numberOfLines={2}
                          >
                            {category.label}
                          </Text>
                        </YStack>
                      </Card>
                    </Theme>
                  </RadioGroup.Item>
                );
              })}
            </XStack>
          </RadioGroup>
        </XStack>
      </ScrollView>
    </YStack>
  );
}
