import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import * as crypto from "crypto";
import { getRazorpayKeySecret } from "./razorpay-client";

interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  orderId: string;
}

export const verifyPayment = onCall<VerifyPaymentRequest>(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be signed in");
  }

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } =
    request.data;

  // Verify signature
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", getRazorpayKeySecret())
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    throw new HttpsError("invalid-argument", "Invalid payment signature");
  }

  const db = getFirestore();

  // Update order status
  await db.collection("orders").doc(orderId).update({
    status: "paid",
    razorpayPaymentId,
  });

  // If this is a subscription order, activate the subscription
  const subsQuery = await db
    .collection("subscriptions")
    .where("razorpayOrderId", "==", razorpayOrderId)
    .where("userId", "==", request.auth.uid)
    .limit(1)
    .get();

  if (!subsQuery.empty) {
    await subsQuery.docs[0].ref.update({
      status: "active",
      razorpayPaymentId,
    });
  }

  return { success: true, orderId };
});
