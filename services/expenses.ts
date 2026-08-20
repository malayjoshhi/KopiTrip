/**
 * Expenses Service
 * Handles trip expense tracking and budget management
 */

import { firestore } from './firebase';
import { Expense, TripBudget } from '../types';

class ExpenseService {
  /**
   * Add expense to trip
   */
  async addExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
    try {
      const docRef = await firestore().collection('expenses').add(expense);
      return { ...expense, id: docRef.id };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to add expense');
    }
  }

  /**
   * Get expenses for a trip
   */
  async getTripExpenses(tripId: string): Promise<Expense[]> {
    try {
      const snapshot = await firestore()
        .collection('expenses')
        .where('tripId', '==', tripId)
        .orderBy('date', 'desc')
        .get();

      return snapshot.docs.map((doc: any) => ({
        ...doc.data(),
        id: doc.id,
      })) as Expense[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch expenses');
    }
  }

  /**
   * Update expense
   */
  async updateExpense(expenseId: string, updates: Partial<Expense>): Promise<void> {
    try {
      await firestore().collection('expenses').doc(expenseId).update(updates);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update expense');
    }
  }

  /**
   * Delete expense
   */
  async deleteExpense(expenseId: string): Promise<void> {
    try {
      await firestore().collection('expenses').doc(expenseId).delete();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete expense');
    }
  }

  /**
   * Get expense summary for trip
   */
  async getExpenseSummary(tripId: string): Promise<{
    totalSpent: number;
    byCategory: Record<string, number>;
    byPerson: Record<string, number>;
  }> {
    try {
      const expenses = await this.getTripExpenses(tripId);

      const summary = {
        totalSpent: 0,
        byCategory: {} as Record<string, number>,
        byPerson: {} as Record<string, number>,
      };

      expenses.forEach((expense) => {
        summary.totalSpent += expense.amount;

        if (!summary.byCategory[expense.category]) {
          summary.byCategory[expense.category] = 0;
        }
        summary.byCategory[expense.category] += expense.amount;

        if (!summary.byPerson[expense.paidBy]) {
          summary.byPerson[expense.paidBy] = 0;
        }
        summary.byPerson[expense.paidBy] += expense.amount;
      });

      return summary;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get expense summary');
    }
  }

  /**
   * Calculate split expenses
   */
  async calculateSplits(tripId: string): Promise<Record<string, Record<string, number>>> {
    try {
      const expenses = await this.getTripExpenses(tripId);
      const splits: Record<string, Record<string, number>> = {};

      expenses.forEach((expense) => {
        if (expense.splitWith && expense.splitWith.length > 0) {
          const splitAmount = expense.amount / (expense.splitWith.length + 1);

          if (!splits[expense.paidBy]) {
            splits[expense.paidBy] = {};
          }

          expense.splitWith.forEach((person) => {
            if (!splits[person]) {
              splits[person] = {};
            }
            if (!splits[person][expense.paidBy]) {
              splits[person][expense.paidBy] = 0;
            }
            splits[person][expense.paidBy] += splitAmount;
          });
        }
      });

      return splits;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to calculate splits');
    }
  }
}

export default new ExpenseService();
