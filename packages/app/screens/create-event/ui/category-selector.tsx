import {
  ScrollView,
  YStack,
  Card,
  RadioGroup,
  SizableText,
  XStack,
  Theme,
  AnimatePresence,
} from '@my/ui';
import { AnyFieldApi } from '@tanstack/react-form';
import { EVENT_CATEGORIES } from 'app/entities/event-category/models/event-categories';
import { EventCategory } from 'app/entities/schemas';
import { FieldInfo } from 'app/shared/ui/FieldInfo';
import { useState, useCallback, useMemo } from 'react';
import { LinearGradient } from 'tamagui/linear-gradient';

// Use the centralized category configuration
const categoryData = Object.entries(EVENT_CATEGORIES).map(([value, config]) => ({
  value: value as EventCategory,
  label: value.charAt(0).toUpperCase() + value.slice(1), // Capitalize first letter
  icon: config.icon,
  theme: config.theme,
}));

export interface CategorySelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
  fieldApi?: AnyFieldApi;
}

export function CategorySelector({ value, onValueChange, fieldApi }: CategorySelectorProps) {
  const [scrollX, setScrollX] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  // Memoize fade visibility calculations to prevent unnecessary re-renders
  const { showLeftFade, showRightFade } = useMemo(() => {
    const showLeft = scrollX > 0;
    const showRight = scrollX < contentWidth - containerWidth - 10;
    return { showLeftFade: showLeft, showRightFade: showRight };
  }, [scrollX, contentWidth, containerWidth]);

  // Debounced scroll handler to reduce re-renders
  const handleScroll = useCallback(
    (e: any) => {
      const newScrollX = e.nativeEvent.contentOffset.x;
      // Only update if the change is significant (more than 5px)
      if (Math.abs(newScrollX - scrollX) > 5) {
        setScrollX(newScrollX);
      }
    },
    [scrollX]
  );

  const handleContentSizeChange = useCallback((width: number) => {
    setContentWidth(width);
  }, []);

  const handleLayout = useCallback((e: any) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  return (
    <YStack gap="$1">
      <YStack gap="$2">
        <SizableText>Category</SizableText>
        <YStack position="relative" height="$10">
          <AnimatePresence>
            {showLeftFade && (
              <LinearGradient
                key="left-fade"
                position="absolute"
                left={0}
                top={0}
                bottom={0}
                width="$4"
                zIndex={1}
                colors={['$color2', 'transparent']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                animation="quick"
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showRightFade && (
              <LinearGradient
                key="right-fade"
                position="absolute"
                right={0}
                top={0}
                bottom={0}
                width="$4"
                zIndex={1}
                colors={['transparent', '$color2']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                animation="quick"
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
              />
            )}
          </AnimatePresence>
          <ScrollView
            horizontal
            width="100%"
            height="100%"
            onScroll={handleScroll}
            onContentSizeChange={handleContentSizeChange}
            onLayout={handleLayout}
            scrollEventThrottle={16} // Limit to ~60fps
            showsHorizontalScrollIndicator={false}
          >
            <XStack gap="$3" flex={1} flexWrap="nowrap">
              <RadioGroup
                value={value}
                onValueChange={onValueChange}
                orientation="horizontal"
                gap="$3"
              >
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
                            padding="$2"
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
                              <SizableText
                                fontSize="$2"
                                fontWeight={isSelected ? '600' : '500'}
                                color={isSelected ? '$color12' : '$color10'}
                                textAlign="center"
                                numberOfLines={2}
                              >
                                {category.label}
                              </SizableText>
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
      </YStack>
      {fieldApi && <FieldInfo field={fieldApi} />}
    </YStack>
  );
}
