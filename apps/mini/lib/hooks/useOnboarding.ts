'use client';

import { useState, useEffect, useCallback } from 'react';

const ONBOARDING_KEY = 'mint-up-onboarding-completed';

export function useOnboarding() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for onboarding completion status
    const checkOnboardingStatus = () => {
      try {
        const completed = localStorage.getItem(ONBOARDING_KEY);
        const isCompleted = completed === 'true';
        console.log('useOnboarding: checking status:', { completed, isCompleted });
        setHasCompletedOnboarding(isCompleted);
      } catch (error) {
        console.error('Error reading onboarding status from localStorage:', error);
        setHasCompletedOnboarding(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  const completeOnboarding = useCallback(() => {
    try {
      console.log('useOnboarding: completing onboarding');
      localStorage.setItem(ONBOARDING_KEY, 'true');
      setHasCompletedOnboarding(true);
      console.log('useOnboarding: onboarding completed, state updated');
    } catch (error) {
      console.error('Error saving onboarding status to localStorage:', error);
    }
  }, []);

  const resetOnboarding = useCallback(() => {
    try {
      console.log('useOnboarding: resetting onboarding');
      localStorage.removeItem(ONBOARDING_KEY);
      setHasCompletedOnboarding(false);
    } catch (error) {
      console.error('Error resetting onboarding status:', error);
    }
  }, []);

  // Debug logging for state changes
  console.log('useOnboarding: current state:', { hasCompletedOnboarding, isLoading });

  return {
    hasCompletedOnboarding,
    isLoading,
    completeOnboarding,
    resetOnboarding,
  };
}
