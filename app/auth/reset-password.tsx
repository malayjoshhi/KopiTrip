/**
 * Reset Password Screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { validateEmail } from '@/utils/helpers';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';

export default function ResetPasswordScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await resetPassword(email);
      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={[styles.contentContainer, { justifyContent: 'center' }]}
      >
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>📧</Text>
          <Text style={[styles.title, { color: colors.text }]}>Reset Link Sent</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Check your email for instructions to reset your password.
          </Text>
          <Button
            label="Back to Sign In"
            onPress={() => router.replace('/auth/login')}
            variant="primary"
            size="large"
            style={{ width: '100%', marginTop: Spacing.xl }}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: Spacing.md }}>
          <Text style={[styles.backButton, { color: Colors.primary.ocean }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Reset Password</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Enter your email to receive a reset link
        </Text>
      </View>

      {error ? (
        <View style={[styles.errorContainer, { backgroundColor: Colors.error + '20' }]}>
          <Text style={[styles.errorText, { color: Colors.error }]}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.formContainer}>
        <TextInput
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          disabled={isLoading}
          type="email"
          leftIcon="mail-outline"
          autoComplete="email"
          containerStyle={{ marginBottom: Spacing.xl }}
        />

        <Button
          label="Send Reset Link"
          onPress={handleResetPassword}
          isLoading={isLoading}
          variant="primary"
          size="large"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  backButton: {
    fontSize: Typography.body.md.fontSize,
    marginBottom: Spacing.lg,
  },
  headerContainer: {
    marginBottom: Spacing['4xl'],
  },
  title: {
    fontSize: Typography.display.md.fontSize,
    fontWeight: Typography.display.md.fontWeight as any,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.body.md.fontSize,
  },
  successContainer: {
    alignItems: 'center',
    marginTop: Spacing['5xl'],
  },
  successEmoji: {
    fontSize: 64,
    marginBottom: Spacing.xl,
  },
  description: {
    fontSize: Typography.body.md.fontSize,
    textAlign: 'center',
    marginBottom: Spacing['3xl'],
    lineHeight: 24,
  },
  errorContainer: {
    borderRadius: Spacing.radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  errorText: {
    fontSize: Typography.body.sm.fontSize,
    fontWeight: '500',
  },
  formContainer: {
    marginBottom: Spacing['3xl'],
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.subtitle.md.fontSize,
    fontWeight: Typography.subtitle.md.fontWeight as any,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: Typography.body.md.fontSize,
    minHeight: 48,
  },
  button: {
    borderRadius: Spacing.radius.md,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginTop: Spacing.xl,
  },
  buttonText: {
    color: 'white',
    fontSize: Typography.button.md.fontSize,
    fontWeight: Typography.button.md.fontWeight as any,
  },
});
