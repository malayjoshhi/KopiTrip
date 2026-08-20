/**
 * Text Input Component
 * Reusable text input field with validation and states
 */

import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/Theme';

interface TextInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  label?: string;
  error?: string;
  type?: 'text' | 'email' | 'password' | 'phone';
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  autoComplete?: 'email' | 'password' | 'off';
  editable?: boolean;
}

export const TextInput = React.forwardRef<RNTextInput, TextInputProps>(
  (
    {
      placeholder,
      value,
      onChangeText,
      onBlur,
      label,
      error,
      type = 'text',
      disabled = false,
      multiline = false,
      numberOfLines = 1,
      leftIcon,
      rightIcon,
      onRightIconPress,
      containerStyle,
      inputStyle,
      autoComplete = 'off',
      editable = true,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const keyboardType: KeyboardTypeOptions =
      type === 'email' ? 'email-address' : type === 'phone' ? 'phone-pad' : 'default';
    const secureTextEntry = type === 'password' && !showPassword;

    const handleRightIconPress = () => {
      if (type === 'password') {
        setShowPassword(!showPassword);
      } else if (onRightIconPress) {
        onRightIconPress();
      }
    };

    const styles = getStyles(isFocused, error, disabled);

    return (
      <View style={containerStyle}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={styles.container}>
          {leftIcon && (
            <Ionicons
              name={leftIcon as any}
              size={20}
              color={theme.colors.textSecondary}
              style={styles.leftIcon}
            />
          )}
          <RNTextInput
            ref={ref}
            style={[styles.input, inputStyle]}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textTertiary}
            value={value}
            onChangeText={onChangeText}
            onBlur={() => {
              setIsFocused(false);
              onBlur?.();
            }}
            onFocus={() => setIsFocused(true)}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            multiline={multiline}
            numberOfLines={numberOfLines}
            autoComplete={autoComplete}
            editable={editable && !disabled}
          />
          {rightIcon || type === 'password' ? (
            <TouchableOpacity
              onPress={handleRightIconPress}
              style={styles.rightIconContainer}
              disabled={disabled}
            >
              <Ionicons
                name={
                  (type === 'password' && showPassword
                    ? 'eye'
                    : type === 'password'
                      ? 'eye-off'
                      : rightIcon) as any
                }
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }
);

TextInput.displayName = 'TextInput';

function getStyles(isFocused: boolean, error?: string, disabled?: boolean) {
  return StyleSheet.create({
    label: {
      fontSize: theme.typography.caption.fontSize,
      fontWeight: '600',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: error
        ? theme.colors.error
        : isFocused
          ? theme.colors.primary
          : theme.colors.border,
      borderRadius: theme.spacing.lg,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: disabled ? theme.colors.surfaceVariant : theme.colors.surface,
      opacity: disabled ? 0.5 : 1,
    },
    input: {
      flex: 1,
      height: 44,
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.textPrimary,
    },
    leftIcon: {
      marginRight: theme.spacing.sm,
    },
    rightIconContainer: {
      marginLeft: theme.spacing.sm,
      padding: theme.spacing.xs,
    },
    error: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
    },
  });
}
