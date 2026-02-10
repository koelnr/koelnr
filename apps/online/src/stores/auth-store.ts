import { create } from "zustand";
import type { User } from "firebase/auth";
import { getUserProfile, createUserProfile } from "@/lib/firestore";

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
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // Initialize user profile in Firestore for new users
    const existingProfile = await getUserProfile(userCredential.user.uid);
    if (!existingProfile) {
      await createUserProfile(userCredential.user.uid, {
        vehicleType: "hatchSedan",
      });
    }
  },

  signInWithGoogle: async () => {
    const { signInWithPopup } = await import("firebase/auth");
    const { auth, googleProvider } = await getFirebaseAuth();
    const userCredential = await signInWithPopup(auth, googleProvider);

    // Initialize user profile in Firestore if it doesn't exist
    const existingProfile = await getUserProfile(userCredential.user.uid);
    if (!existingProfile) {
      await createUserProfile(userCredential.user.uid, {
        vehicleType: "hatchSedan",
      });
    }
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
