/**
 * Explore Screen
 * Destination discovery with search and filters
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { SearchInput } from '@/components/ui/SearchInput';
import { DestinationCard } from '@/components/DestinationCard';
import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import destinationService from '@/services/destinations';
import { Destination } from '@/types';

const CATEGORIES = [
  { id: 'all', name: 'All', emoji: '🌍' },
  { id: 'beach', name: 'Beaches', emoji: '🏖️' },
  { id: 'city', name: 'Cities', emoji: '🏙️' },
  { id: 'adventure', name: 'Adventure', emoji: '⛰️' },
  { id: 'culture', name: 'Culture', emoji: '🏛️' },
  { id: 'nature', name: 'Nature', emoji: '🌲' },
  { id: 'family', name: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { id: 'luxury', name: 'Luxury', emoji: '✨' },
];

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    loadDestinations();
  }, []);

  useEffect(() => {
    filterDestinations();
  }, [searchQuery, selectedCategory, destinations]);

  const loadDestinations = async () => {
    setIsLoading(true);
    try {
      const allDestinations = await destinationService.getDestinations();
      setDestinations(allDestinations);
    } catch (error) {
      console.error('Failed to load destinations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterDestinations = () => {
    let filtered = destinations;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (d) => d.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.country.toLowerCase().includes(query) ||
          d.description.toLowerCase().includes(query)
      );
    }

    setFilteredDestinations(filtered);
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
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View style={[styles.header, { paddingHorizontal: Spacing.lg }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            🌍 Explore
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Discover amazing destinations
          </Text>
        </View>

        {/* Search Input */}
        <View style={[styles.searchSection, { paddingHorizontal: Spacing.lg }]}>
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search destinations..."
            isDark={isDark}
          />
        </View>

        {/* Category Filter */}
        <View style={styles.categoriesSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.categoriesContent,
              { paddingHorizontal: Spacing.lg },
            ]}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor:
                      selectedCategory === category.id
                        ? Colors.primary.ocean
                        : colors.surfaceVariant,
                  },
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color:
                        selectedCategory === category.id
                          ? 'white'
                          : colors.text,
                    },
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Results */}
        <View style={[styles.resultsSection, { paddingHorizontal: Spacing.lg }]}>
          {isLoading ? (
            <ActivityIndicator
              color={isDark ? Colors.primary.sky : Colors.primary.ocean}
              size="large"
              style={{ marginVertical: Spacing['3xl'] }}
            />
          ) : filteredDestinations.length > 0 ? (
            <View>
              <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
                Found {filteredDestinations.length} destinations
              </Text>
              <FlatList
                data={filteredDestinations}
                renderItem={({ item }) => (
                  <DestinationCard
                    destination={item}
                    isDark={isDark}
                    onPress={() => {
                      setSelectedDestination(item);
                      setShowDetailsModal(true);
                    }}
                  />
                )}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                style={{ marginTop: Spacing.lg }}
              />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={[styles.emptyText, { color: colors.text }]}>
                No destinations found
              </Text>
              <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
                Try adjusting your search or filters
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showDetailsModal}
        title={selectedDestination?.name || 'Destination Details'}
        onClose={() => setShowDetailsModal(false)}
        actionButtonText="Plan Trip Here"
        onAction={() => {
          if (selectedDestination) {
            setShowDetailsModal(false);
            router.push(`/(tabs)/trips?create=true&destination=${encodeURIComponent(selectedDestination.name)}`);
          }
        }}
      >
        {selectedDestination && (
<ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: '82%' }}>
            {selectedDestination.images?.[0] && (
              <Image
                source={{ uri: selectedDestination.images[0] }}
                style={{ width: '100%', height: 180, borderRadius: Spacing.radius.md, marginBottom: Spacing.md }}
              />
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
                📍 {selectedDestination.name}, {selectedDestination.country}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFB800' }}>
                ⭐ {selectedDestination.rating}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md }}>
              <View style={{ backgroundColor: Colors.primary.ocean + '15', paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: Spacing.radius.full }}>
                <Text style={{ fontSize: 11, fontWeight: '600', color: Colors.primary.ocean, textTransform: 'capitalize' }}>
                  {selectedDestination.category}
                </Text>
              </View>
              {(selectedDestination as any).priceRange && (
                <View style={{ backgroundColor: colors.surfaceVariant, paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: Spacing.radius.full }}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textSecondary }}>
                    {(selectedDestination as any).priceRange}
                  </Text>
                </View>
              )}
            </View>

            <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: Spacing.lg }}>
              {selectedDestination.description}
            </Text>

            {selectedDestination.bestTimeToVisit && (
              <View style={{ marginBottom: Spacing.lg }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: Spacing.xs }}>
                  ☀️ Best Time to Visit
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs }}>
                  {(selectedDestination.bestTimeToVisit as string[]).map((time: string, idx: number) => (
                    <View key={idx} style={{ backgroundColor: colors.surfaceVariant, paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: Spacing.radius.sm }}>
                      <Text style={{ fontSize: 11, color: colors.text }}>{time}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {selectedDestination.attractions && (selectedDestination.attractions as any[]).length > 0 && (
              <View style={{ marginBottom: Spacing.md }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: Spacing.sm }}>
                  🎡 Top Attractions
                </Text>
{(selectedDestination.attractions as any[]).map((att: any, idx: number) => (
                  <Card key={idx} isDark={isDark} style={{ padding: Spacing.md, marginBottom: Spacing.sm }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 2 }}>
                      {att.name}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                      {att.description}
                    </Text>
                  </Card>
                ))}
              </View>
            )}

            {/* View Full Details Button */}
            <TouchableOpacity
              style={[
                styles.viewDetailsButton,
                { backgroundColor: colors.surfaceVariant },
              ]}
              onPress={() => {
                setShowDetailsModal(false);
                router.push({
                  pathname: '/destination/[id]',
                  params: { id: selectedDestination.id },
                });
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="open-outline" size={18} color={Colors.primary.ocean} style={{ marginRight: Spacing.sm }} />
              <Text style={[styles.viewDetailsText, { color: Colors.primary.ocean }]}>
                View Full Details
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
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
  searchSection: {
    marginBottom: Spacing.lg,
  },
  categoriesSection: {
    marginBottom: Spacing.lg,
  },
  categoriesContent: {
    gap: Spacing.md,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.radius.full,
    gap: Spacing.xs,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: Typography.body.sm.fontSize,
    fontWeight: '600',
  },
  resultsSection: {
    flex: 1,
  },
  resultCount: {
    fontSize: Typography.body.sm.fontSize,
    fontWeight: '500',
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
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: Spacing.radius.md,
    marginTop: Spacing.sm,
  },
  viewDetailsText: {
    fontSize: Typography.button.md.fontSize,
    fontWeight: '600',
  },
});
