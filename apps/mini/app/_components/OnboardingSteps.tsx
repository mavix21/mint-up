'use client';

import { YStack, LoadingButton, Button, SizableText, Paragraph } from '@my/ui';
import { Calendar, Users, Sparkles, Wallet } from '@tamagui/lucide-icons';
import { memo } from 'react';
import { ThemeName } from 'tamagui';

interface OnboardingStepsProps {
  onSignIn: () => void;
  onComplete: () => void;
  isLoading: boolean;
}

// Memoize the Content components to prevent unnecessary rerenders
const WelcomeContent = memo(() => (
  <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" gap="$6">
    <Sparkles size={80} color="$blue10" />
    <YStack alignItems="center" gap="$3">
      <SizableText size="$10" fontWeight="bold" textAlign="center">
        Welcome to MintUp
      </SizableText>
      <Paragraph size="$5" textAlign="center" color="$color11" maxWidth={300}>
        Create, discover, and collect digital experiences with blockchain-powered event tickets
      </Paragraph>
    </YStack>
  </YStack>
));

const CreateEventsContent = memo(() => (
  <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" gap="$6">
    <Calendar size={80} color="$green10" />
    <YStack alignItems="center" gap="$3">
      <SizableText size="$10" fontWeight="bold" textAlign="center">
        Create Amazing Events
      </SizableText>
      <Paragraph size="$5" textAlign="center" color="$color11" maxWidth={300}>
        Design unique digital experiences and mint NFT tickets for your community
      </Paragraph>
    </YStack>
  </YStack>
));

const ConnectContent = memo(() => (
  <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" gap="$6">
    <Users size={80} color="$purple10" />
    <YStack alignItems="center" gap="$3">
      <SizableText size="$10" fontWeight="bold" textAlign="center">
        Connect & Collect
      </SizableText>
      <Paragraph size="$5" textAlign="center" color="$color11" maxWidth={300}>
        Discover events from creators you love and build your digital collection
      </Paragraph>
    </YStack>
  </YStack>
));

const ReadyContent = memo(({ onSignIn, onComplete, isLoading }: OnboardingStepsProps) => (
  <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" gap="$6">
    <Wallet size={80} color="$orange10" />
    <YStack alignItems="center" gap="$3">
      <SizableText size="$10" fontWeight="bold" textAlign="center">
        Ready to Start?
      </SizableText>
      <Paragraph size="$5" textAlign="center" color="$color11" maxWidth={300}>
        Join thousands of creators and collectors in the future of digital experiences
      </Paragraph>
      <YStack gap="$3" mt="$4" width="100%" maxWidth={280}>
        <LoadingButton
          size="$4"
          onPress={onSignIn}
          isLoading={isLoading}
          label="Sign In & Continue"
        />
        <Button size="$4" theme="gray" onPress={onComplete}>
          <Button.Text>Explore as Guest</Button.Text>
        </Button>
      </YStack>
    </YStack>
  </YStack>
));

export const createOnboardingSteps = ({
  onSignIn,
  onComplete,
  isLoading,
}: OnboardingStepsProps) => [
  {
    theme: 'green' as ThemeName,
    Content: WelcomeContent,
  },
  {
    theme: 'blue' as ThemeName,
    Content: CreateEventsContent,
  },
  {
    theme: 'purple' as ThemeName,
    Content: ConnectContent,
  },
  {
    theme: 'green' as ThemeName,
    Content: () => (
      <ReadyContent onSignIn={onSignIn} onComplete={onComplete} isLoading={isLoading} />
    ),
  },
];
