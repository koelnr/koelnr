import { create } from "zustand";
import type { User } from "firebase/auth";

type AuthState = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const getFirebaseAuth = async () => {
  const { auth, googleProvider } = await import("@/lib/firebase");
  return { auth, googleProvider };
};

export const useAuthStore = create<AuthState>(() => ({
  user: null,
  loading: true,

  signIn: async (email, password) => {
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    const { auth } = await getFirebaseAuth();
    await signInWithEmailAndPassword(auth, email, password);
  },

  signUp: async (email, password) => {
    const { createUserWithEmailAndPassword } = await import("firebase/auth");
    const { auth } = await getFirebaseAuth();
    await createUserWithEmailAndPassword(auth, email, password);
  },

  signInWithGoogle: async () => {
    const { signInWithPopup } = await import("firebase/auth");
    const { auth, googleProvider } = await getFirebaseAuth();
    await signInWithPopup(auth, googleProvider);
  },

  signOut: async () => {
    const { signOut } = await import("firebase/auth");
    const { auth } = await getFirebaseAuth();
    await signOut(auth);
  },
}));

if (typeof window !== "undefined") {
  import("firebase/auth").then(({ onAuthStateChanged }) => {
    getFirebaseAuth().then(({ auth }) => {
      onAuthStateChanged(auth, (user) => {
        useAuthStore.setState({ user, loading: false });
      });
    });
  });
}
