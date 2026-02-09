import * as functions from "firebase-functions/v1";
import { getFirestore } from "firebase-admin/firestore";
import * as crypto from "crypto";
import { getRazorpayKeySecret } from "./razorpay-client";

interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  orderId: string;
}

export const verifyPayment = functions
  .region("asia-south1")
  .https.onCall(async (data: VerifyPaymentRequest, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be signed in",
      );
    }

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } =
      data;

    // Verify signature
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", getRazorpayKeySecret())
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid payment signature",
      );
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
      .where("userId", "==", context.auth.uid)
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
