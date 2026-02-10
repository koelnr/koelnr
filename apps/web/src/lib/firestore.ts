import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  UserProfile,
  Order,
  Subscription,
  VehicleType,
  OrderItem,
  OrderType,
  OrderStatus,
} from "@/types";

// --- User Profile ---

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

// --- Subscriptions ---

export async function getActiveSubscription(
  userId: string,
): Promise<Subscription | null> {
  const q = query(
    collection(db, "subscriptions"),
    where("userId", "==", userId),
    where("status", "==", "active"),
    orderBy("startDate", "desc"),
    limit(1),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as Subscription;
}

export async function createSubscription(data: {
  userId: string;
  planName: string;
  vehicleType: VehicleType;
  monthlyPrice: number;
  paymentId?: string;
}): Promise<string> {
  const now = Timestamp.now();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);

  const docRef = await addDoc(collection(db, "subscriptions"), {
    userId: data.userId,
    planName: data.planName,
    vehicleType: data.vehicleType,
    monthlyPrice: data.monthlyPrice,
    status: "active",
    startDate: now,
    currentPeriodEnd: Timestamp.fromDate(endDate),
    paymentId: data.paymentId ?? null,
  });
  return docRef.id;
}

// --- Orders ---

export async function getUserOrders(
  userId: string,
  count = 20,
): Promise<Order[]> {
  const q = query(
    collection(db, "orders"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(count),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);
}

export async function createOrder(data: {
  userId: string;
  type: OrderType;
  items: OrderItem[];
  totalAmount: number;
  scheduledSlot?: string;
  scheduledDate?: string;
  paymentId?: string;
}): Promise<string> {
  const docRef = await addDoc(collection(db, "orders"), {
    userId: data.userId,
    type: data.type,
    items: data.items,
    totalAmount: data.totalAmount,
    currency: "INR",
    status: "created" as OrderStatus,
    paymentId: data.paymentId ?? null,
    scheduledSlot: data.scheduledSlot ?? null,
    scheduledDate: data.scheduledDate ?? null,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  paymentId?: string,
): Promise<void> {
  const updates: Record<string, unknown> = { status };
  if (paymentId) updates.paymentId = paymentId;
  await updateDoc(doc(db, "orders", orderId), updates);
}
