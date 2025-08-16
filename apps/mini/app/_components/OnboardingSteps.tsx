'use client';

import { YStack, LoadingButton, Button, SizableText, Paragraph, Image, ThemeName } from '@my/ui';
import { Calendar, Users, Wallet } from '@tamagui/lucide-icons';
import { memo } from 'react';

interface OnboardingStepsProps {
  onSignIn: () => void;
  onComplete: () => void;
  isLoading: boolean;
}

// Memoize the Content components to prevent unnecessary rerenders
const WelcomeContent = memo(() => (
  <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" gap="$6">
    <Image src="/icon_no_bg.png" alt="Welcome" width={120} height={120} />
    <YStack alignItems="center" gap="$3">
      <SizableText
        userSelect="none"
        size="$10"
        fontWeight="bold"
        textAlign="center"
        color="$color11"
      >
        Welcome to Mint Up
      </SizableText>
      <Paragraph userSelect="none" size="$5" textAlign="center" color="$color11" maxWidth={372}>
        Create, discover, and collect digital experiences with blockchain-powered event tickets
      </Paragraph>
    </YStack>
  </YStack>
));

const CreateEventsContent = memo(() => (
  <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" gap="$6">
    <Calendar color="$color11" size={120} />
    <YStack alignItems="center" gap="$3">
      <SizableText
        userSelect="none"
        size="$10"
        fontWeight="bold"
        textAlign="center"
        color="$color11"
      >
        Create Amazing Events
      </SizableText>
      <Paragraph userSelect="none" size="$5" textAlign="center" color="$color10" maxWidth={300}>
        Design unique digital experiences and mint NFT tickets for your community
      </Paragraph>
    </YStack>
  </YStack>
));

const ConnectContent = memo(() => (
  <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" gap="$6">
    <Users color="$color11" size={120} />
    <YStack alignItems="center" gap="$3">
      <SizableText
        userSelect="none"
        size="$10"
        fontWeight="bold"
        textAlign="center"
        color="$color11"
      >
        Connect & Collect
      </SizableText>
      <Paragraph userSelect="none" size="$5" textAlign="center" color="$color10" maxWidth={300}>
        Discover events from creators you love and build your digital collection
      </Paragraph>
    </YStack>
  </YStack>
));

const ReadyContent = memo(({ onSignIn, onComplete, isLoading }: OnboardingStepsProps) => (
  <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" gap="$6">
    <Wallet color="$color11" size={120} />
    <YStack alignItems="center" gap="$3">
      <SizableText
        userSelect="none"
        size="$10"
        fontWeight="bold"
        textAlign="center"
        color="$color11"
      >
        Ready to Start?
      </SizableText>
      <Paragraph userSelect="none" size="$5" textAlign="center" color="$color10" maxWidth={380}>
        Join thousands of creators and collectors in the future of digital experiences
      </Paragraph>
      <YStack gap="$3" mt="$4" width="100%" maxWidth={280}>
        <LoadingButton
          themeInverse
          size="$4"
          onPress={onSignIn}
          isLoading={isLoading}
          label="Sign In & Continue"
        />
        <Button size="$4" onPress={onComplete}>
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
