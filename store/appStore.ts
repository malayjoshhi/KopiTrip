/**
 * App Store - Zustand
 * Global state management for the travel app
 */

import { create } from 'zustand';
import { User, Trip, Notification, UserPreferences } from '../types';

interface AppStore {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;

  // UI state
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;

  // Trips state
  currentTrip: Trip | null;
  trips: Trip[];
  setCurrentTrip: (trip: Trip | null) => void;
  setTrips: (trips: Trip[]) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (trip: Trip) => void;
  removeTrip: (tripId: string) => void;

  // Notifications
  notifications: Notification[];
  unreadNotifications: number;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;

  // User preferences
  preferences: UserPreferences | null;
  setPreferences: (preferences: UserPreferences) => void;

  // Search/Filter state
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Reset store
  reset: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  // Auth state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),
  setIsLoading: (isLoading) => set({ isLoading }),

  // UI state
  theme: 'light',
  setTheme: (theme) => set({ theme }),

  // Trips state
  currentTrip: null,
  trips: [],
  setCurrentTrip: (trip) => set({ currentTrip: trip }),
  setTrips: (trips) => set({ trips }),
  addTrip: (trip) =>
    set((state) => ({
      trips: [...state.trips, trip],
    })),
  updateTrip: (trip) =>
    set((state) => ({
      trips: state.trips.map((t) => (t.id === trip.id ? trip : t)),
    })),
  removeTrip: (tripId) =>
    set((state) => ({
      trips: state.trips.filter((t) => t.id !== tripId),
    })),

  // Notifications
  notifications: [],
  unreadNotifications: 0,
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadNotifications: !notification.read ? state.unreadNotifications + 1 : state.unreadNotifications,
    })),
  markNotificationAsRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
      unreadNotifications: Math.max(0, state.unreadNotifications - 1),
    })),
  clearNotifications: () =>
    set({
      notifications: [],
      unreadNotifications: 0,
    }),

  // User preferences
  preferences: null,
  setPreferences: (preferences) => set({ preferences }),

  // Search/Filter state
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Reset store
  reset: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      currentTrip: null,
      trips: [],
      notifications: [],
      unreadNotifications: 0,
      preferences: null,
      searchQuery: '',
    }),
}));
