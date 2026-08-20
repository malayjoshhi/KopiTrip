/**
 * KopiTrip - Type Definitions and Interfaces
 * Core data models for the travel application
 */

// User Management
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  preferredCurrency: string;
  preferredLanguage: string;
  createdAt: Date;
  updatedAt: Date;
}

// Destinations
export type DestinationCategory =
  | 'beach'
  | 'city'
  | 'adventure'
  | 'family'
  | 'luxury'
  | 'budget'
  | 'nature'
  | 'culture';

export interface DestinationPracticalInfo {
  currency?: string;
  language?: string;
  timezone?: string;
  bestSeason?: string[];
  costs?: {
    averageDailyBudget?: number;
    currencyCode?: string;
  };
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  description: string;
  images: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  reviewCount: number;
  bestTimeToVisit: string[];
  category: DestinationCategory;
  attractions: Attraction[];
  practicalInfo?: DestinationPracticalInfo;
  highlights?: string[];
  travelTips?: string[];
  similarTo?: string[];
  createdAt: Date;
}

// Attractions
export interface Attraction {
  id: string;
  name: string;
  description: string;
  type: 'landmark' | 'museum' | 'restaurant' | 'hotel' | 'activity';
  coordinates: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  image?: string;
  visitDuration?: number;
  estimatedCost?: number;
}

// Trips
export interface Trip {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  destination: Destination;
  itinerary: ItineraryDay[];
  budget: TripBudget;
  participants: User[];
  status: 'planning' | 'upcoming' | 'ongoing' | 'completed';
  visibility: 'private' | 'friends' | 'public';
  createdAt: Date;
  updatedAt: Date;
}

// Itinerary
export interface ItineraryDay {
  dayNumber: number;
  date: Date;
  activities: Activity[];
  notes?: string;
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  time: string;
  duration: number;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  category: string;
  imageUrl?: string;
  estimatedCost?: number;
  notes?: string;
}

// Budget Management
export interface TripBudget {
  totalBudget: number;
  currency: string;
  breakdown: BudgetCategory[];
  expenses: Expense[];
}

export interface BudgetCategory {
  id: string;
  name: string;
  estimatedAmount: number;
  actualAmount?: number;
  percentage: number;
}

export interface Expense {
  id: string;
  tripId: string;
  title: string;
  amount: number;
  currency: string;
  category: string;
  date: Date;
  paidBy: string;
  splitWith?: string[];
  receipt?: string;
  notes?: string;
}

// Flights
export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departureAirport: {
    code: string;
    city: string;
    time: Date;
  };
  arrivalAirport: {
    code: string;
    city: string;
    time: Date;
  };
  duration: number;
  stops: number;
  price: number;
  currency: string;
  seats: number;
  amenities: string[];
  rating: number;
}

// Hotels
export interface Hotel {
  id: string;
  name: string;
  description: string;
  images: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  currency: string;
  amenities: string[];
  rooms: HotelRoom[];
  availability: DateRange[];
  policies: HotelPolicy;
}

export interface HotelRoom {
  id: string;
  type: 'single' | 'double' | 'suite' | 'deluxe';
  capacity: number;
  pricePerNight: number;
  amenities: string[];
  images: string[];
}

export interface HotelPolicy {
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  petPolicy: string;
  childrenPolicy: string;
}

// Experiences/Activities
export interface Experience {
  id: string;
  title: string;
  description: string;
  category: 'tour' | 'activity' | 'restaurant' | 'event' | 'guide';
  images: string[];
  rating: number;
  reviewCount: number;
  price: number;
  currency: string;
  duration: number;
  groupSize: {
    min: number;
    max: number;
  };
  location: {
    city: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  schedule: ScheduleSlot[];
  reviews: Review[];
}

export interface ScheduleSlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  availableSlots: number;
}

// Travel Documents/Wallet
export interface TravelDocument {
  id: string;
  userId: string;
  type: 'passport' | 'visa' | 'ticket' | 'boarding_pass' | 'insurance' | 'loyalty_card';
  title: string;
  documentNumber?: string;
  expiryDate?: Date;
  document: string;
  tripId?: string;
  createdAt: Date;
}

// Reviews and Ratings
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  date: Date;
  helpful: number;
}

// Search and Filters
export interface SearchFilters {
  destination?: string;
  startDate?: Date;
  endDate?: Date;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  category?: string[];
  amenities?: string[];
}

// Date Range
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// Booking
export interface Booking {
  id: string;
  userId: string;
  tripId: string;
  type: 'flight' | 'hotel' | 'experience';
  itemId: string;
  confirmationNumber: string;
  bookingDate: Date;
  checkInDate: Date;
  checkOutDate?: Date;
  status: 'confirmed' | 'pending' | 'cancelled';
  totalPrice: number;
  currency: string;
  paymentMethod: string;
}

// Notifications
export interface Notification {
  id: string;
  userId: string;
  type: 'flight' | 'hotel' | 'expense' | 'trip' | 'system';
  title: string;
  message: string;
  relatedId?: string;
  read: boolean;
  createdAt: Date;
}

// Preferences
export interface UserPreferences {
  userId: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  currency: string;
  notifications: {
    push: boolean;
    email: boolean;
    flightUpdates: boolean;
    deals: boolean;
  };
  privacy: {
    profileVisibility: 'private' | 'friends' | 'public';
    showTravelHistory: boolean;
  };
}
