import type { Timestamp } from "firebase/firestore";

export type OrderType = "subscription" | "on_demand" | "addon";
export type OrderStatus = "created" | "paid" | "failed" | "scheduled" | "completed" | "cancelled";
export type SubscriptionStatus = "active" | "expired" | "cancelled";
export type VehicleType = "hatchSedan" | "suvMuv";

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
  currency: "INR";
  status: OrderStatus;
  paymentGateway: "payu";
  payuTxnId: string;
  payuPaymentId?: string;
  payuStatus?: string;
  paymentMode?: string;
  scheduledSlot?: string;
  scheduledDate?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface Subscription {
  id: string;
  userId: string;
  planName: string;
  vehicleType: VehicleType;
  monthlyPrice: number;
  status: SubscriptionStatus;
  paymentId: string;
  orderId: string;
  startDate: Timestamp;
  currentPeriodEnd: Timestamp;
  createdAt: Timestamp;
}

export interface CreateOrderData {
  userId: string;
  type: OrderType;
  items: OrderItem[];
  planName?: string;
  vehicleType?: VehicleType;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}
