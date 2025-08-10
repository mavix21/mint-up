/**
 * Environment detection utilities
 * Provides reliable ways to determine the current environment
 */

/**
 * Check if the current environment is development
 * Uses multiple fallback methods for reliability
 */
export const isDevelopment = (): boolean => {
  // Primary check: NODE_ENV
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  // Secondary check: Vercel environment
  if (process.env.VERCEL_ENV === 'development') {
    return true;
  }

  // Tertiary check: Check if we're running locally
  if (typeof window !== 'undefined') {
    // Client-side: check hostname
    const hostname = window.location.hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('localhost');
  }

  // Server-side: check if we're not in production
  return process.env.NODE_ENV !== 'production';
};

/**
 * Check if the current environment is production
 */
export const isProduction = (): boolean => {
  return !isDevelopment();
};

/**
 * Get the current environment name
 */
export const getEnvironment = (): 'development' | 'production' | 'test' => {
  if (isDevelopment()) {
    return 'development';
  }

  if (process.env.NODE_ENV === 'test') {
    return 'test';
  }

  return 'production';
};

/**
 * Check if running on Vercel
 */
export const isVercel = (): boolean => {
  return !!process.env.VERCEL;
};

/**
 * Get Vercel environment (if applicable)
 */
export const getVercelEnvironment = (): string | undefined => {
  return process.env.VERCEL_ENV;
};
