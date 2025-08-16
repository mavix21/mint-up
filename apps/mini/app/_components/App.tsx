import { useState } from 'react';

import { FullPageSpinner } from './FullPageSpinner';
import { Navigator } from './Navigator';
import { OnboardingWrapper } from './OnboardingWrapper';

import { useMiniApp } from '@/contexts/mini-app.context';
import { useOnboarding } from '@/lib/hooks/useOnboarding';

export default function App() {
  const { isFrameReady } = useMiniApp();
  const { hasCompletedOnboarding, isLoading: isOnboardingLoading } = useOnboarding();
  const [userCompletedOnboarding, setUserCompletedOnboarding] = useState(false);

  // Debug logging to track state changes
  console.log('App render:', {
    isFrameReady,
    hasCompletedOnboarding,
    isOnboardingLoading,
    userCompletedOnboarding,
  });

  // Show loading spinner while frame is not ready or onboarding status is being determined
  if (!isFrameReady || isOnboardingLoading) {
    return <FullPageSpinner />;
  }

  // Show onboarding if user hasn't completed it yet
  if (!hasCompletedOnboarding && !userCompletedOnboarding) {
    return (
      <OnboardingWrapper
        onComplete={() => {
          console.log('onComplete called from App component');
          // Immediately set local state to show Navigator
          setUserCompletedOnboarding(true);
        }}
      />
    );
  }

  // Show main app navigation
  return <Navigator />;
}
