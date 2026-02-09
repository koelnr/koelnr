import { create } from "zustand";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

type AuthState = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>(() => ({
  user: null,
  loading: true,

  signIn: async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  },

  signUp: async (email, password) => {
    await createUserWithEmailAndPassword(auth, email, password);
  },

  signInWithGoogle: async () => {
    await signInWithPopup(auth, googleProvider);
  },

  signOut: async () => {
    await firebaseSignOut(auth);
  },
}));

onAuthStateChanged(auth, (user) => {
  useAuthStore.setState({ user, loading: false });
});
