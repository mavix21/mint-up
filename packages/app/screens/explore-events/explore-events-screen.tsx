'use client';

import { api } from '@my/backend/_generated/api';
import {
  Button,
  Input,
  ScrollView,
  Paragraph,
  SizableText,
  XStack,
  YStack,
  View,
  Timeline,
  Container,
} from '@my/ui';
import { X } from '@tamagui/lucide-icons';
import { useForm } from '@tanstack/react-form';
import { validCategories } from 'app/entities';
import { dateUtils } from 'app/shared/lib/date';
import { SmallCardSkeleton } from 'app/shared/ui/SmallCardSkeleton';
import { useQuery } from 'convex/react';
import React from 'react';

import { ItemCardList } from './ui/ItemCardList';

export const ExploreEventsScreen = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const form = useForm({
    defaultValues: {
      searchTerm: '',
      selectedCategory: 'All',
    },
  });

  // Use a single query that handles both search and category filtering
  const events = useQuery(api.events.searchEvents, {
    searchTerm: searchTerm.trim() || undefined,
    category: selectedCategory,
  });

  // Add 'All' at the start of the categories list
  const categoryList = React.useMemo(() => {
    return [{ label: 'All' }, ...validCategories.filter(Boolean).map((cat) => ({ label: cat }))];
  }, []);

  return (
    <Container gap="$4" size="wide">
      <YStack gap="$3">
        <XStack alignItems="center" gap="$2" px="$4" pt="$2">
          <XStack flex={1} alignItems="center" gap="$2">
            <form.Field
              name="searchTerm"
              listeners={{
                onChange: ({ fieldApi }) => {
                  setSearchTerm(fieldApi.state.value);
                },
                onChangeDebounceMs: 500,
              }}
            >
              {(field) => {
                return (
                  <XStack gap="$2" flex={1} alignItems="center">
                    <Input
                      flex={1}
                      placeholder="Search events..."
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      size="$3"
                    />
                    {field.state.value.trim() !== '' && (
                      <Button
                        size="$2"
                        circular
                        onPress={() => field.handleChange('')}
                        backgroundColor="$background"
                        borderWidth={1}
                        borderColor="$borderColor"
                      >
                        <X size="$1" />
                      </Button>
                    )}
                  </XStack>
                );
              }}
            </form.Field>
          </XStack>
        </XStack>

        <ScrollView
          pl="$4"
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          <form.Field
            name="selectedCategory"
            listeners={{
              onChange: ({ fieldApi }) => {
                setSelectedCategory(fieldApi.state.value);
              },
              onChangeDebounceMs: 250,
            }}
          >
            {(field) => {
              return (
                <XStack gap="$2">
                  {categoryList.map((category) => {
                    const isSelected = field.state.value === category.label;
                    return (
                      <Button
                        key={category.label}
                        size="$3"
                        borderRadius="$10"
                        theme={isSelected ? 'green' : null}
                        onPress={() => field.handleChange(category.label)}
                      >
                        <Button.Text fontWeight={isSelected ? '600' : '400'} fontSize="$3">
                          {category.label}
                        </Button.Text>
                      </Button>
                    );
                  })}
                </XStack>
              );
            }}
          </form.Field>
        </ScrollView>
      </YStack>

      <YStack gap="$1" flex={1} overflowBlock="hidden">
        <Paragraph size="$2" height="$1" color="$color10" pl="$4">
          {searchTerm.trim() !== ''
            ? `Search results for "${searchTerm}"${
                events && events.length > 0 ? ` (${events.length})` : ''
              }`
            : events && events.length > 0
            ? `${events.length} events found`
            : events === undefined
            ? 'Searching...'
            : 'No events found'}
        </Paragraph>
        <ScrollView flex={1} p="$0" overflowBlock="scroll" paddingBottom="$4" gap="$2">
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
              {dateUtils
                .groupByDate(
                  events,
                  (event) => {
                    const date = new Date(event.startDate);
                    return date.toLocaleDateString();
                  },
                  'asc'
                )
                .map(([dateKey, groupedEvents]) => (
                  <Timeline key={dateKey}>
                    <Timeline.Line />

                    <Timeline.Content>
                      <Timeline.Dot />
                      <View mb="$3">
                        <SizableText fontSize="$2" color="$color11">
                          {dateUtils.formatRelativeDate(groupedEvents[0]?.startDate)}
                        </SizableText>
                        <SizableText fontSize="$2">
                          {dateUtils.getDayOfWeek(groupedEvents[0]?.startDate)}
                        </SizableText>
                      </View>
                      <YStack gap="$4">
                        {groupedEvents.map((event) => (
                          <ItemCardList key={event._id} event={event} />
                        ))}
                      </YStack>
                    </Timeline.Content>
                  </Timeline>
                ))}
            </YStack>
          )}
        </ScrollView>
      </YStack>
    </Container>
  );
};
