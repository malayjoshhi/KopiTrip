import { NativeModules } from 'react-native';

const hasNativeFirebase = !!NativeModules.RNFBAppModule;

let nativeAuth: any = null;
let nativeFirestore: any = null;

if (hasNativeFirebase) {
  try {
    nativeAuth = require('@react-native-firebase/auth').default;
    nativeFirestore = require('@react-native-firebase/firestore').default;
  } catch (e) {
    console.warn('Failed to require native Firebase modules:', e);
  }
}

// In-Memory Database for Mock Fallback
const db: Record<string, Record<string, any>> = {
  users: {},
  destinations: {
    'paris': {
      id: 'paris',
      name: 'Paris',
      country: 'France',
      category: 'city',
      rating: 4.8,
      reviewCount: 340,
      images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'],
      description: 'The city of lights, culture, art, fashion, gastronomy, and romance.',
      priceRange: '$$$',
      location: { latitude: 48.8566, longitude: 2.3522 },
      bestTimeToVisit: ['Spring (Apr-Jun)', 'Fall (Sep-Oct)'],
      attractions: [
        { id: 'a1', name: 'Eiffel Tower', rating: 4.8, type: 'landmark', description: 'Iconic iron grid tower.' },
        { id: 'a2', name: 'Louvre Museum', rating: 4.7, type: 'museum', description: 'World’s largest art museum.' }
      ]
    },
    'bali': {
      id: 'bali',
      name: 'Bali',
      country: 'Indonesia',
      category: 'beach',
      rating: 4.9,
      reviewCount: 512,
      images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'],
      description: 'A tropical paradise known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.',
      priceRange: '$$',
      location: { latitude: -8.4095, longitude: 115.1889 },
      bestTimeToVisit: ['May', 'June', 'July', 'August', 'September'],
      attractions: [
        { id: 'b1', name: 'Uluwatu Temple', rating: 4.7, type: 'landmark', description: 'Clifftop sea temple.' },
        { id: 'b2', name: 'Tegallalang Rice Terraces', rating: 4.6, type: 'nature', description: 'Scenic terraced slopes.' }
      ]
    },
    'tokyo': {
      id: 'tokyo',
      name: 'Tokyo',
      country: 'Japan',
      category: 'city',
      rating: 4.7,
      reviewCount: 290,
      images: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'],
      description: 'Japan’s busy capital, mixing ultramodern neon skyscrapers with historic Shinto shrines.',
      priceRange: '$$$',
      location: { latitude: 35.6762, longitude: 139.6503 },
      bestTimeToVisit: ['Spring (Mar-May)', 'Autumn (Sep-Nov)'],
      attractions: [
        { id: 't1', name: 'Sensō-ji', rating: 4.7, type: 'landmark', description: 'Tokyo’s oldest Buddhist temple.' },
        { id: 't2', name: 'Shibuya Crossing', rating: 4.5, type: 'landmark', description: 'Famed scramble crossing.' }
      ]
    },
    'swiss-alps': {
      id: 'swiss-alps',
      name: 'Swiss Alps',
      country: 'Switzerland',
      category: 'adventure',
      rating: 4.9,
      reviewCount: 180,
      images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'],
      description: 'Majestic peaks, crystal clear alpine lakes, and world-class skiing resorts.',
      priceRange: '$$$$',
      location: { latitude: 46.8182, longitude: 8.2275 },
      bestTimeToVisit: ['Winter (Dec-Mar)', 'Summer (Jun-Sep)'],
      attractions: [
        { id: 's1', name: 'Matterhorn', rating: 4.9, type: 'nature', description: 'Pyramidal mountain peak.' },
        { id: 's2', name: 'Interlaken', rating: 4.8, type: 'nature', description: 'Resort town between lakes.' }
      ]
    },
    'rome': {
      id: 'rome',
      name: 'Rome',
      country: 'Italy',
      category: 'culture',
      rating: 4.8,
      reviewCount: 420,
      images: ['https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80'],
      description: 'A vibrant cosmopolitan city with nearly 3,000 years of globally influential art, architecture and culture.',
      priceRange: '$$$',
      location: { latitude: 41.9028, longitude: 12.4964 },
      bestTimeToVisit: ['Apr-Jun', 'Sep-Oct'],
      attractions: [
        { id: 'r1', name: 'Colosseum', rating: 4.9, type: 'landmark', description: 'Ancient gladiatorial arena.' },
        { id: 'r2', name: 'Trevi Fountain', rating: 4.8, type: 'landmark', description: 'Baroque travertine fountain.' }
      ]
    },
    'maui': {
      id: 'maui',
      name: 'Maui',
      country: 'USA',
      category: 'beach',
      rating: 4.8,
      reviewCount: 215,
      images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'],
      description: 'Stunning volcanic beaches, scenic highway tours, and rich Hawaiian cultural experiences.',
      priceRange: '$$$$',
      location: { latitude: 20.7984, longitude: -156.3319 },
      bestTimeToVisit: ['Apr-May', 'Sep-Nov'],
      attractions: [
        { id: 'm1', name: 'Haleakalā National Park', rating: 4.8, type: 'nature', description: 'Massive dormant volcano.' },
        { id: 'm2', name: 'Road to Hana', rating: 4.7, type: 'nature', description: 'Scenic rainforest drive.' }
      ]
    },
    'kyoto': {
      id: 'kyoto',
      name: 'Kyoto',
      country: 'Japan',
      category: 'culture',
      rating: 4.9,
      reviewCount: 310,
      images: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'],
      description: 'Famed for its thousands of classical Buddhist temples, gardens, imperial palaces, Shinto shrines and traditional wooden houses.',
      priceRange: '$$',
      location: { latitude: 35.0116, longitude: 135.7681 },
      bestTimeToVisit: ['Spring (Mar-May)', 'Autumn (Oct-Nov)'],
      attractions: [
        { id: 'k1', name: 'Fushimi Inari-taisha', rating: 4.9, type: 'landmark', description: 'Path of a thousand red Torii gates.' },
        { id: 'k2', name: 'Kinkaku-ji', rating: 4.8, type: 'landmark', description: 'Golden Pavilion zen temple.' }
      ]
    },
    'reykjavik': {
      id: 'reykjavik',
      name: 'Reykjavik',
      country: 'Iceland',
      category: 'adventure',
      rating: 4.8,
      reviewCount: 154,
      images: ['https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80'],
      description: 'The gateway to Iceland’s volcanic wonders, geothermal spas, geysers, and the dazzling Northern Lights.',
      priceRange: '$$$',
      location: { latitude: 64.1466, longitude: -21.9426 },
      bestTimeToVisit: ['Summer (Jun-Aug)', 'Winter (Dec-Feb for Auroras)'],
      attractions: [
        { id: 're1', name: 'Blue Lagoon', rating: 4.7, type: 'landmark', description: 'Geothermal volcanic spa.' },
        { id: 're2', name: 'Hallgrímskirkja', rating: 4.6, type: 'landmark', description: 'Unique volcanic-shaped cathedral.' }
      ]
    },
    'amalfi': {
      id: 'amalfi',
      name: 'Amalfi Coast',
      country: 'Italy',
      category: 'luxury',
      rating: 4.9,
      reviewCount: 280,
      images: ['https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'],
      description: 'A spectacular stretch of coastline featuring pastel-colored villages cliff-clinging above the azure Mediterranean Sea.',
      priceRange: '$$$$',
      location: { latitude: 40.6331, longitude: 14.6027 },
      bestTimeToVisit: ['May', 'September', 'October'],
      attractions: [
        { id: 'am1', name: 'Positano Village', rating: 4.9, type: 'landmark', description: 'Vertical cliff village.' },
        { id: 'am2', name: 'Ravello Gardens', rating: 4.8, type: 'nature', description: 'Clifftop villas with ocean panoramas.' }
      ]
    },
    'sydney': {
      id: 'sydney',
      name: 'Sydney',
      country: 'Australia',
      category: 'nature',
      rating: 4.7,
      reviewCount: 395,
      images: ['https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80'],
      description: 'Australia’s largest city, best known for its Sydney Opera House, beautiful harbor beaches, and national parks.',
      priceRange: '$$$',
      location: { latitude: -33.8688, longitude: 151.2093 },
      bestTimeToVisit: ['Spring (Sep-Nov)', 'Autumn (Mar-May)'],
      attractions: [
        { id: 'sy1', name: 'Sydney Opera House', rating: 4.8, type: 'landmark', description: 'Iconic sail-like performing arts center.' },
        { id: 'sy2', name: 'Bondi Beach', rating: 4.6, type: 'beach', description: 'Famed sweeping white sand beach.' }
      ]
    },
  },
  trips: {},
  bookings: {},
  expenses: {},
};

