/**
 * Badge Component
 * Display status, tags, or labels
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { Colors } from '@/constants/Colors';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'medium',
  style,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'success':
        return Colors.success + '20';
      case 'warning':
        return Colors.warning + '20';
      case 'error':
        return Colors.error + '20';
      case 'info':
        return Colors.info + '20';
      case 'neutral':
      default:
        return Colors.neutral[200];
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'success':
        return Colors.success;
      case 'warning':
        return Colors.warning;
      case 'error':
        return Colors.error;
      case 'info':
        return Colors.info;
      case 'neutral':
      default:
        return Colors.neutral[700];
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs };
      case 'medium':
        return { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm };
      case 'large':
        return { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return Typography.caption.md.fontSize;
      case 'medium':
        return Typography.caption.lg.fontSize;
      case 'large':
        return Typography.body.sm.fontSize;
    }
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: getBackgroundColor(),
          ...getPadding(),
        },
        style,
      ]}
    >
      <Text
        style={{
          color: getTextColor(),
          fontSize: getTextSize(),
          fontWeight: '600',
        }}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: Spacing.radius.full,
    alignSelf: 'flex-start',
  },
});
