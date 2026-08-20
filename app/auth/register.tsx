/**
 * Register Screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { validateEmail, validatePassword } from '@/utils/helpers';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0]);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await register(email, password, name);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.backButton, { color: Colors.primary.ocean }]}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: Colors.primary.ocean }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Join millions of travelers
          </Text>
        </View>

        {/* Error Message */}
        {error ? (
          <View style={[styles.errorContainer, { backgroundColor: Colors.error + '20' }]}>
            <Text style={[styles.errorText, { color: Colors.error }]}>{error}</Text>
          </View>
        ) : null}

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Name Input */}
          <TextInput
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            disabled={isLoading}
            autoComplete="off"
            leftIcon="person-outline"
            containerStyle={{ marginBottom: Spacing.md }}
          />

          {/* Email Input */}
          <TextInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            disabled={isLoading}
            type="email"
            leftIcon="mail-outline"
            autoComplete="email"
            containerStyle={{ marginBottom: Spacing.md }}
          />

          {/* Password Input */}
          <TextInput
            label="Password"
            placeholder="Minimum 8 characters"
            value={password}
            onChangeText={setPassword}
            disabled={isLoading}
            type="password"
            leftIcon="lock-closed-outline"
            autoComplete="password"
            containerStyle={{ marginBottom: Spacing.md }}
          />

          {/* Confirm Password Input */}
          <TextInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            disabled={isLoading}
            type="password"
            leftIcon="lock-closed-outline"
            autoComplete="password"
            containerStyle={{ marginBottom: Spacing.xl }}
          />

          {/* Register Button */}
          <Button
            label="Create Account"
            onPress={handleRegister}
            isLoading={isLoading}
            variant="primary"
            size="large"
          />
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/auth/login')}
            disabled={isLoading}
          >
            <Text style={[styles.link, { color: Colors.primary.ocean }]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginBottom: Spacing['3xl'],
  },
  title: {
    fontSize: Typography.display.md.fontSize,
    fontWeight: Typography.display.md.fontWeight as any,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.body.md.fontSize,
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
  link: {
    fontSize: Typography.body.sm.fontSize,
    fontWeight: '500',
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
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: Typography.body.sm.fontSize,
  },
});
