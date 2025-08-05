'use client';

import { api } from '@my/backend/_generated/api';
import {
  Button,
  Image,
  Input,
  ScrollView,
  Paragraph,
  SizableText,
  styled,
  Text,
  View,
  XStack,
  YStack,
} from '@my/ui';
import { X } from '@tamagui/lucide-icons';
import { AnimationProp } from '@tamagui/web';
import { SmallCardSkeleton } from 'app/shared/ui/SmallCardSkeleton';
import { useQuery } from 'convex/react';
import React from 'react';

import { ItemCardList } from './ui/ItemCardList';

export const ExploreEventsScreen = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [searchTerm, setSearchTerm] = React.useState('');

  // Use a single query that handles both search and category filtering
  const events = useQuery(api.events.searchEvents, {
    searchTerm: searchTerm.trim() || undefined,
    category: selectedCategory,
  });

  const categories = useQuery(api.events.getEventCategories);

  // Add 'All' at the start of the categories list
  const categoryList = React.useMemo(() => {
    if (!categories) return [{ label: 'All' }];
    return [{ label: 'All' }, ...categories.map((cat) => ({ label: cat }))];
  }, [categories]);

  // Handle search input change
  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
    // If user starts searching and we're not on "All" category, switch to "All"
    if (text.trim() && selectedCategory !== 'All') {
      setSelectedCategory('All');
    }
  };

  // Handle keyboard events
  const handleKeyPress = (e: any) => {
    if (e.key === 'Escape') {
      setSearchTerm('');
    }
  };

  return (
    <YStack gap="$4">
      <YStack gap="$3">
        <XStack alignItems="center" gap="$2" px="$4" pt="$2">
          <XStack flex={1} alignItems="center" gap="$2">
            <Input
              flex={1}
              placeholder="Search events..."
              value={searchTerm}
              onChangeText={handleSearchChange}
              onKeyPress={handleKeyPress}
              size="$3"
            />
            {searchTerm.trim() !== '' && (
              <Button
                size="$2"
                circular
                onPress={() => setSearchTerm('')}
                backgroundColor="$background"
                borderWidth={1}
                borderColor="$borderColor"
              >
                <X size="$1" />
              </Button>
            )}
          </XStack>
          {/* //**TODO: See what filter put here*/}
          {/* <Button size="$2">
            <ListFilter size="$1" />
          </Button> */}
        </XStack>
        {/* //**TODO: See what info show here*/}
        {/* <View f={1} w="100%" h="$12">
          <ScrollView
            {...(isWeb && {
              ai: 'center',
            })}
            showsHorizontalScrollIndicator={false}
            pl="5%"
            pr="$6"
            horizontal
          >
            <View flexDirection="row" gap="$6" h="50%">
              {data.map(({ uri, title }) => (
                <HListItem key={uri} uri={uri} title={title} />
              ))}
            </View>
          </ScrollView>
        </View> */}

        <ScrollView
          pl="$4"
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          <XStack gap="$2">
            {categoryList.map((category) => {
              const isSelected = selectedCategory === category.label;
              return (
                <Button
                  key={category.label}
                  size="$3"
                  borderRadius="$10"
                  theme={isSelected ? 'green' : null}
                  onPress={() => setSelectedCategory(category.label)}
                >
                  <Button.Text fontWeight={isSelected ? '600' : '400'} fontSize="$3">
                    {category.label}
                  </Button.Text>
                </Button>
              );
            })}
          </XStack>
        </ScrollView>
      </YStack>

      <YStack gap="$1">
        <Paragraph size="$2" height="$1" color="$color10" pl="$4">
          {searchTerm.trim() !== ''
            ? `Search results for "${searchTerm}"${
                events && events.length > 0 ? ` (${events.length})` : ''
              }`
            : events && events.length > 0
            ? `${events.length} events found`
            : 'Searching...'}
        </Paragraph>
        <ScrollView
          flex={1}
          p="$0"
          maxHeight={'75vh' as any}
          $lg={{ paddingBottom: '$12' }}
          gap="$2"
        >
          {events === undefined ? (
            // Loading state - show placeholder items that will render individual skeletons
            <YStack gap="$2">
              {Array.from({ length: 6 }, (_, index) => (
                <SmallCardSkeleton key={`loading-${index}`} />
              ))}
            </YStack>
          ) : events.length === 0 ? (
            // Empty state
            <YStack flex={1} justifyContent="center" alignItems="center" py="$8">
              <SizableText color="$color11" fontSize="$4" textAlign="center">
                {searchTerm.trim()
                  ? `No events found for "${searchTerm}"`
                  : selectedCategory !== 'All'
                  ? `No events found in ${selectedCategory} category`
                  : 'No events found'}
              </SizableText>
            </YStack>
          ) : (
            // Events list
            <YStack gap="$4" px="$4">
              {events.map((event) => {
                return <ItemCardList key={event._id} event={event} />;
              })}
            </YStack>
          )}
        </ScrollView>
      </YStack>
    </YStack>
  );
};

const animationFast = [
  'quick',
  {
    opacity: {
      overshootClamping: true,
    },
  },
] as AnimationProp;

const animationMedium = [
  'slow',
  {
    opacity: {
      overshootClamping: true,
    },
  },
] as AnimationProp;

const animationSlow = [
  'medium',
  {
    opacity: {
      overshootClamping: true,
    },
  },
] as AnimationProp;

function HListItem({ uri, title }: { uri: string; title: string }) {
  return (
    <HListFrame
      animation={animationFast}
      pressStyle={{
        scale: 0.98,
      }}
    >
      <HListInner containerType="normal" group animation="bouncy">
        <View
          flexDirection="column"
          f={1}
          scale={1.2}
          animation={animationMedium}
          $group-listitem-hover={{
            scale: 1.2,
          }}
        >
          <Image
            width="100%"
            height={100}
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png',
              width: 200,
              height: 200,
            }}
            scale={1}
          />
        </View>
        <View
          position="absolute"
          animation={animationMedium}
          bottom={0}
          left={0}
          right={0}
          paddingVertical="$7"
          backgroundColor="rgba(0,0,0,0.25)"
          $group-listitem-hover={{
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <Text
            animation={animationSlow}
            color="#fff"
            marginVertical="auto"
            alignSelf="center"
            fontWeight={600}
            y={0}
            textShadowColor="$shadowColor"
            textShadowOffset={{ height: 1, width: 0 }}
            textShadowRadius={0}
            $group-listitem-hover={{
              y: -4,
              scale: 1.075,
              textShadowColor: '$shadowColor',
              textShadowOffset: { height: 2, width: 0 },
              textShadowRadius: 10,
            }}
          >
            {title}
          </Text>
        </View>
      </HListInner>
    </HListFrame>
  );
}

const HListFrame = styled(View, {
  width: 200,
  animateOnly: ['borderRadius', 'transform'],
  height: 100,
  borderWidth: 1,
  borderColor: '$color3',
  borderRadius: '$10',
  backgroundColor: '$background',
  shadowColor: '$shadowColor',
  shadowRadius: 3,

  hoverStyle: {
    scale: 1.05,
    borderRadius: '$11',
    shadowColor: '$shadowColor',
    shadowRadius: 20,
  },
});

const HListInner = styled(View, {
  width: 200,
  height: 100,
  ov: 'hidden',
  borderRadius: '$10',

  hoverStyle: {
    borderRadius: '$11',
  },
});
