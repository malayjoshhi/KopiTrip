/**
 * Destination Detail Screen
 * Full details for a specific destination with description, practical info,
 * best time to visit, attractions, highlights, travel tips, and similar destinations.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DestinationCard } from '@/components/DestinationCard';
import destinationService from '@/services/destinations';
import { Destination } from '@/types';

const ATTRACTION_ICONS: Record<string, string> = {
  landmark: '🏛️',
  museum: '🖼️',
  restaurant: '🍽️',
  hotel: '🏨',
  activity: '🎡',
};

export default function DestinationDetailScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [similarDestinations, setSimilarDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);

  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const loadDestination = async (destinationId: string) => {
    setIsLoading(true);
    try {
      const data = await destinationService.getDestination(destinationId);
      setDestination(data);
      if (data) {
        loadSimilar(data);
      }
    } catch (error) {
      console.error('Failed to load destination:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSimilar = async (current: Destination) => {
    setIsLoadingSimilar(true);
    try {
      const data = await destinationService.getSimilarDestinations(current);
      setSimilarDestinations(data);
    } catch (error) {
      console.error('Failed to load similar destinations:', error);
    } finally {
      setIsLoadingSimilar(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadDestination(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handlePlanTrip = () => {
    if (!destination) return;
    router.push(
      `/(tabs)/trips?create=true&destination=${encodeURIComponent(destination.name)}` as any
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator
          color={isDark ? Colors.primary.sky : Colors.primary.ocean}
          size="large"
        />
      </View>
    );
  }

  if (!destination) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={styles.errorEmoji}>🧭</Text>
        <Text style={[styles.errorText, { color: colors.text }]}>
          Destination not found
        </Text>
        <Button
          label="Go Back"
          onPress={() => router.back()}
          variant="primary"
          style={{ marginTop: Spacing.lg }}
          isDark={isDark}
        />
      </View>
    );
  }

  const heroImage = destination.images?.[0]
    ? { uri: destination.images[0] }
    : { uri: 'https://via.placeholder.com/600x300?text=' + destination.name };

  const practicalInfo = destination.practicalInfo;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Spacing['4xl'] }}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={heroImage} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay} />
          <TouchableOpacity
            style={[styles.backButton, { top: insets.top + Spacing.sm }]}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={[styles.heroContent, { paddingTop: insets.top }]}>
            <Text style={styles.heroName}>{destination.name}</Text>
            <Text style={styles.heroSubtitle}>
              📍 {destination.region}, {destination.country}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={[styles.content, { paddingHorizontal: Spacing.lg }]}>
          {/* Rating + Category */}
          <View style={styles.metaRow}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>
                ⭐ {destination.rating.toFixed(1)}
              </Text>
            </View>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{destination.category}</Text>
            </View>
            <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
              {destination.reviewCount} reviews
            </Text>
          </View>

          {/* Description */}
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {destination.description}
          </Text>

          {/* Practical Info */}
          {practicalInfo && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                ℹ️ Practical Info
              </Text>
              <View style={styles.infoGrid}>
                {practicalInfo.currency && (
                  <InfoTile
                    icon="💱"
                    label="Currency"
                    value={practicalInfo.currency}
                    isDark={isDark}
                  />
                )}
                {practicalInfo.language && (
                  <InfoTile
                    icon="🗣️"
                    label="Language"
                    value={practicalInfo.language}
                    isDark={isDark}
                  />
                )}
                {practicalInfo.timezone && (
                  <InfoTile
                    icon="🕐"
                    label="Timezone"
                    value={practicalInfo.timezone}
                    isDark={isDark}
                  />
                )}
                {practicalInfo.costs?.averageDailyBudget && (
                  <InfoTile
                    icon="💰"
                    label="Avg Daily Budget"
                    value={`${practicalInfo.costs.currencyCode || '$'} ${practicalInfo.costs.averageDailyBudget}`}
                    isDark={isDark}
                  />
                )}
              </View>
            </View>
          )}

          {/* Best Time to Visit */}
          {destination.bestTimeToVisit && destination.bestTimeToVisit.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                ☀️ Best Time to Visit
              </Text>
              <View style={styles.chipRow}>
                {destination.bestTimeToVisit.map((time, idx) => (
                  <View
                    key={idx}
                    style={[styles.chip, { backgroundColor: colors.surfaceVariant }]}
                  >
                    <Text style={[styles.chipText, { color: colors.text }]}>{time}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Highlights */}
          {destination.highlights && destination.highlights.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                ✨ Highlights
              </Text>
              {destination.highlights.map((highlight, idx) => (
                <PlainRow key={idx} icon="•" text={highlight} color={colors.textSecondary} />
              ))}
            </View>
          )}

          {/* Attractions */}
          {destination.attractions && destination.attractions.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                🎡 Top Attractions
              </Text>
              {destination.attractions.map((attraction) => (
                <Card
                  key={attraction.id}
                  isDark={isDark}
                  pressure="sm"
                  style={styles.attractionCard}
                >
                  <View style={styles.attractionHeader}>
                    <View style={[styles.attractionIconBg, { backgroundColor: isDark ? Colors.dark.surfaceVariant : Colors.light.surfaceVariant }]}>
                      <Text style={styles.attractionIcon}>
                        {ATTRACTION_ICONS[attraction.type] || '📍'}
                      </Text>
                    </View>
                    <View style={styles.attractionInfo}>
                      <Text style={[styles.attractionName, { color: colors.text }]}>
                        {attraction.name}
                      </Text>
                      <Text style={[styles.attractionType, { color: colors.textSecondary }]}>
                        {attraction.type}
                      </Text>
                    </View>
                    <View style={styles.attractionRatingBadge}>
                      <Text style={styles.attractionRating}>
                        ⭐ {attraction.rating.toFixed(1)}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.attractionDescription, { color: colors.textSecondary }]}>
                    {attraction.description}
                  </Text>
                  {(attraction.estimatedCost != null || attraction.visitDuration != null) && (
                    <View style={styles.attractionFooter}>
                      {attraction.estimatedCost != null && (
                        <Text style={[styles.attractionMeta, { color: colors.textSecondary }]}>
                          💰 ${attraction.estimatedCost}
                        </Text>
                      )}
                      {attraction.visitDuration != null && (
                        <Text style={[styles.attractionMeta, { color: colors.textSecondary }]}>
                          ⏱️ {attraction.visitDuration} min
                        </Text>
                      )}
                    </View>
                  )}
                </Card>
              ))}
            </View>
          )}

          {/* Travel Tips */}
          {destination.travelTips && destination.travelTips.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                🧳 Travel Tips
              </Text>
              {destination.travelTips.map((tip, idx) => (
                <PlainRow key={idx} icon="💡" text={tip} color={colors.textSecondary} />
              ))}
            </View>
          )}

          {/* Similar Destinations */}
          {similarDestinations.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                🔁 Similar Destinations
              </Text>
              {isLoadingSimilar ? (
                <ActivityIndicator
                  color={isDark ? Colors.primary.sky : Colors.primary.ocean}
                  style={{ marginVertical: Spacing.lg }}
                />
              ) : (
                <FlatList
                  data={similarDestinations}
                  renderItem={({ item }) => (
                    <DestinationCard
                      destination={item}
                      isDark={isDark}
                      onPress={() => {
                        setDestination(null);
                        router.push({ pathname: '/destination/[id]', params: { id: item.id } });
                      }}
                    />
                  )}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  style={{ marginTop: Spacing.sm }}
                />
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View
        style={[
          styles.actionBar,
          { backgroundColor: colors.surface, borderTopColor: colors.border },
        ]}
      >
        <View style={styles.actionBarContent}>
          <View style={styles.actionInfo}>
            <Text style={[styles.actionRating, { color: colors.text }]}>
              ⭐ {destination.rating.toFixed(1)}
            </Text>
            <Text style={[styles.actionRegion, { color: colors.textSecondary }]}>
              {destination.region}
            </Text>
          </View>
          <Button
            label="Plan Trip Here"
            onPress={handlePlanTrip}
            variant="primary"
            size="medium"
            isDark={isDark}
            style={styles.actionButton}
          />
        </View>
      </View>
    </View>
  );
}

interface PlainRowProps {
  icon: string;
  text: string;
  color: string;
}

function PlainRow({ icon, text, color }: PlainRowProps) {
  return (
    <View style={styles.highlightRow}>
      <Text style={styles.highlightBullet}>{icon}</Text>
      <Text style={[styles.highlightText, { color }]}>{text}</Text>
    </View>
  );
}

interface InfoTileProps {
  icon: string;
  label: string;
  value: string;
  isDark: boolean;
}

function InfoTile({ icon, label, value, isDark }: InfoTileProps) {
  const colors = isDark ? Colors.dark : Colors.light;
  return (
<Card
      isDark={isDark}
      pressure="none"
      style={{
        width: '47%',
        padding: Spacing.md,
        borderRadius: Spacing.radius.md,
        backgroundColor: colors.surfaceVariant,
      }}
    >
      <Text style={styles.infoIcon}>{icon}</Text>
      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1}>
        {value}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: Spacing.lg,
  },
  errorText: {
    fontSize: Typography.heading.md.fontSize,
    fontWeight: Typography.heading.md.fontWeight as any,
  },
  heroContainer: {
    width: '100%',
    height: 280,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: Spacing.md,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.lg,
    right: Spacing.lg,
  },
  heroName: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    marginBottom: Spacing.xs,
  },
  heroSubtitle: {
    fontSize: Typography.body.md.fontSize,
    color: 'rgba(255,255,255,0.9)',
  },
  content: {
    paddingTop: Spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  ratingBadge: {
    backgroundColor: '#FFB800',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.radius.full,
  },
  ratingText: {
    fontSize: Typography.caption.lg.fontSize,
    fontWeight: '700',
    color: 'white',
  },
  categoryBadge: {
    backgroundColor: Colors.primary.ocean + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.radius.full,
  },
  categoryText: {
    fontSize: Typography.caption.lg.fontSize,
    fontWeight: '600',
    color: Colors.primary.ocean,
    textTransform: 'capitalize',
  },
  reviewCount: {
    fontSize: Typography.caption.lg.fontSize,
  },
  description: {
    fontSize: Typography.body.md.fontSize,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.heading.sm.fontSize,
    fontWeight: Typography.heading.sm.fontWeight as any,
    marginBottom: Spacing.md,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  infoTile: {
    width: '47%',
    padding: Spacing.md,
    borderRadius: Spacing.radius.md,
  },
  infoIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  infoLabel: {
    fontSize: Typography.caption.md.fontSize,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: Typography.body.sm.fontSize,
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.radius.sm,
  },
  chipText: {
    fontSize: Typography.body.sm.fontSize,
    fontWeight: '500',
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  highlightBullet: {
    marginRight: Spacing.sm,
    fontSize: Typography.body.md.fontSize,
  },
  highlightText: {
    fontSize: Typography.body.md.fontSize,
    lineHeight: 20,
    flex: 1,
  },
  attractionCard: {
    marginBottom: Spacing.md,
  },
  attractionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  attractionIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  attractionIcon: {
    fontSize: 22,
  },
  attractionInfo: {
    flex: 1,
  },
  attractionName: {
    fontSize: Typography.subtitle.md.fontSize,
    fontWeight: Typography.subtitle.md.fontWeight as any,
  },
  attractionType: {
    fontSize: Typography.caption.md.fontSize,
    textTransform: 'capitalize',
  },
  attractionRatingBadge: {
    backgroundColor: '#FFB80020',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.radius.full,
    marginLeft: Spacing.sm,
  },
  attractionRating: {
    fontSize: Typography.caption.lg.fontSize,
    fontWeight: '600',
    color: '#FFB800',
  },
  attractionDescription: {
    fontSize: Typography.body.sm.fontSize,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  attractionFooter: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  attractionMeta: {
    fontSize: Typography.caption.md.fontSize,
    fontWeight: '500',
  },
  actionBar: {
    borderTopWidth: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  actionBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionInfo: {
    flex: 1,
  },
  actionRating: {
    fontSize: Typography.subtitle.md.fontSize,
    fontWeight: '700',
    marginBottom: 2,
  },
  actionRegion: {
    fontSize: Typography.caption.md.fontSize,
  },
  actionButton: {
    minWidth: 160,
  },
});
