import { api } from '@my/backend/_generated/api';
import {
  Button,
  formatRelativeDate,
  formatDate,
  Card,
  Image,
  Input,
  isWeb,
  ScrollView,
  styled,
  Text,
  View,
  XStack,
  YStack,
} from '@my/ui';
import { formatDateTime } from '@my/ui/src/lib/dates';
import { ListFilter } from '@tamagui/lucide-icons';
import { AnimationProp } from '@tamagui/web';
import { useQuery } from 'convex/react';
import React from 'react';

const data = [
  {
    uri: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png',
    title: 'Jakarta',
  },
  { uri: 'HLIST_2.jpg', title: 'Bandung' },
  { uri: 'HLIST_3.jpg', title: 'SaiGon' },
  { uri: 'HLIST_4.jpg', title: 'Tokyo' },
  { uri: 'HLIST_5.jpg', title: 'Semarang' },
  { uri: 'HLIST_6.jpg', title: 'Malang' },
];

const categories = [
  { id: 'all', label: 'All', color: '$green12' },
  { id: 'art', label: 'Art', color: '$green11' },
  { id: 'music', label: 'Music', color: '$green10' },
  { id: 'sport', label: 'Sport', color: '$green9' },
  { id: 'tech', label: 'Tech', color: '$green8' },
  { id: 'food', label: 'Food', color: '$green7' },
];

export const ExploreEventsScreen = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const events = useQuery(api.events.getAllEvents);

  return (
    <YStack>
      <XStack alignItems="center" space="$2" px="$4" pt="$5">
        <Input flex={1} size="$2" placeholder="Search" />
        <Button size="$2">
          <ListFilter size="$1" />
        </Button>
      </XStack>
      <View f={1} w="100%" h="$12">
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
      </View>
      <YStack px="$4">
        <View>
          <Text fontSize="$3">Trending</Text>
        </View>
      </YStack>
      <ScrollView
        pl="$4"
        pt="$2"
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 20 }}
      >
        <XStack space="$2">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.label;
            return (
              <Button
                key={category.id}
                size="$3"
                paddingHorizontal="$4"
                paddingVertical="$2"
                borderRadius="$10"
                backgroundColor={isSelected ? category.color : '$background'}
                borderWidth={1}
                borderColor={isSelected ? category.color : '$borderColor'}
                hoverStyle={{ backgroundColor: isSelected ? category.color : '$borderColor' }}
                pressStyle={{
                  scale: 0.98,
                  backgroundColor: isSelected ? category.color : '$backgroundPress',
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
      <YStack>
        {events?.map((event) => {
          return (
            <Card
              key={event._id}
              elevate
              size="$4"
              bordered
              backgroundColor="$background"
              margin="$4"
              borderRadius="$4"
              pressStyle={{ scale: 0.975 }}
              hoverStyle={{ borderColor: '$borderColorHover' }}
            >
              <XStack space="$3" alignItems="center">
                {/* App Icon */}
                <Image
                  width={100}
                  height={100}
                  borderRadius="$2"
                  backgroundColor="white"
                  src={event.imageUrl}
                />

                {/* App Info */}
                <YStack flex={1} space="$1">
                  <Text fontSize="$2" color="$color11" numberOfLines={1}>
                    {formatDate(formatRelativeDate(event.startDate))} •{' '}
                    {formatDateTime(formatRelativeDate(event.startDate))}
                  </Text>
                  <Text fontSize="$4" color="$color" numberOfLines={3}>
                    {event.name}
                  </Text>
                </YStack>
              </XStack>
            </Card>
          );
        })}
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
      <HListInner containerType="normal" group="listitem" animation="bouncy">
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
