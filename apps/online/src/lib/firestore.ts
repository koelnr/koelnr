import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type VehicleType = "hatchSedan" | "suvMuv";

export interface UserProfile {
  uid: string;
  vehicleType: VehicleType;
  phone: string;
  address: string;
  createdAt: any;
  updatedAt: any;
}

export async function getUserProfile(
  uid: string,
): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return { uid: snap.id, ...snap.data() } as UserProfile;
}

export async function createUserProfile(
  uid: string,
  data: { vehicleType: VehicleType; phone?: string; address?: string },
): Promise<void> {
  await setDoc(doc(db, "users", uid), {
    vehicleType: data.vehicleType,
    phone: data.phone ?? "",
    address: data.address ?? "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<UserProfile, "vehicleType" | "phone" | "address">>,
): Promise<void> {
  await updateDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Order Management
export interface Order {
  id: string;
  userId: string;
  type: "subscription" | "on_demand" | "addon";
  items: Array<{ name: string; price: number; quantity: number }>;
  totalAmount: number;
  currency: "INR";
  status: "created" | "paid" | "failed" | "refunded";
  paymentGateway: "payu";
  payuTxnId?: string;
  payuPaymentId?: string;
  payuStatus?: string;
  paymentMode?: string;
  createdAt: any;
  updatedAt?: any;
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const { query, collection, where, orderBy, getDocs } = await import("firebase/firestore");
  const ordersQuery = query(
    collection(db, "orders"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(ordersQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const snap = await getDoc(doc(db, "orders", orderId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Order;
}

// Subscription Management
export interface Subscription {
  id: string;
  userId: string;
  planName: string;
  vehicleType: VehicleType;
  monthlyPrice: number;
  status: "active" | "cancelled" | "expired";
  paymentId?: string;
  orderId: string;
  startDate: any;
  currentPeriodEnd: any;
  createdAt: any;
}

export async function getActiveSubscription(userId: string): Promise<Subscription | null> {
  const { query, collection, where, limit, getDocs } = await import("firebase/firestore");
  const subsQuery = query(
    collection(db, "subscriptions"),
    where("userId", "==", userId),
    where("status", "==", "active"),
    limit(1)
  );
  const snapshot = await getDocs(subsQuery);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as Subscription;
}
