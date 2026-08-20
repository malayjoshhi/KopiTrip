/**
 * Login Screen
 * User authentication screen
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
import { validateEmail } from '@/utils/helpers';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { login, isInitializing } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Login failed');
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
          <Text style={[styles.title, { color: Colors.primary.ocean }]}>KopiTrip</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            ☕ Discover, Plan & Travel
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
          <View style={{ marginBottom: Spacing.lg }}>
            <View style={styles.passwordHeader}>
              <Text style={[styles.label, { color: colors.text }]}>Password</Text>
              <TouchableOpacity onPress={() => router.push('/auth/reset-password')}>
                <Text style={[styles.link, { color: Colors.primary.ocean }]}>Forgot?</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              disabled={isLoading}
              type="password"
              leftIcon="lock-closed-outline"
              autoComplete="password"
            />
          </View>

          {/* Login Button */}
          <Button
            label="Sign In"
            onPress={handleLogin}
            isLoading={isLoading}
            variant="primary"
            size="large"
          />
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/auth/register')}
            disabled={isLoading}
          >
            <Text style={[styles.link, { color: Colors.primary.ocean }]}>Sign Up</Text>
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
    paddingVertical: Spacing.xxl,
  },
  headerContainer: {
    marginBottom: Spacing['4xl'],
    marginTop: Spacing['3xl'],
  },
  title: {
    fontSize: Typography.display.lg.fontSize,
    fontWeight: Typography.display.lg.fontWeight as any,
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
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  link: {
    fontSize: Typography.body.sm.fontSize,
    fontWeight: '500',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Spacing.radius.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 48,
  },
  passwordInput: {
    flex: 1,
    fontSize: Typography.body.md.fontSize,
    paddingVertical: Spacing.md,
  },
  eyeIcon: {
    padding: Spacing.sm,
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
