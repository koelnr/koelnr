import * as functions from "firebase-functions/v1";
import { getFirestore } from "firebase-admin/firestore";
import * as crypto from "crypto";
import { getRazorpayKeySecret } from "./razorpay-client";

export const razorpayWebhook = functions
  .region("asia-south1")
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method not allowed");
      return;
    }

    const webhookSecret = getRazorpayKeySecret();
    const signature = req.headers["x-razorpay-signature"] as string;

    if (!signature) {
      res.status(400).send("Missing signature");
      return;
    }

    const body = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      res.status(400).send("Invalid signature");
      return;
    }

    const event = req.body;
    const db = getFirestore();

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;

      // Update order
      const ordersQuery = await db
        .collection("orders")
        .where("razorpayOrderId", "==", razorpayOrderId)
        .limit(1)
        .get();

      if (!ordersQuery.empty) {
        await ordersQuery.docs[0].ref.update({
          status: "paid",
          razorpayPaymentId: payment.id,
        });
      }

      // Update subscription if applicable
      const subsQuery = await db
        .collection("subscriptions")
        .where("razorpayOrderId", "==", razorpayOrderId)
        .limit(1)
        .get();

      if (!subsQuery.empty) {
        await subsQuery.docs[0].ref.update({
          status: "active",
          razorpayPaymentId: payment.id,
        });
      }
    }

    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;

      const ordersQuery = await db
        .collection("orders")
        .where("razorpayOrderId", "==", razorpayOrderId)
        .limit(1)
        .get();

      if (!ordersQuery.empty) {
        await ordersQuery.docs[0].ref.update({ status: "failed" });
      }
    }

    res.status(200).json({ status: "ok" });
  });
