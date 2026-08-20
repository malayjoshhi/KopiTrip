/**
 * Flights & Hotels Service
 * Handles flight and hotel search, booking, and management
 */

import { Flight, Hotel, Booking } from '../types';
import apiClient from './apiClient';
import { firestore } from './firebase';

class BookingService {
  /**
   * Search flights
   */
  async searchFlights(
    from: string,
    to: string,
    departDate: Date,
    returnDate?: Date
  ): Promise<Flight[]> {
    try {
      // In production, this would call your flights API
      const response = await apiClient.get<Flight[]>('/flights/search', {
        params: {
          from,
          to,
          departDate: departDate.toISOString(),
          returnDate: returnDate?.toISOString(),
        },
      });
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Flight search failed');
    }
  }

  /**
   * Search hotels
   */
  async searchHotels(
    city: string,
    checkIn: Date,
    checkOut: Date,
    guests?: number
  ): Promise<Hotel[]> {
    try {
      // In production, this would call your hotels API
      const response = await apiClient.get<Hotel[]>('/hotels/search', {
        params: {
          city,
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          guests,
        },
      });
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Hotel search failed');
    }
  }

  /**
   * Book flight
   */
  async bookFlight(
    userId: string,
    tripId: string,
    flightId: string,
    passengers: string[]
  ): Promise<Booking> {
    try {
      const booking: Omit<Booking, 'id'> = {
        userId,
        tripId,
        type: 'flight',
        itemId: flightId,
        confirmationNumber: this.generateConfirmationNumber(),
        bookingDate: new Date(),
        checkInDate: new Date(), // Should be flight departure date
        status: 'confirmed',
        totalPrice: 0, // Should calculate from flight details
        currency: 'USD',
        paymentMethod: 'credit_card',
      };

      const docRef = await firestore().collection('bookings').add(booking);
      return { ...booking, id: docRef.id };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to book flight');
    }
  }

  /**
   * Book hotel
   */
  async bookHotel(
    userId: string,
    tripId: string,
    hotelId: string,
    checkIn: Date,
    checkOut: Date
  ): Promise<Booking> {
    try {
      const booking: Omit<Booking, 'id'> = {
        userId,
        tripId,
        type: 'hotel',
        itemId: hotelId,
        confirmationNumber: this.generateConfirmationNumber(),
        bookingDate: new Date(),
        checkInDate: checkIn,
        checkOutDate: checkOut,
        status: 'confirmed',
        totalPrice: 0, // Should calculate from hotel details
        currency: 'USD',
        paymentMethod: 'credit_card',
      };

      const docRef = await firestore().collection('bookings').add(booking);
      return { ...booking, id: docRef.id };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to book hotel');
    }
  }

  /**
   * Get user bookings
   */
  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const snapshot = await firestore()
        .collection('bookings')
        .where('userId', '==', userId)
        .orderBy('bookingDate', 'desc')
        .get();

      return snapshot.docs.map((doc: any) => ({
        ...doc.data(),
        id: doc.id,
      })) as Booking[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch bookings');
    }
  }

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId: string): Promise<void> {
    try {
      await firestore()
        .collection('bookings')
        .doc(bookingId)
        .update({ status: 'cancelled' });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to cancel booking');
    }
  }

  /**
   * Generate confirmation number
   */
  private generateConfirmationNumber(): string {
    return 'TRV' + Date.now().toString().slice(-9).toUpperCase();
  }
}

export default new BookingService();
