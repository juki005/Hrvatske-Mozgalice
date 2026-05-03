import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  User as FirebaseUser 
} from 'firebase/auth';
import { auth } from '../firebase';

export type UserRole = 'user' | 'admin';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  isAdmin: boolean;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = ['imladinovich@gmail.com'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // 1. Hard Clean of legacy mock data (only runs once on mount)
    const cleanLegacyData = () => {
      const keysToRemove = ['mozgalice_session', 'user', 'auth_user'];
      keysToRemove.forEach(key => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          console.log(`Removed legacy mock data: ${key}`);
        }
      });
    };
    cleanLegacyData();

    // 2. Real Firebase Auth Observer
    console.log("Setting up Auth Observer...");
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      console.log("onAuthStateChanged triggered. Firebase User:", firebaseUser);
      
      if (firebaseUser) {
        console.log("Authenticated User Email:", firebaseUser.email);
        const isAdminUser = firebaseUser.email === 'imladinovich@gmail.com';
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Igrač',
          photoURL: firebaseUser.photoURL || undefined,
          role: isAdminUser ? 'admin' : 'user',
          isAdmin: isAdminUser
        });
      } else {
        console.log("User is guest (null)");
        setUser(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Auth Observer Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting Login with Email:", email);
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login Success");
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      console.log("Attempting Google Login...");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Google Login Result:", result.user.email);
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error('Google Sign In Error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error('Registration Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login,
      loginWithGoogle, 
      logout, 
      register,
      isAdmin,
      isAuthModalOpen,
      setIsAuthModalOpen
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
