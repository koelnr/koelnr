import * as functions from "firebase-functions/v1";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getRazorpay } from "./razorpay-client";

interface CreateOrderRequest {
  type: "subscription" | "on_demand" | "addon";
  planName?: string;
  serviceName?: string;
  items: { name: string; price: number; quantity: number }[];
  totalAmount: number;
  vehicleType: "hatchSedan" | "suvMuv";
  scheduledSlot?: string;
  scheduledDate?: string;
}

export const createOrder = functions
  .region("asia-south1")
  .https.onCall(async (data: CreateOrderRequest, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be signed in",
      );
    }

    const {
      type,
      planName,
      items,
      totalAmount,
      vehicleType,
      scheduledSlot,
      scheduledDate,
    } = data;

    if (!items || items.length === 0 || !totalAmount || totalAmount <= 0) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid order data",
      );
    }

    const razorpay = getRazorpay();
    const db = getFirestore();

    // Create Razorpay order (amount in paise)
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `order_${Date.now()}`,
      notes: {
        userId: context.auth.uid,
        type,
        planName: planName ?? "",
      },
    });

    // Store order in Firestore
    const orderRef = await db.collection("orders").add({
      userId: context.auth.uid,
      type,
      items,
      totalAmount,
      currency: "INR",
      status: "created",
      razorpayOrderId: razorpayOrder.id,
      razorpayPaymentId: null,
      scheduledSlot: scheduledSlot ?? null,
      scheduledDate: scheduledDate ?? null,
      createdAt: Timestamp.now(),
    });

    // If subscription, create pending subscription doc
    if (type === "subscription" && planName) {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      await db.collection("subscriptions").add({
        userId: context.auth.uid,
        planName,
        vehicleType,
        monthlyPrice: totalAmount,
        status: "pending",
        startDate: Timestamp.now(),
        currentPeriodEnd: Timestamp.fromDate(endDate),
        razorpayOrderId: razorpayOrder.id,
        razorpayPaymentId: null,
        orderId: orderRef.id,
      });
    }

    return {
      razorpayOrderId: razorpayOrder.id,
      orderId: orderRef.id,
      amount: totalAmount * 100,
      currency: "INR",
    };
  });
