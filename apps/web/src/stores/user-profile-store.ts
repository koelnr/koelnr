import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile, VehicleType } from "@/types";
import {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
} from "@/lib/firestore";

type UserProfileState = {
  profile: UserProfile | null;
  vehicleType: VehicleType;
  loading: boolean;

  setVehicleType: (type: VehicleType) => void;
  fetchProfile: (uid: string) => Promise<void>;
  saveProfile: (
    uid: string,
    data: { vehicleType: VehicleType; phone?: string; address?: string },
  ) => Promise<void>;
  updateProfile: (
    uid: string,
    data: Partial<Pick<UserProfile, "vehicleType" | "phone" | "address">>,
  ) => Promise<void>;
  reset: () => void;
};

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      vehicleType: "hatchSedan",
      loading: false,

      setVehicleType: (vehicleType) => set({ vehicleType }),

      fetchProfile: async (uid) => {
        set({ loading: true });
        const profile = await getUserProfile(uid);
        if (profile) {
          set({ profile, vehicleType: profile.vehicleType, loading: false });
        } else {
          set({ loading: false });
        }
      },

      saveProfile: async (uid, data) => {
        set({ loading: true });
        await createUserProfile(uid, data);
        const profile = await getUserProfile(uid);
        set({ profile, vehicleType: data.vehicleType, loading: false });
      },

      updateProfile: async (uid, data) => {
        set({ loading: true });
        await updateUserProfile(uid, data);
        if (data.vehicleType) {
          set({ vehicleType: data.vehicleType });
        }
        const profile = await getUserProfile(uid);
        set({ profile, loading: false });
      },

      reset: () =>
        set({ profile: null, vehicleType: get().vehicleType, loading: false }),
    }),
    {
      name: "koelnr-user-profile",
      partialize: (state) => ({ vehicleType: state.vehicleType }),
    },
  ),
);