// Mock Authentication State
let currentMockUser: any = {
  uid: 'demo-user-123',
  email: 'explorer@kopitrip.com',
  displayName: 'Travel Enthusiast',
};

const authListeners: Set<(user: any) => void> = new Set();

// In-Memory database setup with demo user
db.users['demo-user-123'] = {
  id: 'demo-user-123',
  email: 'explorer@kopitrip.com',
  name: 'Travel Enthusiast',
  preferredCurrency: 'USD',
  preferredLanguage: 'en',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Simulated Auth API
export const mockAuth = () => {
  const authInstance = {
    currentUser: currentMockUser ? {
      uid: currentMockUser.uid,
      email: currentMockUser.email,
      displayName: currentMockUser.displayName,
    } : null,
    
    createUserWithEmailAndPassword: async (email: string, _: string) => {
      const uid = 'user_' + Math.random().toString(36).substr(2, 9);
      const newUser = { uid, email, displayName: email.split('@')[0] };
      currentMockUser = newUser;
      
      // Auto-create user profile in mock firestore
      db.users[uid] = {
        id: uid,
        email,
        name: newUser.displayName,
        preferredCurrency: 'USD',
        preferredLanguage: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      authListeners.forEach(listener => listener(newUser));
      return { user: newUser };
    },
    
    signInWithEmailAndPassword: async (email: string, _: string) => {
      // Look up existing user, or create one for convenience
      let existingUser = Object.values(db.users).find((u: any) => u.email === email) as any;
      if (!existingUser) {
        existingUser = {
          id: 'user_' + Math.random().toString(36).substr(2, 9),
          email,
          name: email.split('@')[0],
          preferredCurrency: 'USD',
          preferredLanguage: 'en',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        db.users[existingUser.id] = existingUser;
      }
      
      const user = { uid: existingUser.id, email: existingUser.email, displayName: existingUser.name };
      currentMockUser = user;
      authListeners.forEach(listener => listener(user));
      return { user };
    },
    
    signOut: async () => {
      currentMockUser = null;
      authListeners.forEach(listener => listener(null));
    },
    
    sendPasswordResetEmail: async (_: string) => {
      // Simulate successful mail sending
      return;
    },
    
    onAuthStateChanged: (callback: (user: any) => void) => {
      authListeners.add(callback);
      // Trigger initial call
      callback(currentMockUser ? {
        uid: currentMockUser.uid,
        email: currentMockUser.email,
        displayName: currentMockUser.displayName,
      } : null);
      
      return () => {
        authListeners.delete(callback);
      };
    }
  };
  return authInstance;
};

// Simulated Firestore Query builder helper
class MockQuery {
  private collectionPath: string;
  private filters: Array<{ field: string; op: string; value: any }> = [];
  private orderField?: string;
  private orderDirection?: 'asc' | 'desc';
  private limitCount?: number;

  constructor(collectionPath: string) {
    this.collectionPath = collectionPath;
  }

  where(field: string, op: string, value: any): MockQuery {
    this.filters.push({ field, op, value });
    return this;
  }

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): MockQuery {
    this.orderField = field;
    this.orderDirection = direction;
    return this;
  }

  limit(count: number): MockQuery {
    this.limitCount = count;
    return this;
  }

  async get() {
    const rawData = db[this.collectionPath] || {};
    let docs = Object.keys(rawData).map(id => ({
      id,
      data: () => rawData[id],
    }));

    // Apply where filters
    for (const filter of this.filters) {
      docs = docs.filter(doc => {
        const val = doc.data()[filter.field];
        if (filter.op === '==') return val === filter.value;
        if (filter.op === '>=') return val >= filter.value;
        if (filter.op === '<=') return val <= filter.value;
        if (filter.op === 'in') return Array.isArray(filter.value) && filter.value.includes(val);
        return true;
      });
    }

    // Apply sorting
    if (this.orderField) {
      docs.sort((a, b) => {
        const valA = a.data()[this.orderField!];
        const valB = b.data()[this.orderField!];
        if (valA < valB) return this.orderDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.orderDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Apply limit
    if (this.limitCount !== undefined) {
      docs = docs.slice(0, this.limitCount);
    }

    return { docs };
  }
}

// Simulated Firestore API
export const mockFirestore = () => {
  const firestoreInstance = {
    collection: (path: string) => {
      return {
        doc: (id?: string) => {
          const docId = id || 'doc_' + Math.random().toString(36).substr(2, 9);
          return {
            id: docId,
            set: async (data: any) => {
              if (!db[path]) db[path] = {};
              db[path][docId] = { ...data, id: docId };
              return;
            },
            get: async () => {
              const docData = db[path]?.[docId];
              return {
                id: docId,
                exists: !!docData,
                data: () => docData || null,
              };
            },
            update: async (data: any) => {
              if (!db[path]) db[path] = {};
              db[path][docId] = { ...db[path][docId], ...data };
              return;
            },
            delete: async () => {
              if (db[path]) {
                delete db[path][docId];
              }
              return;
            }
          };
        },
        add: async (data: any) => {
          const docId = 'doc_' + Math.random().toString(36).substr(2, 9);
          if (!db[path]) db[path] = {};
          db[path][docId] = { ...data, id: docId };
          return { id: docId };
        },
        where: (field: string, op: string, value: any) => {
          return new MockQuery(path).where(field, op, value);
        },
        orderBy: (field: string, direction?: 'asc' | 'desc') => {
          return new MockQuery(path).orderBy(field, direction);
        },
        limit: (count: number) => {
          return new MockQuery(path).limit(count);
        },
        get: async () => {
          return new MockQuery(path).get();
        }
      };
    }
  };
  return firestoreInstance;
};

// Export unified exports: automatically uses native modules if present, fallbacks to mock otherwise.
const authExport = nativeAuth ? nativeAuth : mockAuth;
const firestoreExport = nativeFirestore ? nativeFirestore : mockFirestore;

export default firestoreExport;
export { authExport as auth, firestoreExport as firestore };
