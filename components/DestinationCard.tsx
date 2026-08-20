/**
 * Destination Card Component
 * Display destination with image, name, and rating
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ViewStyle,
} from 'react-native';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { Colors } from '@/constants/Colors';
import { Destination } from '@/types';

interface DestinationCardProps {
  destination: Destination;
  onPress?: () => void;
  isDark?: boolean;
  style?: ViewStyle;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onPress,
  isDark = false,
  style,
}) => {
  const colors = isDark ? Colors.dark : Colors.light;

  const placeholderImage = 'https://via.placeholder.com/300x200?text=' + destination.name;
  const imageSource = destination.images?.[0]
    ? { uri: destination.images[0] }
    : { uri: placeholderImage };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <ImageBackground
        source={imageSource}
        style={styles.image}
        imageStyle={{ borderRadius: Spacing.radius.lg }}
      >
        <View style={styles.gradient} />

        <View style={styles.content}>
          <Text style={[styles.name, { color: 'white' }]} numberOfLines={2}>
            {destination.name}
          </Text>

          <View style={styles.footer}>
            <Text style={[styles.country, { color: 'white' }]}>
              {destination.country}
            </Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>⭐ {destination.rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Spacing.radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  image: {
    width: '100%',
    height: 200,
    justifyContent: 'flex-end',
    padding: Spacing.lg,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    zIndex: 1,
  },
  name: {
    fontSize: Typography.heading.md.fontSize,
    fontWeight: Typography.heading.md.fontWeight as any,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  country: {
    fontSize: Typography.body.md.fontSize,
  },
  ratingBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.radius.full,
  },
  ratingText: {
    fontSize: Typography.caption.lg.fontSize,
    fontWeight: '600',
    color: 'white',
  },
});
