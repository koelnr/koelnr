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
