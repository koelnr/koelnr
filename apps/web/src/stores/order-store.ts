import { create } from "zustand";
import type { Order } from "@/types";
import { getUserOrders } from "@/lib/firestore";

type OrderState = {
  orders: Order[];
  loading: boolean;

  fetchOrders: (userId: string) => Promise<void>;
  addOrder: (order: Order) => void;
  reset: () => void;
};

export const useOrderStore = create<OrderState>()((set) => ({
  orders: [],
  loading: false,

  fetchOrders: async (userId) => {
    set({ loading: true });
    const orders = await getUserOrders(userId);
    set({ orders, loading: false });
  },

  addOrder: (order) =>
    set((state) => ({ orders: [order, ...state.orders] })),

  reset: () => set({ orders: [], loading: false }),
}));
