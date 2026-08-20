/**
 * Trips Hook
 * Custom hook for managing trips
 */

import { useState, useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import tripsService from '../services/trips';
import { Trip } from '../types';

export const useTrips = (userId?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trips = useAppStore((state) => state.trips);
  const setTrips = useAppStore((state) => state.setTrips);
  const addTrip = useAppStore((state) => state.addTrip);
  const updateTrip = useAppStore((state) => state.updateTrip);
  const removeTrip = useAppStore((state) => state.removeTrip);

  const fetchUserTrips = useCallback(async (uid: string) => {
    if (!uid) return;

    setIsLoading(true);
    setError(null);

    try {
      const userTrips = await tripsService.getUserTrips(uid);
      setTrips(userTrips);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch trips');
    } finally {
      setIsLoading(false);
    }
  }, [setTrips]);

  const createTrip = useCallback(
    async (tripData: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>) => {
      setIsLoading(true);
      setError(null);

      try {
        const newTrip = await tripsService.createTrip(tripData);
        addTrip(newTrip);
        return newTrip;
      } catch (err: any) {
        setError(err.message || 'Failed to create trip');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [addTrip]
  );

  const editTrip = useCallback(
    async (tripId: string, updates: Partial<Trip>) => {
      setIsLoading(true);
      setError(null);

      try {
        await tripsService.updateTrip(tripId, updates);
        const updatedTrip = { ...trips.find((t) => t.id === tripId), ...updates } as Trip;
        updateTrip(updatedTrip);
        return updatedTrip;
      } catch (err: any) {
        setError(err.message || 'Failed to update trip');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [trips, updateTrip]
  );

  const deleteTrip = useCallback(
    async (tripId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        await tripsService.deleteTrip(tripId);
        removeTrip(tripId);
      } catch (err: any) {
        setError(err.message || 'Failed to delete trip');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [removeTrip]
  );

  return {
    trips,
    isLoading,
    error,
    fetchUserTrips,
    createTrip,
    editTrip,
    deleteTrip,
  };
};
