/**
 * Modal Component
 * Reusable modal with customizable header, content, and actions
 */

import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  SafeAreaView,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';

interface ModalProps {
  visible: boolean;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
  closeButtonText?: string;
  actionButtonText?: string;
  onAction?: () => void;
  actionButtonDisabled?: boolean;
  actionButtonVariant?: 'primary' | 'danger';
  showCloseIcon?: boolean;
  contentStyle?: ViewStyle;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  title,
  subtitle,
  children,
  onClose,
  closeButtonText = 'Cancel',
  actionButtonText,
  onAction,
  actionButtonDisabled = false,
  actionButtonVariant = 'primary',
  showCloseIcon = true,
  contentStyle,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const styles = getStyles(isDark);

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          {title && (
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
          )}
          {showCloseIcon && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.content, contentStyle]}>{children}</View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>{closeButtonText}</Text>
          </TouchableOpacity>
          {actionButtonText && (
            <TouchableOpacity
              style={[
                styles.button,
                styles.actionButton,
                actionButtonVariant === 'danger' && styles.dangerButton,
                actionButtonDisabled && styles.buttonDisabled,
              ]}
              onPress={onAction}
              disabled={actionButtonDisabled}
            >
              <Text style={styles.actionButtonText}>{actionButtonText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </RNModal>
  );
};

function getStyles(isDark: boolean) {
  const colors = isDark ? Colors.dark : Colors.light;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginBottom: Spacing.xs,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    closeButton: {
      padding: Spacing.sm,
      marginLeft: Spacing.md,
    },
    content: {
      flex: 1,
      padding: Spacing.lg,
    },
    footer: {
      flexDirection: 'row',
      gap: Spacing.md,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    button: {
      flex: 1,
      paddingVertical: Spacing.md,
      borderRadius: Spacing.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: colors.surfaceVariant,
    },
    cancelButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    actionButton: {
      backgroundColor: Colors.primary.ocean,
    },
    dangerButton: {
      backgroundColor: Colors.error,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFF',
    },
  });
}
