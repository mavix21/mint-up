import { api } from '@my/backend/_generated/api';
import type { Id } from '@my/backend/_generated/dataModel';
import { useQuery } from '@my/backend/react';
import {
  YStack,
  XStack,
  RadioGroup,
  Label,
  Paragraph,
  Select,
  Adapt,
  Sheet,
  withStaticProperties,
} from '@my/ui';
import { Check, ChevronDown, User, Users } from '@tamagui/lucide-icons';
import React, { createContext, useContext, useMemo } from 'react';

import {
  EVENT_OWNERSHIP_METADATA,
  type EventOwnershipType,
} from '../../entities/event-ownership/constants';
import type { OrganizationSummary } from '../../entities/event-ownership/model';

/**
 * Context for managing event ownership selection state
 */
interface EventOwnershipSelectorContextValue {
  ownershipType: EventOwnershipType;
  selectedOrganizationId: Id<'organizations'> | null;
  onOwnershipTypeChange: (type: EventOwnershipType) => void;
  onOrganizationChange: (orgId: Id<'organizations'> | null) => void;
  organizations: OrganizationSummary[];
  isLoadingOrganizations: boolean;
}

const EventOwnershipSelectorContext = createContext<EventOwnershipSelectorContextValue | undefined>(
  undefined
);

/**
 * Hook to access EventOwnershipSelector context
 */
function useEventOwnershipSelector() {
  const context = useContext(EventOwnershipSelectorContext);
  if (!context) {
    throw new Error(
      'EventOwnershipSelector compound components must be used within EventOwnershipSelector'
    );
  }
  return context;
}

/**
 * Root Props
 */
export interface EventOwnershipSelectorProps {
  ownershipType: EventOwnershipType;
  selectedOrganizationId: Id<'organizations'> | null;
  onOwnershipTypeChange: (type: EventOwnershipType) => void;
  onOrganizationChange: (orgId: Id<'organizations'> | null) => void;
  children: React.ReactNode;
}

/**
 * Root component - manages state and data fetching
 */
function EventOwnershipSelectorRoot({
  ownershipType,
  selectedOrganizationId,
  onOwnershipTypeChange,
  onOrganizationChange,
  children,
}: EventOwnershipSelectorProps) {
  const organizations = useQuery(api.organizations.getUserAdminOrganizations) ?? [];
  const isLoadingOrganizations = organizations === undefined;

  const contextValue = useMemo(
    () => ({
      ownershipType,
      selectedOrganizationId,
      onOwnershipTypeChange,
      onOrganizationChange,
      organizations,
      isLoadingOrganizations,
    }),
    [
      ownershipType,
      selectedOrganizationId,
      onOwnershipTypeChange,
      onOrganizationChange,
      organizations,
      isLoadingOrganizations,
    ]
  );

  return (
    <EventOwnershipSelectorContext.Provider value={contextValue}>
      {children}
    </EventOwnershipSelectorContext.Provider>
  );
}

/**
 * Radio group for selecting Individual or Community
 */
function EventOwnershipTypeSelector() {
  const { ownershipType, onOwnershipTypeChange } = useEventOwnershipSelector();

  return (
    <RadioGroup
      value={ownershipType}
      onValueChange={(val: string) => onOwnershipTypeChange(val as EventOwnershipType)}
      gap="$3"
    >
      <XStack gap="$3" alignItems="center">
        <RadioGroup.Item value="individual" id="ownership-individual" size="$4">
          <RadioGroup.Indicator />
        </RadioGroup.Item>
        <Label htmlFor="ownership-individual" f={1}>
          <YStack gap="$1">
            <XStack gap="$2" alignItems="center">
              <User size={16} />
              <Paragraph fontWeight="600">{EVENT_OWNERSHIP_METADATA.individual.label}</Paragraph>
            </XStack>
            <Paragraph fontSize="$2" color="$color10">
              {EVENT_OWNERSHIP_METADATA.individual.description}
            </Paragraph>
          </YStack>
        </Label>
      </XStack>

      <XStack gap="$3" alignItems="center">
        <RadioGroup.Item value="community" id="ownership-community" size="$4">
          <RadioGroup.Indicator />
        </RadioGroup.Item>
        <Label htmlFor="ownership-community" f={1}>
          <YStack gap="$1">
            <XStack gap="$2" alignItems="center">
              <Users size={16} />
              <Paragraph fontWeight="600">{EVENT_OWNERSHIP_METADATA.community.label}</Paragraph>
            </XStack>
            <Paragraph fontSize="$2" color="$color10">
              {EVENT_OWNERSHIP_METADATA.community.description}
            </Paragraph>
          </YStack>
        </Label>
      </XStack>
    </RadioGroup>
  );
}

/**
 * Dropdown for selecting a community (only shown when community is selected)
 */
function EventOwnershipCommunityDropdown() {
  const {
    ownershipType,
    selectedOrganizationId,
    onOrganizationChange,
    organizations,
    isLoadingOrganizations,
  } = useEventOwnershipSelector();

  if (ownershipType !== 'community') {
    return null;
  }

  if (isLoadingOrganizations) {
    return <Paragraph color="$color10">Loading communities...</Paragraph>;
  }

  if (organizations.length === 0) {
    return (
      <Paragraph color="$red10" fontSize="$3">
        You don&apos;t manage any communities yet. Create one first or ask to be made an admin.
      </Paragraph>
    );
  }

  return (
    <YStack gap="$2">
      <Label fontSize="$3" fontWeight="600">
        Select Community
      </Label>
      <Select
        value={selectedOrganizationId ?? ''}
        onValueChange={(val) => onOrganizationChange(val as Id<'organizations'>)}
      >
        <Select.Trigger iconAfter={ChevronDown} width="100%">
          <Select.Value placeholder="Choose a community" />
        </Select.Trigger>

        <Adapt when="sm" platform="touch">
          <Sheet modal dismissOnSnapToBottom>
            <Sheet.Frame>
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay />
          </Sheet>
        </Adapt>

        <Select.Content zIndex={200000}>
          <Select.ScrollUpButton />
          <Select.Viewport>
            <Select.Group>
              {organizations.map((org) => (
                <Select.Item key={org._id} index={0} value={org._id}>
                  <Select.ItemText>{org.name}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check size={16} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Viewport>
          <Select.ScrollDownButton />
        </Select.Content>
      </Select>
    </YStack>
  );
}

/**
 * EventOwnershipSelector - Compound component for selecting event ownership type
 *
 * @example
 * ```tsx
 * <EventOwnershipSelector
 *   ownershipType={ownershipType}
 *   selectedOrganizationId={organizationId}
 *   onOwnershipTypeChange={setOwnershipType}
 *   onOrganizationChange={setOrganizationId}
 * >
 *   <EventOwnershipSelector.TypeSelector />
 *   <EventOwnershipSelector.CommunityDropdown />
 * </EventOwnershipSelector>
 * ```
 */
export const EventOwnershipSelector = withStaticProperties(EventOwnershipSelectorRoot, {
  TypeSelector: EventOwnershipTypeSelector,
  CommunityDropdown: EventOwnershipCommunityDropdown,
});
