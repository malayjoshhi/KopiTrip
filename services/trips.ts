/**
 * Trips Service
 * Handles trip planning, itinerary management, and trip operations
 */

import { firestore } from './firebase';
import { Trip, ItineraryDay, Activity } from '../types';

class TripService {
  /**
   * Create a new trip
   */
  async createTrip(trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Promise<Trip> {
    try {
      const docRef = await firestore().collection('trips').add({
        ...trip,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return {
        ...trip,
        id: docRef.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create trip');
    }
  }

  /**
   * Get all trips for a user
   */
  async getUserTrips(userId: string): Promise<Trip[]> {
    try {
      const snapshot = await firestore()
        .collection('trips')
        .where('userId', '==', userId)
        .orderBy('startDate', 'desc')
        .get();

      return snapshot.docs.map((doc: any) => ({
        ...doc.data(),
        id: doc.id,
      })) as Trip[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch trips');
    }
  }

  /**
   * Get trip by ID
   */
  async getTrip(tripId: string): Promise<Trip | null> {
    try {
      const doc = await firestore().collection('trips').doc(tripId).get();
      if (!doc.exists) return null;
      return { ...doc.data(), id: doc.id } as Trip;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch trip');
    }
  }

  /**
   * Update trip details
   */
  async updateTrip(tripId: string, updates: Partial<Trip>): Promise<void> {
    try {
      await firestore().collection('trips').doc(tripId).update({
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update trip');
    }
  }

  /**
   * Delete trip
   */
  async deleteTrip(tripId: string): Promise<void> {
    try {
      await firestore().collection('trips').doc(tripId).delete();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete trip');
    }
  }

  /**
   * Add activity to itinerary day
   */
  async addActivity(tripId: string, dayNumber: number, activity: Activity): Promise<void> {
    try {
      const trip = await this.getTrip(tripId);
      if (!trip) throw new Error('Trip not found');

      const day = trip.itinerary.find((d) => d.dayNumber === dayNumber);
      if (!day) throw new Error('Day not found in itinerary');

      day.activities.push(activity);

      await this.updateTrip(tripId, { itinerary: trip.itinerary });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to add activity');
    }
  }

  /**
   * Remove activity from itinerary
   */
  async removeActivity(tripId: string, dayNumber: number, activityId: string): Promise<void> {
    try {
      const trip = await this.getTrip(tripId);
      if (!trip) throw new Error('Trip not found');

      const day = trip.itinerary.find((d) => d.dayNumber === dayNumber);
      if (!day) throw new Error('Day not found');

      day.activities = day.activities.filter((a) => a.id !== activityId);

      await this.updateTrip(tripId, { itinerary: trip.itinerary });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to remove activity');
    }
  }

  /**
   * Update activity
   */
  async updateActivity(
    tripId: string,
    dayNumber: number,
    activityId: string,
    updates: Partial<Activity>
  ): Promise<void> {
    try {
      const trip = await this.getTrip(tripId);
      if (!trip) throw new Error('Trip not found');

      const day = trip.itinerary.find((d) => d.dayNumber === dayNumber);
      if (!day) throw new Error('Day not found');

      const activity = day.activities.find((a) => a.id === activityId);
      if (!activity) throw new Error('Activity not found');

      Object.assign(activity, updates);

      await this.updateTrip(tripId, { itinerary: trip.itinerary });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update activity');
    }
  }

  /**
   * Share trip with other users
   */
  async shareTrip(tripId: string, userIds: string[]): Promise<void> {
    try {
      const trip = await this.getTrip(tripId);
      if (!trip) throw new Error('Trip not found');

      const updatedParticipants = [
        ...trip.participants,
        // Add new users (would need full User objects in real implementation)
      ];

      await this.updateTrip(tripId, { participants: updatedParticipants });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to share trip');
    }
  }
}

export default new TripService();
