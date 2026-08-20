/**
 * Utility Functions
 * Common helper functions used throughout the app
 */

import { format, parseISO, differenceInDays } from 'date-fns';

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format date
 */
export const formatDate = (date: Date | string, formatStr: string = 'MMM dd, yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

/**
 * Format time
 */
export const formatTime = (date: Date | string, format24h: boolean = false): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, format24h ? 'HH:mm' : 'h:mm a');
};

/**
 * Calculate days between two dates
 */
export const calculateDaysBetween = (startDate: Date | string, endDate: Date | string): number => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  return differenceInDays(end, start);
};

/**
 * Format distance for display (e.g., "1.5 km")
 */
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

/**
 * Validate email
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  score: number;
  errors: string[];
} => {
  const errors: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score++;
  } else {
    errors.push('Password must be at least 8 characters');
  }

  if (/[a-z]/.test(password)) {
    score++;
  } else {
    errors.push('Password must contain lowercase letters');
  }

  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    errors.push('Password must contain uppercase letters');
  }

  if (/\d/.test(password)) {
    score++;
  } else {
    errors.push('Password must contain numbers');
  }

  if (/[!@#$%^&*]/.test(password)) {
    score++;
  } else {
    errors.push('Password should contain special characters');
  }

  return {
    isValid: errors.length === 0,
    score,
    errors,
  };
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Generate random ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Rate limiting function
 */
export const createRateLimiter = (delayMs: number) => {
  let lastCall = 0;
  return (fn: () => void) => {
    const now = Date.now();
    if (now - lastCall >= delayMs) {
      lastCall = now;
      fn();
    }
  };
};

/**
 * Retry async function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      const delay = initialDelay * Math.pow(2, i);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as T;
  }

  if (obj instanceof Object) {
    const clonedObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj as T;
  }

  return obj;
};
