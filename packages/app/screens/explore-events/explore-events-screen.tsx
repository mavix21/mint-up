'use client';

import { api } from '@my/backend/_generated/api';
import {
  Button,
  Image,
  Input,
  ScrollView,
  SizableText,
  styled,
  Text,
  View,
  XStack,
  YStack,
} from '@my/ui';
import { X } from '@tamagui/lucide-icons';
import { AnimationProp } from '@tamagui/web';
import { useQuery } from 'convex/react';
import React from 'react';

import { ItemCardList } from './ui/ItemCardList';

export const ExploreEventsScreen = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [searchTerm, setSearchTerm] = React.useState('');

  // Use searchEvents query when there's a search term, otherwise use getEventsByCategory
  const searchResults = useQuery(api.events.searchEvents, {
    searchTerm: searchTerm.trim() || undefined,
    category: selectedCategory,
  });

  const categoryEvents = useQuery(api.events.getEventsByCategory, { category: selectedCategory });

  const categories = useQuery(api.events.getEventCategories);

  // Use search results if there's a search term, otherwise use category events
  const events = searchTerm.trim() ? searchResults : categoryEvents;

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
    <YStack>
      <XStack alignItems="center" gap="$2" px="$4" pt="$5">
        <XStack flex={1} alignItems="center" gap="$2">
          <Input
            flex={1}
            placeholder="Search events..."
            value={searchTerm}
            onChangeText={handleSearchChange}
            onKeyPress={handleKeyPress}
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
      <YStack px="$4" pt="$4">
        <View>
          <Text fontSize="$3">
            {searchTerm.trim()
              ? `Search results for "${searchTerm}"${
                  events && events.length > 0 ? ` (${events.length})` : ''
                }`
              : ''}
          </Text>
        </View>
      </YStack>
      <ScrollView
        pl="$4"
        pt="$2"
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 20 }}
      >
        <XStack gap="$2" mb="$3">
          {categoryList.map((category) => {
            const isSelected = selectedCategory === category.label;
            return (
              <Button
                key={category.label}
                size="$3"
                paddingHorizontal="$4"
                paddingVertical="$2"
                borderRadius="$10"
                backgroundColor={isSelected ? '$color11' : '$background'}
                borderWidth={1}
                borderColor={isSelected ? '$color11' : '$borderColor'}
                hoverStyle={{ backgroundColor: isSelected ? '$color11' : '$borderColor' }}
                pressStyle={{
                  scale: 0.98,
                  backgroundColor: isSelected ? '$color10' : '$backgroundPress',
                }}
                onPress={() => setSelectedCategory(category.label)}
              >
                <Text
                  color={isSelected ? 'white' : '$color'}
                  fontWeight={isSelected ? '600' : '400'}
                  fontSize="$3"
                >
                  {category.label}
                </Text>
              </Button>
            );
          })}
        </XStack>
      </ScrollView>
      <YStack flex={1} overflow="scroll" maxHeight={'75vh' as any} $lg={{ paddingBottom: '$14' }}>
        {events === undefined ? (
          // Loading state - show placeholder items that will render individual skeletons
          Array.from({ length: 6 }, (_, index) => (
            <ItemCardList key={`loading-${index}`} id={`loading-${index}`} />
          ))
        ) : events.length === 0 ? (
          // Empty state
          <YStack flex={1} justifyContent="center" alignItems="center" py="$8">
            <SizableText color="$color11" fontSize="$4" textAlign="center">
              {searchTerm.trim()
                ? `No events found for "${searchTerm}"`
                : `No events found in ${selectedCategory} category`}
            </SizableText>
          </YStack>
        ) : (
          // Events list
          events.map((event) => {
            return <ItemCardList key={event._id} id={event._id} />;
          })
        )}
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
