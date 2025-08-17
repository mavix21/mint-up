'use client';

import { Onboarding, View } from '@my/ui';
import { useSignIn } from 'app/shared/lib/hooks/use-sign-in';
import { useCallback, useMemo, useEffect } from 'react';

import { createOnboardingSteps } from './OnboardingSteps';

import { useOnboarding } from '@/lib/hooks/useOnboarding';

interface OnboardingWrapperProps {
  onComplete: () => void;
}

export function OnboardingWrapper({ onComplete }: OnboardingWrapperProps) {
  const { completeOnboarding } = useOnboarding();
  const { signIn, isLoading, isSignedIn, session } = useSignIn();

  // Complete onboarding when user is successfully authenticated
  useEffect(() => {
    if (isSignedIn && session) {
      completeOnboarding();
      onComplete();
    }
  }, [isSignedIn, session, completeOnboarding, onComplete]);

  // Memoize the callback functions to prevent infinite rerenders
  const handleOnboardingComplete = useCallback(() => {
    completeOnboarding();
    onComplete();
  }, [completeOnboarding, onComplete]);

  const handleSignIn = useCallback(() => {
    signIn();
    // Don't complete onboarding here - wait for authentication to complete
    // The useEffect above will handle completion when user is authenticated
  }, [signIn]);

  // Memoize the onboarding steps to prevent recreation on every render
  const onboardingSteps = useMemo(() => {
    return createOnboardingSteps({
      onSignIn: handleSignIn,
      onComplete: handleOnboardingComplete,
      isLoading,
    });
  }, [handleSignIn, handleOnboardingComplete, isLoading]);

  return (
    <View flex={1} height={'100vh' as any}>
      <Onboarding steps={onboardingSteps} autoSwipe={false} />
    </View>
  );
}
