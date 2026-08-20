/**
 * Profile Screen
 * User profile management and settings
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');

  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    const performLogout = async () => {
      try {
        await logout();
        router.replace('/auth/login');
      } catch (error) {
        Alert.alert('Error', 'Failed to logout');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to logout?')) {
        performLogout();
      }
    } else {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', onPress: () => {} },
          {
            text: 'Logout',
            onPress: performLogout,
            style: 'destructive',
          },
        ]
      );
    }
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
      >
        {/* Header */}
        <View style={[styles.header, { paddingHorizontal: Spacing.lg }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            👤 Profile
          </Text>
        </View>

        {/* User Info Card */}
        <View style={[styles.section, { paddingHorizontal: Spacing.lg }]}>
          <Card isDark={isDark} pressure="md">
            <View style={styles.userInfoContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>👤</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.userName, { color: colors.text }]}>
                  {user?.name || 'User'}
                </Text>
                <Text
                  style={[styles.userEmail, { color: colors.textSecondary }]}
                >
                  {user?.email || 'email@example.com'}
                </Text>
              </View>

              <TouchableOpacity>
                <Text style={{ fontSize: 20 }}>✏️</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* Preferences Section */}
        <View style={[styles.section, { paddingHorizontal: Spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Preferences
          </Text>

          <Card isDark={isDark} pressure="sm" style={{ marginBottom: Spacing.md }}>
            <View style={styles.settingItem}>
              <View>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Push Notifications
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  Get updates about your trips
                </Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={(val) => { triggerHaptic(); setNotifications(val); }}
                trackColor={{
                  false: colors.surfaceVariant,
                  true: Colors.primary.ocean + '80',
                }}
                thumbColor={
                  notifications ? Colors.primary.ocean : colors.textSecondary
                }
              />
            </View>
          </Card>

          <Card isDark={isDark} pressure="sm">
            <View style={styles.settingItem}>
              <View>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Dark Mode
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  Reduce eye strain
                </Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={(val) => { triggerHaptic(); setDarkMode(val); }}
                trackColor={{
                  false: colors.surfaceVariant,
                  true: Colors.primary.ocean + '80',
                }}
                thumbColor={
                  darkMode ? Colors.primary.ocean : colors.textSecondary
                }
              />
            </View>
          </Card>
        </View>

        {/* Travel Stats */}
        <View style={[styles.section, { paddingHorizontal: Spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Travel Stats
          </Text>

          <View style={styles.statsGrid}>
            <Card isDark={isDark} pressure="sm" style={{ flex: 1 }}>
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>🌍</Text>
                <Text
                  style={[
                    styles.statValue,
                    { color: colors.text },
                  ]}
                >
                  12
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Countries
                </Text>
              </View>
            </Card>

            <Card isDark={isDark} pressure="sm" style={{ flex: 1 }}>
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>✈️</Text>
                <Text
                  style={[
                    styles.statValue,
                    { color: colors.text },
                  ]}
                >
                  18
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Trips
                </Text>
              </View>
            </Card>

            <Card isDark={isDark} pressure="sm" style={{ flex: 1 }}>
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>📅</Text>
                <Text
                  style={[
                    styles.statValue,
                    { color: colors.text },
                  ]}
                >
                  142
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Days
                </Text>
              </View>
            </Card>
          </View>
        </View>

        {/* Support Section */}
        <View style={[styles.section, { paddingHorizontal: Spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Support & About
          </Text>

          <TouchableOpacity
            style={[
              styles.settingButton,
              {
                backgroundColor: colors.surfaceVariant,
                borderColor: colors.border,
              },
            ]}
            onPress={() => console.log('Help & Support')}
          >
            <Text style={[styles.buttonLabel, { color: colors.text }]}>
              Help & Support
            </Text>
            <Text style={{ color: colors.textSecondary }}>→</Text>
          </TouchableOpacity>

<TouchableOpacity
            style={[
              styles.settingButton,
              {
                backgroundColor: colors.surfaceVariant,
                borderColor: colors.border,
              },
            ]}
            onPress={() => console.log('About')}
          >
            <Text style={[styles.buttonLabel, { color: colors.text }]}>
              About KopiTrip
            </Text>
            <Text style={{ color: colors.textSecondary }}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.settingButton,
              {
                backgroundColor: colors.surfaceVariant,
                borderColor: colors.border,
              },
            ]}
            onPress={() => console.log('Privacy')}
          >
            <Text style={[styles.buttonLabel, { color: colors.text }]}>
              Privacy Policy
            </Text>
            <Text style={{ color: colors.textSecondary }}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={[styles.section, { paddingHorizontal: Spacing.lg }]}>
          <Button
            label="Logout"
            onPress={handleLogout}
            variant="outlined"
            style={{
              borderColor: Colors.error,
              borderWidth: 2,
            }}
            textStyle={{
              color: Colors.error,
            }}
            isDark={isDark}
          />
        </View>

        {/* App Version */}
        <View
          style={[
            styles.footer,
            { paddingHorizontal: Spacing.lg, marginTop: Spacing['3xl'] },
          ]}
        >
          <Text
            style={[styles.versionText, { color: colors.textSecondary }]}
          >
KopiTrip v2.0.0
          </Text>
        </View>
      </ScrollView>
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
  },
  section: {
    marginBottom: Spacing['3xl'],
  },
  sectionTitle: {
    fontSize: Typography.heading.md.fontSize,
    fontWeight: Typography.heading.md.fontWeight as any,
    marginBottom: Spacing.lg,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary.ocean + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
  },
  userName: {
    fontSize: Typography.subtitle.lg.fontSize,
    fontWeight: Typography.subtitle.lg.fontWeight as any,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: Typography.body.sm.fontSize,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: Typography.subtitle.md.fontSize,
    fontWeight: Typography.subtitle.md.fontWeight as any,
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    fontSize: Typography.body.sm.fontSize,
  },
  settingButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Spacing.radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
  },
  buttonLabel: {
    fontSize: Typography.body.md.fontSize,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: Typography.display.sm.fontSize,
    fontWeight: Typography.display.sm.fontWeight as any,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.caption.md.fontSize,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  versionText: {
    fontSize: Typography.caption.md.fontSize,
  },
});
