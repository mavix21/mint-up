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
      localStorage.setItem(ONBOARDING_KEY, 'true');
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error('Error saving onboarding status to localStorage:', error);
    }
  }, []);

  const resetOnboarding = useCallback(() => {
    try {
      localStorage.removeItem(ONBOARDING_KEY);
      setHasCompletedOnboarding(false);
    } catch (error) {
      console.error('Error resetting onboarding status:', error);
    }
  }, []);

  return {
    hasCompletedOnboarding,
    isLoading,
    completeOnboarding,
    resetOnboarding,
  };
}
