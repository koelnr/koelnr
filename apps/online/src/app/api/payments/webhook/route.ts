import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyPayUHash } from "@/lib/payu-hash";
import type { PayUResponse } from "@/lib/payu-hash";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    // Verify webhook authentication
    const authHeader = request.headers.get("authorization");
    const webhookSecret = process.env.PAYU_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("PAYU_WEBHOOK_SECRET not configured");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    if (!authHeader || authHeader !== `Bearer ${webhookSecret}`) {
      console.error("Webhook: Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse form data from PayU webhook
    const formData = await request.formData();

    const response: PayUResponse = {
      key: formData.get("key") as string,
      txnid: formData.get("txnid") as string,
      amount: formData.get("amount") as string,
      productinfo: formData.get("productinfo") as string,
      firstname: formData.get("firstname") as string,
      email: formData.get("email") as string,
      status: formData.get("status") as string,
      hash: formData.get("hash") as string,
      udf1: formData.get("udf1") as string,
      udf2: formData.get("udf2") as string,
      udf3: formData.get("udf3") as string,
      udf4: formData.get("udf4") as string,
      udf5: formData.get("udf5") as string,
      mihpayid: formData.get("mihpayid") as string,
      mode: formData.get("mode") as string,
    };

    // Verify hash
    if (!verifyPayUHash(response)) {
      console.error("Webhook: Hash verification failed for txnid:", response.txnid);
      return NextResponse.json({ error: "Invalid hash" }, { status: 400 });
    }

    // Extract order details from UDF fields
    const orderId = response.udf1 || "";
    const orderType = response.udf2 || "";
    const planName = response.udf3 || "";
    const vehicleType = response.udf4 || "";
    const userId = response.udf5 || "";

    // Update order in Firestore using transaction (idempotent)
    await adminDb.runTransaction(async (transaction) => {
      const orderRef = adminDb.collection("orders").doc(orderId);
      const orderDoc = await transaction.get(orderRef);

      if (!orderDoc.exists) {
        throw new Error("Order not found");
      }

      const currentStatus = orderDoc.data()?.status;

      // If already processed, skip
      if (currentStatus === "paid" || currentStatus === "failed") {
        console.log("Webhook: Order already processed:", orderId, currentStatus);
        return;
      }

      // Determine new status
      const newStatus = response.status === "success" ? "paid" : "failed";

      // Update order
      transaction.update(orderRef, {
        status: newStatus,
        payuPaymentId: response.mihpayid,
        payuStatus: response.status,
        paymentMode: response.mode,
        updatedAt: FieldValue.serverTimestamp(),
      });

      // Create subscription if payment succeeded and this is a subscription order
      if (
        newStatus === "paid" &&
        orderType === "subscription" &&
        planName &&
        vehicleType
      ) {
        const subRef = adminDb.collection("subscriptions").doc();
        const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
        const periodEnd = Timestamp.fromMillis(Date.now() + oneMonthInMs);

        transaction.set(subRef, {
          id: subRef.id,
          userId,
          planName,
          vehicleType,
          monthlyPrice: parseFloat(response.amount),
          status: "active",
          paymentId: response.mihpayid,
          orderId,
          startDate: FieldValue.serverTimestamp(),
          currentPeriodEnd: periodEnd,
          createdAt: FieldValue.serverTimestamp(),
        });
      }
    });

    // PayU expects 200 OK
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
