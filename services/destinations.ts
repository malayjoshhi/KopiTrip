/**
 * Destinations Service
 * Handles destination discovery, details, and recommendations
 */

import { firestore } from './firebase';
import { Destination, SearchFilters } from '../types';
import apiClient from './apiClient';

class DestinationService {
  /**
   * Get all destinations
   */
  async getDestinations(filters?: SearchFilters): Promise<Destination[]> {
    try {
      let query = firestore().collection('destinations') as any;

      if (filters?.category) {
        query = query.where('category', 'in', filters.category);
      }

      if (filters?.rating) {
        query = query.where('rating', '>=', filters.rating);
      }

      const snapshot = await query.limit(50).get();
      return snapshot.docs.map((doc: any) => doc.data() as Destination);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch destinations');
    }
  }

  /**
   * Get popular/trending destinations
   */
  async getTrendingDestinations(): Promise<Destination[]> {
    try {
      const snapshot = await firestore()
        .collection('destinations')
        .where('rating', '>=', 4.5)
        .orderBy('rating', 'desc')
        .limit(10)
        .get();

      return snapshot.docs.map((doc: any) => doc.data() as Destination);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch trending destinations');
    }
  }

  /**
   * Get destination by ID
   */
  async getDestination(id: string): Promise<Destination | null> {
    try {
      const doc = await firestore().collection('destinations').doc(id).get();
      return doc.data() as Destination | null;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch destination');
    }
  }

  /**
   * Search destinations
   */
  async searchDestinations(query: string): Promise<Destination[]> {
    try {
      const snapshot = await firestore()
        .collection('destinations')
        .where('name', '>=', query)
        .where('name', '<=', query + '\\uf8ff')
        .get();

      return snapshot.docs.map((doc: any) => doc.data() as Destination);
    } catch (error: any) {
      throw new Error(error.message || 'Search failed');
    }
  }

  /**
   * Get AI recommendations based on user preferences
   */
  async getRecommendations(userId: string): Promise<Destination[]> {
    try {
      // In a real app, this would call an AI service
      const snapshot = await firestore()
        .collection('destinations')
        .orderBy('rating', 'desc')
        .limit(20)
        .get();

      return snapshot.docs.map((doc: any) => doc.data() as Destination);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch recommendations');
    }
  }

/**
   * Get destinations by category
   */
  async getDestinationsByCategory(category: string): Promise<Destination[]> {
    try {
      const snapshot = await firestore()
        .collection('destinations')
        .where('category', '==', category)
        .get();

      return snapshot.docs.map((doc: any) => doc.data() as Destination);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch destinations by category');
    }
  }

  /**
   * Get similar destinations based on category/region
   */
  async getSimilarDestinations(destination: Destination, limit = 5): Promise<Destination[]> {
    try {
      const results: Destination[] = [];

      // Try to fetch destinations in the same category
      const categorySnapshot = await firestore()
        .collection('destinations')
        .where('category', '==', destination.category)
        .limit(limit + 1)
        .get();

      const fromCategory = categorySnapshot.docs
        .map((doc: any) => doc.data() as Destination)
        .filter((d: Destination) => d.id !== destination.id);

      results.push(...fromCategory);

      // If not enough, fetch by region
      if (results.length < limit && destination.region) {
        const regionSnapshot = await firestore()
          .collection('destinations')
          .where('region', '==', destination.region)
          .limit(limit + 1)
          .get();

        const fromRegion = regionSnapshot.docs
          .map((doc: any) => doc.data() as Destination)
          .filter(
            (d: Destination) =>
              d.id !== destination.id &&
              !results.some((r) => r.id === d.id)
          );

        results.push(...fromRegion);
      }

      // Fallback to top-rated if still not enough
      if (results.length < limit) {
        const topSnapshot = await firestore()
          .collection('destinations')
          .orderBy('rating', 'desc')
          .limit(limit + 1)
          .get();

        const fromTop = topSnapshot.docs
          .map((doc: any) => doc.data() as Destination)
          .filter(
            (d: Destination) =>
              d.id !== destination.id &&
              !results.some((r) => r.id === d.id)
          );

        results.push(...fromTop);
      }

      return results.slice(0, limit);
    } catch (error: any) {
      console.warn('Failed to fetch similar destinations:', error.message);
      return [];
    }
  }
}

export default new DestinationService();
