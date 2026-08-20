/**
 * Search Input Component
 * Reusable search bar with icon
 */

import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { Colors } from '@/constants/Colors';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onPress?: () => void;
  isDark?: boolean;
  style?: ViewStyle;
  icon?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onPress,
  isDark = false,
  style,
  icon = '🔍',
}) => {
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceVariant,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      <TouchableOpacity onPress={onPress} style={styles.icon}>
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </TouchableOpacity>

      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        editable={!onPress}
      />

      {value ? (
        <TouchableOpacity
          onPress={() => onChangeText('')}
          style={styles.clearIcon}
        >
          <Text style={{ fontSize: 16, color: colors.textSecondary }}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Spacing.radius.md,
    paddingHorizontal: Spacing.lg,
    height: 44,
    gap: Spacing.md,
  },
  icon: {
    padding: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Typography.body.md.fontSize,
    paddingVertical: Spacing.sm,
  },
  clearIcon: {
    padding: Spacing.sm,
  },
});
