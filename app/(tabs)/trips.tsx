/**
 * Trips Screen
 * View all trips and manage travel itineraries
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useAuth } from '@/hooks/useAuth';
import { useTrips } from '@/hooks/useTrips';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { TextInput } from '@/components/ui/TextInput';
import { useLocalSearchParams } from 'expo-router';
import { Trip } from '@/types';

const TRIP_TABS = ['All', 'Upcoming', 'Past', 'Planning'] as const;

export default function TripsScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { trips, fetchUserTrips, isLoading, createTrip } = useTrips();
  const [selectedTab, setSelectedTab] = useState<typeof TRIP_TABS[number]>('All');
  
  const params = useLocalSearchParams();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTripTitle, setNewTripTitle] = useState('');
  const [newTripDestination, setNewTripDestination] = useState('');

  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    if (user?.id) {
      fetchUserTrips(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    if (params.create === 'true' && params.destination) {
      setNewTripDestination(params.destination as string);
      setNewTripTitle('Trip to ' + params.destination);
      setShowCreateModal(true);
    }
  }, [params]);

  const handleCreateTrip = async () => {
    if (!newTripTitle || !newTripDestination || !user) return;
    try {
      const tripData = {
        userId: user.id,
        title: newTripTitle,
        startDate: new Date(),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        destination: {
          id: 'custom-' + Math.random().toString(36).substr(2, 9),
          name: newTripDestination,
          country: 'Destination',
          region: 'Destination',
          description: 'A custom destination.',
          images: ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'],
          coordinates: { latitude: 0, longitude: 0 },
          rating: 5,
          reviewCount: 1,
          bestTimeToVisit: [],
          category: 'city' as any,
          attractions: [],
          createdAt: new Date(),
        },
        itinerary: [],
        budget: {
          tripId: '',
          totalBudget: 1000,
          spent: 0,
          currency: 'USD',
          breakdown: [],
          expenses: [],
        },
        participants: [user],
        status: 'planning' as any,
        visibility: 'private' as any,
      };

      await createTrip(tripData);
      setShowCreateModal(false);
      setNewTripTitle('');
      setNewTripDestination('');
    } catch (e) {
      console.error('Error creating trip:', e);
    }
  };

  const getFilteredTrips = () => {
    switch (selectedTab) {
      case 'Upcoming':
        return trips.filter((t) => t.status === 'upcoming');
      case 'Past':
        return trips.filter((t) => t.status === 'completed');
      case 'Planning':
        return trips.filter((t) => t.status === 'planning');
      default:
        return trips;
    }
  };

  const filteredTrips = getFilteredTrips();

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return { bg: Colors.info + '20', text: Colors.info };
      case 'ongoing':
        return { bg: Colors.success + '20', text: Colors.success };
      case 'completed':
        return { bg: Colors.neutral[200], text: Colors.neutral[600] };
      case 'planning':
        return { bg: Colors.primary.sky + '20', text: Colors.primary.sky };
      default:
        return { bg: Colors.neutral[200], text: Colors.neutral[600] };
    }
  };

  const formatDates = (trip: Trip) => {
    const start = trip.startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const end = trip.endDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return `${start} - ${end}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingTop: insets.top + Spacing.lg,
          paddingBottom: Spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingHorizontal: Spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>
              🧳 My Trips
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Manage your travels
            </Text>
          </View>
          <TouchableOpacity 
            style={{ 
              backgroundColor: Colors.primary.ocean, 
              paddingHorizontal: Spacing.md, 
              paddingVertical: Spacing.sm, 
              borderRadius: Spacing.radius.md 
            }}
            onPress={() => setShowCreateModal(true)}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabsSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.tabsContent,
              { paddingHorizontal: Spacing.lg },
            ]}
          >
            {TRIP_TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  {
                    borderBottomColor:
                      selectedTab === tab
                        ? Colors.primary.ocean
                        : colors.border,
                    borderBottomWidth: selectedTab === tab ? 2 : 1,
                  },
                ]}
                onPress={() => setSelectedTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color:
                        selectedTab === tab
                          ? Colors.primary.ocean
                          : colors.textSecondary,
                      fontWeight:
                        selectedTab === tab ? '600' : '400',
                    },
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Trips List */}
        <View style={[styles.listSection, { paddingHorizontal: Spacing.lg }]}>
          {isLoading ? (
            <ActivityIndicator
              color={isDark ? Colors.primary.sky : Colors.primary.ocean}
              size="large"
              style={{ marginVertical: Spacing['3xl'] }}
            />
          ) : filteredTrips.length > 0 ? (
            <FlatList
              data={filteredTrips}
              renderItem={({ item }) => {
                const statusColor = getStatusBadgeColor(item.status);
                return (
                  <Card
                    isDark={isDark}
                    pressure="sm"
                    onPress={() => console.log('Navigate to trip', item.id)}
                    style={{ marginBottom: Spacing.md }}
                  >
                    <View style={styles.tripCard}>
                      <View style={{ flex: 1 }}>
                        <View style={styles.tripHeader}>
                          <Text
                            style={[
                              styles.tripTitle,
                              { color: colors.text },
                            ]}
                            numberOfLines={1}
                          >
                            {item.title}
                          </Text>
                          <View
                            style={[
                              styles.statusBadge,
                              { backgroundColor: statusColor.bg },
                            ]}
                          >
                            <Text
                              style={[
                                styles.statusText,
                                { color: statusColor.text },
                              ]}
                            >
                              {item.status.charAt(0).toUpperCase() +
                                item.status.slice(1)}
                            </Text>
                          </View>
                        </View>

                        <Text
                          style={[
                            styles.destination,
                            { color: colors.textSecondary },
                          ]}
                        >
                          📍 {item.destination.name}
                        </Text>

                        <Text
                          style={[
                            styles.dates,
                            { color: colors.textSecondary },
                          ]}
                        >
                          🗓️ {formatDates(item)}
                        </Text>

                        <View style={styles.tripMeta}>
                          <Text
                            style={[
                              styles.metaText,
                              { color: colors.textSecondary },
                            ]}
                          >
                            {item.participants.length} participant
                            {item.participants.length !== 1 ? 's' : ''}
                          </Text>
                          <Text
                            style={[
                              styles.metaText,
                              { color: colors.textSecondary },
                            ]}
                          >
                            •
                          </Text>
                          <Text
                            style={[
                              styles.metaText,
                              { color: colors.textSecondary },
                            ]}
                          >
                            {item.itinerary.length} days
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.icon}>→</Text>
                    </View>
                  </Card>
                );
              }}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>✈️</Text>
              <Text style={[styles.emptyText, { color: colors.text }]}>
                {selectedTab === 'All' ? 'No trips found' : `No ${selectedTab.toLowerCase()} trips`}
              </Text>
              <Text
                style={[
                  styles.emptyDescription,
                  { color: colors.textSecondary },
                ]}
              >
                {selectedTab === 'All' || selectedTab === 'Planning'
                  ? 'Start planning your next adventure!'
                  : `You don't have any ${selectedTab.toLowerCase()} trips yet.`}
              </Text>

              {(selectedTab === 'All' || selectedTab === 'Planning') && (
                <Button
                  label="Create a Trip"
                  onPress={() => setShowCreateModal(true)}
                  variant="primary"
                  style={{ marginTop: Spacing.lg, alignSelf: 'center' }}
                  isDark={isDark}
                />
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showCreateModal}
        title="Create New Trip"
        onClose={() => setShowCreateModal(false)}
        actionButtonText="Create"
        onAction={handleCreateTrip}
        actionButtonDisabled={!newTripTitle || !newTripDestination}
      >
        <View style={{ gap: Spacing.md }}>
          <TextInput
            label="Trip Title"
            placeholder="e.g. Summer Vacation 2026"
            value={newTripTitle}
            onChangeText={setNewTripTitle}
          />
          <TextInput
            label="Destination"
            placeholder="e.g. Tokyo, Japan"
            value={newTripDestination}
            onChangeText={setNewTripDestination}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.display.md.fontSize,
    fontWeight: Typography.display.md.fontWeight as any,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.body.md.fontSize,
  },
  tabsSection: {
    marginBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  tabsContent: {
    gap: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  tab: {
    paddingHorizontal: Spacing.sm,
  },
  tabText: {
    fontSize: Typography.body.md.fontSize,
  },
  listSection: {
    flex: 1,
  },
  tripCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  tripTitle: {
    fontSize: Typography.subtitle.md.fontSize,
    fontWeight: Typography.subtitle.md.fontWeight as any,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.radius.full,
    marginLeft: Spacing.sm,
  },
  statusText: {
    fontSize: Typography.caption.md.fontSize,
    fontWeight: '600',
  },
  destination: {
    fontSize: Typography.body.sm.fontSize,
    marginBottom: Spacing.xs,
  },
  dates: {
    fontSize: Typography.body.sm.fontSize,
    marginBottom: Spacing.sm,
  },
  tripMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  metaText: {
    fontSize: Typography.caption.md.fontSize,
  },
  icon: {
    fontSize: 20,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing['4xl'],
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: Spacing.lg,
  },
  emptyText: {
    fontSize: Typography.heading.md.fontSize,
    fontWeight: Typography.heading.md.fontWeight as any,
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    fontSize: Typography.body.md.fontSize,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
});
