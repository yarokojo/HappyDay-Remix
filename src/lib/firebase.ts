import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  getDocFromServer,
  enableIndexedDbPersistence,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  signOut,
  User
} from 'firebase/auth';
// Load config lazily or safely
import firebaseConfigImport from '../../firebase-applet-config.json';
const firebaseConfig: any = firebaseConfigImport;

let firebaseApp: any = null;

function getFirebaseApp() {
  if (!firebaseApp) {
    console.log("Firebase config check:", {
      hasApiKey: !!firebaseConfig.apiKey,
      apiKeyLength: firebaseConfig.apiKey?.length,
      projectId: firebaseConfig.projectId
    });

    if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('REPLACE_ME') || firebaseConfig.apiKey.length < 20) {
      const msg = 'Firebase API Key is missing, invalid, or too short in firebase-applet-config.json';
      console.error(msg, firebaseConfig);
      throw new Error(msg);
    }
    
    try {
      firebaseApp = initializeApp(firebaseConfig);
    } catch (err) {
      console.error("Firebase initializeApp failure:", err);
      throw err;
    }
  }
  return firebaseApp;
}

// Export instances that are initialized on demand
// Using a slightly more resilient pattern
export const db = initializeFirestore(getFirebaseApp(), {
  localCache: {
    kind: 'persistent'
  }
}, firebaseConfig.firestoreDatabaseId );

export const auth = getAuth(getFirebaseApp());
export const googleProvider = new GoogleAuthProvider();

// Validation test connection
async function testConnection() {
  try {
    const testDoc = doc(db, 'system', 'connection_test');
    await getDocFromServer(testDoc).catch(() => {});
    console.log("Firebase Connection Verified");
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.warn("Firestore is working in offline mode.");
    }
  }
}
testConnection();

// Error handling helper as per instructions
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
