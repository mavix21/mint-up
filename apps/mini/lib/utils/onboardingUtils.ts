const ONBOARDING_KEY = 'mint-up-onboarding-completed';

export const onboardingUtils = {
  /**
   * Reset onboarding status (useful for testing)
   */
  resetOnboarding: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ONBOARDING_KEY);
    }
  },

  /**
   * Check if onboarding is completed
   */
  isOnboardingCompleted: (): boolean => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ONBOARDING_KEY) === 'true';
    }
    return false;
  },

  /**
   * Mark onboarding as completed
   */
  markOnboardingCompleted: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ONBOARDING_KEY, 'true');
    }
  },
};
