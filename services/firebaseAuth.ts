/**
 * Firebase Authentication Service
 * Handles user authentication, registration, and session management
 */

import { auth, firestore } from './firebase';
import { User } from '../types';

class FirebaseAuthService {
  /**
   * Register a new user with email and password
   */
  async register(email: string, password: string, name: string): Promise<User> {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user.uid;

      const userData: User = {
        id: uid,
        email,
        name,
        preferredCurrency: 'USD',
        preferredLanguage: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await firestore().collection('users').doc(uid).set(userData);
      return userData;
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const uid = userCredential.user.uid;

      const userDoc = await firestore().collection('users').doc(uid).get();
      const userData = userDoc.data() as User;

      if (!userData) {
        throw new Error('User data not found');
      }

      return userData;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await auth().signOut();
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  }

  /**
   * Reset password for user
   */
  async resetPassword(email: string): Promise<void> {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error: any) {
      throw new Error(error.message || 'Password reset failed');
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
    try {
      await firestore().collection('users').doc(userId).update({
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(error.message || 'Profile update failed');
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) return null;

      const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
      return userDoc.data() as User;
    } catch (error) {
      return null;
    }
  }

  /**
   * Watch authentication state
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return auth().onAuthStateChanged(async (firebaseUser: any) => {
      if (firebaseUser) {
        const userDoc = await firestore()
          .collection('users')
          .doc(firebaseUser.uid)
          .get();
        callback(userDoc.data() as User);
      } else {
        callback(null);
      }
    });
  }
}

export default new FirebaseAuthService();
