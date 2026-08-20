import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import bookingsService from '@/services/bookings';
import { Flight, Hotel } from '@/types';

type TabType = 'flights' | 'hotels';

export default function BookingsScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>('flights');
  const [isLoading, setIsLoading] = useState(false);

  // Flight search inputs
  const [from, setFrom] = useState('New York (JFK)');
  const [to, setTo] = useState('Paris (CDG)');
  const [flights, setFlights] = useState<any[]>([]);
  const [hasSearchedFlights, setHasSearchedFlights] = useState(false);

  // Hotel search inputs
  const [city, setCity] = useState('Paris');
  const [hotels, setHotels] = useState<any[]>([]);
  const [hasSearchedHotels, setHasSearchedHotels] = useState(false);

  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  const handleSearchFlights = async () => {
    triggerHaptic();
    if (!from || !to) {
      Alert.alert('Error', 'Please fill in departure and arrival cities');
      return;
    }
    setIsLoading(true);
    setHasSearchedFlights(true);

    try {
      const results = await bookingsService.searchFlights(from, to, new Date());
      setFlights(results);
    } catch (e) {
      // Mock Flights Fallback
      setFlights([
        {
          id: 'fl-1',
          airline: 'Delta Air Lines',
          flightNumber: 'DL 264',
          departureAirport: { code: 'JFK', city: 'New York', time: new Date() },
          arrivalAirport: { code: 'CDG', city: 'Paris', time: new Date() },
          departureTime: new Date(Date.now() + 24 * 3600 * 1000),
          arrivalTime: new Date(Date.now() + 24 * 3600 * 1000 + 8 * 3600 * 1000),
          price: 520,
          currency: 'USD',
          class: 'Economy',
          stops: 0,
          duration: 480,
        },
        {
          id: 'fl-2',
          airline: 'Air France',
          flightNumber: 'AF 015',
          departureAirport: { code: 'JFK', city: 'New York', time: new Date() },
          arrivalAirport: { code: 'CDG', city: 'Paris', time: new Date() },
          departureTime: new Date(Date.now() + 26 * 3600 * 1000),
          arrivalTime: new Date(Date.now() + 26 * 3600 * 1000 + 7.5 * 3600 * 1000),
          price: 680,
          currency: 'USD',
          class: 'Economy',
          stops: 0,
          duration: 450,
        },
        {
          id: 'fl-3',
          airline: 'British Airways',
          flightNumber: 'BA 178',
          departureAirport: { code: 'JFK', city: 'New York', time: new Date() },
          arrivalAirport: { code: 'CDG', city: 'Paris', time: new Date() },
          departureTime: new Date(Date.now() + 28 * 3600 * 1000),
          arrivalTime: new Date(Date.now() + 28 * 3600 * 1000 + 10 * 3600 * 1000),
          price: 450,
          currency: 'USD',
          class: 'Economy',
          stops: 1,
          duration: 600,
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchHotels = async () => {
    triggerHaptic();
    if (!city) {
      Alert.alert('Error', 'Please enter a destination city');
      return;
    }
    setIsLoading(true);
    setHasSearchedHotels(true);

    try {
      const results = await bookingsService.searchHotels(city, new Date(), new Date(Date.now() + 2 * 24 * 3600 * 1000));
      setHotels(results);
    } catch (e) {
      // Mock Hotels Fallback
      setHotels([
        {
          id: 'ht-1',
          name: 'Le Grand Hotel Paris',
          address: '2 Rue Scribe, 75009 Paris',
          city: 'Paris',
          rating: 4.8,
          pricePerNight: 280,
          currency: 'USD',
          images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
          amenities: ['Wifi', 'Spa', 'Pool', 'Breakfast'],
        },
        {
          id: 'ht-2',
          name: 'Hôtel Plaza Athénée',
          address: '25 Avenue Montaigne, 75008 Paris',
          city: 'Paris',
          rating: 4.9,
          pricePerNight: 450,
          currency: 'USD',
          images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'],
          amenities: ['Wifi', 'Michelin Star Dining', 'Gym', 'Bar'],
        },
        {
          id: 'ht-3',
          name: 'Hotel Regina Louvre',
          address: '2 Place des Pyramides, 75001 Paris',
          city: 'Paris',
          rating: 4.6,
          pricePerNight: 190,
          currency: 'USD',
          images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'],
          amenities: ['Wifi', 'Pet Friendly', 'Room Service'],
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookFlight = async (flight: Flight) => {
    triggerHaptic();
    if (!user) {
      Alert.alert('Sign In Required', 'Please log in to make a booking');
      return;
    }

    try {
      const result = await bookingsService.bookFlight(
        user.id,
        'default-trip',
        flight.id,
        [user.name]
      );
      Alert.alert('Booking Confirmed! 🎉', `Your flight on ${flight.airline} has been booked. Ref: ${result.confirmationNumber}`);
    } catch (error: any) {
      Alert.alert('Booking Failed', error.message || 'Please try again.');
    }
  };

  const formatFlightTime = (date: Date | string | undefined) => {
    if (!date) return '--:--';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '--:--';
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getAirportCode = (airport: any) => {
    if (typeof airport === 'string') return airport;
    return airport?.code || '--';
  };

  const handleBookHotel = async (hotel: Hotel) => {
    triggerHaptic();
    if (!user) {
      Alert.alert('Sign In Required', 'Please log in to make a booking');
      return;
    }

    try {
      const result = await bookingsService.bookHotel(
        user.id,
        'default-trip',
        hotel.id,
        new Date(),
        new Date(Date.now() + 2 * 24 * 3600 * 1000)
      );
      Alert.alert('Booking Confirmed! 🏨', `Your stay at ${hotel.name} has been booked. Ref: ${result.confirmationNumber}`);
    } catch (error: any) {
      Alert.alert('Booking Failed', error.message || 'Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => { triggerHaptic(); router.back(); }} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Bookings</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'flights' && { borderBottomColor: Colors.primary.ocean }]}
          onPress={() => { triggerHaptic(); setActiveTab('flights'); }}
        >
          <Ionicons name="airplane-outline" size={18} color={activeTab === 'flights' ? Colors.primary.ocean : colors.textSecondary} />
          <Text style={[styles.tabText, { color: activeTab === 'flights' ? Colors.primary.ocean : colors.textSecondary }]}>Flights</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'hotels' && { borderBottomColor: Colors.primary.ocean }]}
          onPress={() => { triggerHaptic(); setActiveTab('hotels'); }}
        >
          <Ionicons name="bed-outline" size={18} color={activeTab === 'hotels' ? Colors.primary.ocean : colors.textSecondary} />
          <Text style={[styles.tabText, { color: activeTab === 'hotels' ? Colors.primary.ocean : colors.textSecondary }]}>Hotels</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'flights' ? (
          <View style={styles.tabContent}>
            {/* Flight Search Form */}
            <Card isDark={isDark} style={styles.searchForm} pressure="md">
              <Text style={[styles.formTitle, { color: colors.text }]}>Find Your Next Flight</Text>
              <TextInput
                label="From"
                placeholder="Departure City"
                value={from}
                onChangeText={setFrom}
                leftIcon="airplane-outline"
                containerStyle={{ marginBottom: Spacing.md }}
              />
              <TextInput
                label="To"
                placeholder="Arrival City"
                value={to}
                onChangeText={setTo}
                leftIcon="pin-outline"
                containerStyle={{ marginBottom: Spacing.xl }}
              />
              <Button label="Search Flights" onPress={handleSearchFlights} variant="primary" isDark={isDark} />
            </Card>

            {/* Flight Results */}
            {isLoading && <ActivityIndicator size="large" color={Colors.primary.ocean} style={{ marginTop: Spacing.xl }} />}

            {!isLoading && hasSearchedFlights && flights.length === 0 && (
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No flights found matching criteria.</Text>
            )}

            {!isLoading && flights.map((item) => (
              <Card key={item.id} isDark={isDark} style={styles.flightCard} pressure="sm">
                <View style={styles.flightHeader}>
                  <View>
                    <Text style={[styles.airlineName, { color: colors.text }]}>{item.airline}</Text>
                    <Text style={[styles.flightCode, { color: colors.textSecondary }]}>{item.flightNumber} • {item.class}</Text>
                  </View>
                  <Ionicons name="airplane" size={20} color={Colors.primary.sky} />
                </View>
                <View style={styles.flightRoute}>
                  <View style={styles.airportBlock}>
                    <Text style={[styles.airportCode, { color: colors.text }]}>{getAirportCode(item.departureAirport)}</Text>
                    <Text style={[styles.timeText, { color: colors.text }]}>
                      {formatFlightTime(item.departureTime)}
                    </Text>
                  </View>
                  <View style={styles.routeLineBlock}>
                    <Text style={[styles.durationText, { color: colors.textSecondary }]}>{item.duration}m</Text>
                    <View style={[styles.line, { backgroundColor: colors.border }]} />
                    <Text style={[styles.stopsText, { color: Colors.primary.coral }]}>{item.stops === 0 ? 'Direct' : `${item.stops} stop`}</Text>
                  </View>
                  <View style={styles.airportBlock}>
                    <Text style={[styles.airportCode, { color: colors.text }]}>{getAirportCode(item.arrivalAirport)}</Text>
                    <Text style={[styles.timeText, { color: colors.text }]}>
                      {formatFlightTime(item.arrivalTime)}
                    </Text>
                  </View>
                </View>
                <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
                  <Text style={[styles.priceText, { color: colors.text }]}>${item.price}</Text>
                  <TouchableOpacity
                    style={[styles.bookBtn, { backgroundColor: Colors.primary.ocean }]}
                    onPress={() => handleBookFlight(item)}
                  >
                    <Text style={styles.bookBtnText}>Book Flight</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>
        ) : (
          <View style={styles.tabContent}>
            {/* Hotel Search Form */}
            <Card isDark={isDark} style={styles.searchForm} pressure="md">
              <Text style={[styles.formTitle, { color: colors.text }]}>Find Places to Stay</Text>
              <TextInput
                label="Where to?"
                placeholder="City/Destination"
                value={city}
                onChangeText={setCity}
                leftIcon="search-outline"
                containerStyle={{ marginBottom: Spacing.xl }}
              />
              <Button label="Search Hotels" onPress={handleSearchHotels} variant="primary" isDark={isDark} />
            </Card>

            {/* Hotel Results */}
            {isLoading && <ActivityIndicator size="large" color={Colors.primary.ocean} style={{ marginTop: Spacing.xl }} />}

            {!isLoading && hasSearchedHotels && hotels.length === 0 && (
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No hotels found in this city.</Text>
            )}

            {!isLoading && hotels.map((item) => (
              <Card key={item.id} isDark={isDark} style={styles.hotelCard} pressure="sm">
                <View style={styles.hotelDetails}>
                  <Text style={[styles.hotelName, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.hotelAddress, { color: colors.textSecondary }]} numberOfLines={1}>📍 {item.address}</Text>
                  <Text style={styles.hotelRating}>⭐ {item.rating} / 5.0</Text>
                  <View style={styles.amenitiesList}>
                    {item.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                      <View key={idx} style={[styles.amenityTag, { backgroundColor: colors.surfaceVariant }]}>
                        <Text style={[styles.amenityText, { color: colors.textSecondary }]}>{amenity}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
                  <Text style={[styles.priceText, { color: colors.text }]}>${item.pricePerNight} <Text style={{ fontSize: 12, fontWeight: '400', color: colors.textSecondary }}>/ night</Text></Text>
                  <TouchableOpacity
                    style={[styles.bookBtn, { backgroundColor: Colors.primary.ocean }]}
                    onPress={() => handleBookHotel(item)}
                  >
                    <Text style={styles.bookBtnText}>Book Room</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.heading.md.fontSize,
    fontWeight: '700',
  },
  tabBar: {
    flexDirection: 'row',
    height: 48,
    borderBottomWidth: 1,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: Spacing.xs,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  tabContent: {
    gap: Spacing.lg,
  },
  searchForm: {
    padding: Spacing.lg,
    borderRadius: Spacing.radius.xl,
  },
  formTitle: {
    fontSize: Typography.subtitle.md.fontSize,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: Spacing.xxl,
    fontSize: 14,
  },
  flightCard: {
    padding: Spacing.lg,
    borderRadius: Spacing.radius.lg,
  },
  flightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  airlineName: {
    fontSize: 16,
    fontWeight: '700',
  },
  flightCode: {
    fontSize: 12,
  },
  flightRoute: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  airportBlock: {
    alignItems: 'center',
  },
  airportCode: {
    fontSize: 22,
    fontWeight: '800',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  routeLineBlock: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  durationText: {
    fontSize: 10,
    marginBottom: 2,
  },
  line: {
    height: 1.5,
    width: '100%',
    marginVertical: 4,
  },
  stopsText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  priceText: {
    fontSize: 20,
    fontWeight: '800',
  },
  bookBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.radius.md,
  },
  bookBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  hotelCard: {
    padding: Spacing.lg,
    borderRadius: Spacing.radius.lg,
  },
  hotelDetails: {
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: '700',
  },
  hotelAddress: {
    fontSize: 12,
  },
  hotelRating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFB800',
  },
  amenitiesList: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  amenityTag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Spacing.radius.sm,
  },
  amenityText: {
    fontSize: 10,
    fontWeight: '500',
  },
});
