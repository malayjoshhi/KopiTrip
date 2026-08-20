/**
 * Button Component
 * Reusable button with multiple variants
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { Colors } from '@/constants/Colors';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isDark?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  isDark = false,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return isDark ? Colors.dark.surfaceVariant : Colors.light.surfaceVariant;
    
    switch (variant) {
      case 'primary':
        return Colors.primary.ocean;
      case 'secondary':
        return Colors.primary.sky;
      case 'outlined':
        return 'transparent';
      default:
        return Colors.primary.ocean;
    }
  };

  const getTextColor = () => {
    if (variant === 'outlined') return Colors.primary.ocean;
    if (disabled) return isDark ? Colors.dark.textSecondary : Colors.light.textSecondary;
    return 'white';
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md };
      case 'medium':
        return { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg };
      case 'large':
        return { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xl };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return Typography.button.sm.fontSize;
      case 'medium':
        return Typography.button.md.fontSize;
      case 'large':
        return Typography.button.lg.fontSize;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderWidth: variant === 'outlined' ? 2 : 0,
          borderColor: variant === 'outlined' ? Colors.primary.ocean : 'transparent',
          ...getPadding(),
        },
        disabled && { opacity: 0.5 },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <Text
          style={[
            {
              color: getTextColor(),
              fontSize: getTextSize(),
              fontWeight: Typography.button.md.fontWeight as any,
            },
            textStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: Spacing.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
});
