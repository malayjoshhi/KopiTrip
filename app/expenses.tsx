import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import { useTrips } from '@/hooks/useTrips';
import expensesService from '@/services/expenses';
import { Expense, Trip } from '@/types';

const CATEGORIES = [
  { id: 'transport', name: 'Transport', emoji: '✈️', color: '#3B82F6' },
  { id: 'accommodation', name: 'Accommodation', emoji: '🏨', color: '#10B981' },
  { id: 'food', name: 'Food & Dining', emoji: '🍽️', color: '#F59E0B' },
  { id: 'activities', name: 'Activities', emoji: '🎟️', color: '#8B5CF6' },
  { id: 'shopping', name: 'Shopping', emoji: '🛍️', color: '#EC4899' },
  { id: 'other', name: 'Other', emoji: '📦', color: '#6B7280' },
];

export default function ExpensesScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { trips, fetchUserTrips } = useTrips();

  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Expense form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('transport');

  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserTrips(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    // Select first trip automatically
    if (trips.length > 0 && !selectedTrip) {
      setSelectedTrip(trips[0]);
    }
  }, [trips]);

  useEffect(() => {
    if (selectedTrip) {
      loadExpenses(selectedTrip.id);
    }
  }, [selectedTrip]);

  const loadExpenses = async (tripId: string) => {
    setIsLoading(true);
    try {
      const results = await expensesService.getTripExpenses(tripId);
      setExpenses(results);
    } catch (e) {
      // Fallback Mock Expenses
      setExpenses([
        {
          id: 'ex-1',
          tripId,
          title: 'Flight Ticket',
          amount: 520,
          category: 'transport',
          date: new Date(),
          currency: 'USD',
          paidBy: 'demo-user-123',
        },
        {
          id: 'ex-2',
          tripId,
          title: 'Hotel Stay (2 nights)',
          amount: 380,
          category: 'accommodation',
          date: new Date(Date.now() - 24 * 3600 * 1000),
          currency: 'USD',
          paidBy: 'demo-user-123',
        },
        {
          id: 'ex-3',
          tripId,
          title: 'Dinner at Bistro',
          amount: 75,
          category: 'food',
          date: new Date(Date.now() - 48 * 3600 * 1000),
          currency: 'USD',
          paidBy: 'demo-user-123',
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExpense = async () => {
    triggerHaptic();
    if (!title || !amount || !selectedTrip) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const expenseAmount = parseFloat(amount);
    if (isNaN(expenseAmount) || expenseAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      const expenseData: Omit<Expense, 'id'> = {
        tripId: selectedTrip.id,
        title,
        amount: expenseAmount,
        category,
        date: new Date(),
        currency: 'USD',
        paidBy: user?.id || 'demo-user-123',
      };

      const newExpense = await expensesService.addExpense(expenseData);
      setExpenses(prev => [newExpense, ...prev]);
      setShowAddModal(false);
      setTitle('');
      setAmount('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save expense');
    }
  };

  const totalBudget = selectedTrip?.budget?.totalBudget || 2000;
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const percentSpent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const getCategoryStats = (catId: string) => {
    return expenses
      .filter(e => e.category === catId)
      .reduce((sum, item) => sum + item.amount, 0);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => { triggerHaptic(); router.back(); }} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Expenses</Text>
        <TouchableOpacity onPress={() => { triggerHaptic(); setShowAddModal(true); }} style={styles.addBtn}>
          <Ionicons name="add" size={24} color={Colors.primary.ocean} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Trip Selector */}
        {trips.length > 0 ? (
          <View style={styles.selectorContainer}>
            <Text style={[styles.selectorLabel, { color: colors.textSecondary }]}>Selected Trip</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorScroll}>
              {trips.map(trip => (
                <TouchableOpacity
                  key={trip.id}
                  style={[
                    styles.tripTag,
                    { backgroundColor: selectedTrip?.id === trip.id ? Colors.primary.ocean : colors.surfaceVariant }
                  ]}
                  onPress={() => { triggerHaptic(); setSelectedTrip(trip); }}
                >
                  <Text style={[styles.tripTagText, { color: selectedTrip?.id === trip.id ? 'white' : colors.text }]}>
                    {trip.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : (
          <Card isDark={isDark} style={styles.noTripsCard} pressure="sm">
            <Text style={[styles.noTripsText, { color: colors.textSecondary }]}>Create a trip to track expenses!</Text>
          </Card>
        )}

        {/* Budget Overview Card */}
        <Card isDark={isDark} style={styles.budgetOverview} pressure="md">
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Trip Budget</Text>
          <View style={styles.budgetAmountBlock}>
            <View>
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Total Spent</Text>
              <Text style={[styles.spentText, { color: totalSpent > totalBudget ? Colors.error : colors.text }]}>
                ${totalSpent.toFixed(2)}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Total Budget</Text>
              <Text style={[styles.budgetText, { color: colors.text }]}>${totalBudget.toFixed(2)}</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={[styles.progressBarBg, { backgroundColor: colors.surfaceVariant }]}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.min(percentSpent, 100)}%`,
                  backgroundColor: totalSpent > totalBudget ? Colors.error : Colors.primary.ocean,
                }
              ]}
            />
          </View>
          <Text style={[styles.percentText, { color: colors.textSecondary }]}>{percentSpent.toFixed(1)}% of budget used</Text>
        </Card>

        {/* Category Breakdown */}
        <Text style={[styles.sectionHeading, { color: colors.text }]}>Category Breakdown</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map(cat => {
            const spent = getCategoryStats(cat.id);
            if (spent === 0) return null;
            return (
              <Card key={cat.id} isDark={isDark} style={styles.categoryCard} pressure="sm">
                <View style={styles.categoryHeader}>
                  <View style={[styles.emojiBg, { backgroundColor: cat.color + '20' }]}>
                    <Text style={{ fontSize: 18 }}>{cat.emoji}</Text>
                  </View>
                  <Text style={[styles.categoryName, { color: colors.text }]} numberOfLines={1}>
                    {cat.name}
                  </Text>
                </View>
                <Text style={[styles.categorySpent, { color: colors.text }]}>${spent.toFixed(2)}</Text>
              </Card>
            );
          })}
        </View>

        {/* Recent Transactions */}
        <Text style={[styles.sectionHeading, { color: colors.text }]}>Recent Transactions</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary.ocean} style={{ marginTop: Spacing.xl }} />
        ) : expenses.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No expenses logged yet.</Text>
        ) : (
          <View style={styles.transactionsList}>
            {expenses.map(item => {
              const cat = CATEGORIES.find(c => c.id === item.category) || CATEGORIES[5];
              return (
                <View key={item.id} style={[styles.transactionItem, { borderBottomColor: colors.border }]}>
                  <View style={styles.transactionLeft}>
                    <View style={[styles.emojiBg, { backgroundColor: cat.color + '20' }]}>
                      <Text style={{ fontSize: 16 }}>{cat.emoji}</Text>
                    </View>
                    <View>
                      <Text style={[styles.transactionTitle, { color: colors.text }]}>{item.title}</Text>
                      <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>
                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.transactionAmount, { color: colors.text }]}>-${item.amount.toFixed(2)}</Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Add Expense Modal */}
      <Modal
        visible={showAddModal}
        title="Add Expense"
        onClose={() => setShowAddModal(false)}
        actionButtonText="Save"
        onAction={handleAddExpense}
        actionButtonDisabled={!title || !amount}
      >
        <View style={{ gap: Spacing.md }}>
          <TextInput
            label="Title"
            placeholder="e.g. Lunch at Cafe"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            label="Amount ($)"
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            type="phone"
          />
          <View style={styles.inputGroup}>
            <Text style={[styles.pickerLabel, { color: colors.text }]}>Category</Text>
            <View style={styles.pickerGrid}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.pickerButton,
                    {
                      borderColor: category === cat.id ? Colors.primary.ocean : colors.border,
                      backgroundColor: category === cat.id ? Colors.primary.ocean + '15' : 'transparent',
                    }
                  ]}
                  onPress={() => { triggerHaptic(); setCategory(cat.id); }}
                >
                  <Text style={{ fontSize: 16, marginRight: 4 }}>{cat.emoji}</Text>
                  <Text style={[styles.pickerButtonText, { color: category === cat.id ? Colors.primary.ocean : colors.text }]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  addBtn: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.heading.md.fontSize,
    fontWeight: '700',
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  selectorContainer: {
    marginBottom: Spacing.lg,
  },
  selectorLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  selectorScroll: {
    gap: Spacing.sm,
  },
  tripTag: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.radius.full,
    marginRight: Spacing.sm,
  },
  tripTagText: {
    fontSize: 14,
    fontWeight: '600',
  },
  noTripsCard: {
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  noTripsText: {
    fontSize: 14,
  },
  budgetOverview: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: Spacing.radius.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  budgetAmountBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  metaLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 2,
  },
  spentText: {
    fontSize: 24,
    fontWeight: '800',
  },
  budgetText: {
    fontSize: 20,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentText: {
    fontSize: 12,
    fontWeight: '500',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  categoryCard: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.md,
    gap: Spacing.sm,
    borderRadius: Spacing.radius.lg,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  emojiBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  categorySpent: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: Spacing.xl,
    fontSize: 14,
  },
  transactionsList: {
    gap: Spacing.xs,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
  },
  inputGroup: {
    marginTop: Spacing.sm,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  pickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.radius.md,
    borderWidth: 1.5,
  },
  pickerButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
