import type { Timestamp } from "firebase/firestore";

export type VehicleType = "hatchSedan" | "suvMuv";

export type OrderStatus =
  | "created"
  | "payment_pending"
  | "paid"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "failed";

export type SubscriptionStatus = "active" | "expired" | "cancelled" | "pending";

export type OrderType = "subscription" | "on_demand" | "addon";

export interface UserProfile {
  uid: string;
  vehicleType: VehicleType;
  phone: string;
  address: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  type: OrderType;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  paymentId?: string;
  scheduledSlot?: string;
  scheduledDate?: string;
  createdAt: Timestamp;
}

export interface Subscription {
  id: string;
  userId: string;
  planName: string;
  vehicleType: VehicleType;
  monthlyPrice: number;
  status: SubscriptionStatus;
  startDate: Timestamp;
  currentPeriodEnd: Timestamp;
  paymentId?: string;
}
