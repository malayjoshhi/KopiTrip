/**
 * Home Screen
 * Main dashboard with upcoming trips, recommendations, and quick actions
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
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useAuth } from '@/hooks/useAuth';
import { useTrips } from '@/hooks/useTrips';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DestinationCard } from '@/components/DestinationCard';
import destinationService from '@/services/destinations';
import { Destination, Trip } from '@/types';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { trips, fetchUserTrips, isLoading } = useTrips();
  const [recommendations, setRecommendations] = useState<Destination[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    if (user?.id) {
      fetchUserTrips(user.id);
      loadRecommendations();
    }
  }, [user?.id]);

  const loadRecommendations = async () => {
    setLoadingRecommendations(true);
    try {
      const destinations = await destinationService.getTrendingDestinations();
      setRecommendations(destinations.slice(0, 8));
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const upcomingTrips = trips.filter(t => t.status === 'upcoming' || t.status === 'planning').slice(0, 3);

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
        {/* Header Greeting */}
        <View style={[styles.header, { paddingHorizontal: Spacing.lg }]}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>
              Welcome back,{'\n'}{user?.name?.split(' ')[0]}! 👋
            </Text>
            <Text style={[styles.date, { color: colors.textSecondary }]}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>
          <TouchableOpacity style={styles.avatarPlaceholder}>
            <Text style={styles.avatar}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={[styles.section, { paddingHorizontal: Spacing.lg }]}>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: Colors.primary.ocean },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                router.push('/(tabs)/trips');
              }}
            >
              <Text style={styles.actionIcon}>✈️</Text>
              <Text style={[styles.actionLabel, { color: 'white' }]}>Plan Trip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: Colors.primary.sky },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                router.push('/(tabs)/explore');
              }}
            >
              <Text style={styles.actionIcon}>🔍</Text>
              <Text style={[styles.actionLabel, { color: 'white' }]}>Explore</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: Colors.primary.coral },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                router.push('/bookings');
              }}
            >
              <Text style={styles.actionIcon}>🎟️</Text>
              <Text style={[styles.actionLabel, { color: 'white' }]}>Bookings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: Colors.success },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                router.push('/expenses');
              }}
            >
              <Text style={styles.actionIcon}>💰</Text>
              <Text style={[styles.actionLabel, { color: 'white' }]}>Expenses</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Trips Section */}
        {upcomingTrips.length > 0 && (
          <View style={[styles.section, { paddingHorizontal: Spacing.lg }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Your Upcoming Trips
              </Text>
              <TouchableOpacity>
                <Text style={[styles.seeAll, { color: Colors.primary.ocean }]}>
                  See all →
                </Text>
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <ActivityIndicator
                color={isDark ? Colors.primary.sky : Colors.primary.ocean}
                size="large"
                style={{ marginVertical: Spacing.lg }}
              />
            ) : (
              <View>
                {upcomingTrips.map((trip) => (
                  <Card
                    key={trip.id}
                    isDark={isDark}
                    pressure="sm"
                    style={{ marginBottom: Spacing.md }}
                  >
                    <View style={styles.tripContent}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.tripTitle, { color: colors.text }]}>
                          {trip.title}
                        </Text>
                        <Text
                          style={[styles.tripDestination, { color: colors.textSecondary }]}
                        >
                          📍 {trip.destination.name}
                        </Text>
                        <Text
                          style={[styles.tripDate, { color: colors.textSecondary }]}
                        >
                          {trip.startDate.toLocaleDateString()} - {trip.endDate.toLocaleDateString()}
                        </Text>
                      </View>
                      <Text style={styles.tripEmoji}>🧳</Text>
                    </View>
                  </Card>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Trending Destinations Section */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { paddingHorizontal: Spacing.lg }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              🌍 Trending Destinations
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: Colors.primary.ocean }]}>
                See all →
              </Text>
            </TouchableOpacity>
          </View>

          {loadingRecommendations ? (
            <ActivityIndicator
              color={isDark ? Colors.primary.sky : Colors.primary.ocean}
              size="large"
              style={{ marginVertical: Spacing.lg }}
            />
          ) : (
            <View style={{ paddingHorizontal: Spacing.lg }}>
<FlatList
                data={recommendations}
                renderItem={({ item }) => (
                  <DestinationCard
                    destination={item}
                    isDark={isDark}
                    onPress={() =>
                      router.push({
                        pathname: '/destination/[id]',
                        params: { id: item.id },
                      })
                    }
                  />
                )}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          )}
        </View>

        {/* Stats Section */}
        <View style={[styles.section, { paddingHorizontal: Spacing.lg }]}>
          <View style={styles.statsContainer}>
            <Card isDark={isDark} pressure="sm" style={{ flex: 1 }}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Countries Visited
              </Text>
              <Text style={[styles.statValue, { color: colors.text }]}>12</Text>
            </Card>

            <Card isDark={isDark} pressure="sm" style={{ flex: 1 }}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Days Traveled
              </Text>
              <Text style={[styles.statValue, { color: colors.text }]}>142</Text>
            </Card>

            <Card isDark={isDark} pressure="sm" style={{ flex: 1 }}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Trips Planned
              </Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{trips.length}</Text>
            </Card>
          </View>
        </View>

        {/* Call to Action */}
        {trips.length === 0 && (
          <View style={[styles.section, { paddingHorizontal: Spacing.lg }]}>
            <Card isDark={isDark} pressure="md">
              <View style={styles.ctaContent}>
                <Text style={styles.ctaEmoji}>🌴</Text>
                <Text style={[styles.ctaTitle, { color: colors.text }]}>
                  Ready to explore?
                </Text>
                <Text style={[styles.ctaDescription, { color: colors.textSecondary }]}>
                  Plan your next adventure and discover amazing destinations
                </Text>
                <Button
                  label="Start Planning"
                  onPress={() => console.log('Start planning')}
                  variant="primary"
                  style={{ marginTop: Spacing.lg }}
                  isDark={isDark}
                />
              </View>
            </Card>
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  greeting: {
    fontSize: Typography.display.sm.fontSize,
    fontWeight: Typography.display.sm.fontWeight as any,
    lineHeight: 36,
    marginBottom: Spacing.xs,
  },
  date: {
    fontSize: Typography.body.sm.fontSize,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary.ocean + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    fontSize: 24,
  },
  section: {
    marginBottom: Spacing['3xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.heading.lg.fontSize,
    fontWeight: Typography.heading.lg.fontWeight as any,
  },
  seeAll: {
    fontSize: Typography.body.sm.fontSize,
    fontWeight: '600',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '47%',
    borderRadius: Spacing.radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    minHeight: 110,
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  actionLabel: {
    fontSize: Typography.body.sm.fontSize,
    fontWeight: '600',
    textAlign: 'center',
  },
  tripContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripTitle: {
    fontSize: Typography.subtitle.md.fontSize,
    fontWeight: Typography.subtitle.md.fontWeight as any,
    marginBottom: Spacing.xs,
  },
  tripDestination: {
    fontSize: Typography.body.sm.fontSize,
    marginBottom: Spacing.xs,
  },
  tripDate: {
    fontSize: Typography.caption.md.fontSize,
  },
  tripEmoji: {
    fontSize: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statLabel: {
    fontSize: Typography.caption.md.fontSize,
    fontWeight: '500',
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: Typography.display.md.fontSize,
    fontWeight: Typography.display.md.fontWeight as any,
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaEmoji: {
    fontSize: 48,
    marginBottom: Spacing.lg,
  },
  ctaTitle: {
    fontSize: Typography.heading.md.fontSize,
    fontWeight: Typography.heading.md.fontWeight as any,
    marginBottom: Spacing.sm,
  },
  ctaDescription: {
    fontSize: Typography.body.md.fontSize,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
});
