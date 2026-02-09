import { create } from "zustand";
import type { Subscription } from "@/types";
import { getActiveSubscription } from "@/lib/firestore";

type SubscriptionState = {
  activeSubscription: Subscription | null;
  loading: boolean;

  fetchSubscription: (userId: string) => Promise<void>;
  setActiveSubscription: (sub: Subscription | null) => void;
  reset: () => void;
};

export const useSubscriptionStore = create<SubscriptionState>()((set) => ({
  activeSubscription: null,
  loading: false,

  fetchSubscription: async (userId) => {
    set({ loading: true });
    try {
      const sub = await getActiveSubscription(userId);
      set({ activeSubscription: sub, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  setActiveSubscription: (sub) => set({ activeSubscription: sub }),

  reset: () => set({ activeSubscription: null, loading: false }),
}));
