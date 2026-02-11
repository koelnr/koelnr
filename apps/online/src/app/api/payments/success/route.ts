import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyPayUHash } from "@/lib/payu-hash";
import type { PayUResponse } from "@/lib/payu-hash";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    // Parse form data from PayU
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
      console.error("Hash verification failed for txnid:", response.txnid);
      return NextResponse.redirect(
        new URL("/dashboard/payments/failure?error=invalid_hash", request.url),
      );
    }

    // Extract order details from UDF fields
    const orderId = response.udf1 || "";
    const orderType = response.udf2 || "";
    const planName = response.udf3 || "";
    const vehicleType = response.udf4 || "";
    const userId = response.udf5 || "";

    // Update order in Firestore using transaction
    await adminDb.runTransaction(async (transaction) => {
      const orderRef = adminDb.collection("orders").doc(orderId);
      const orderDoc = await transaction.get(orderRef);

      // Check if order exists
      if (!orderDoc.exists) {
        throw new Error("Order not found");
      }

      // Check if already processed (idempotency)
      if (orderDoc.data()?.status === "paid") {
        console.log("Order already processed:", orderId);
        return;
      }

      // Update order status
      transaction.update(orderRef, {
        status: "paid",
        payuPaymentId: response.mihpayid,
        payuStatus: response.status,
        paymentMode: response.mode,
        updatedAt: FieldValue.serverTimestamp(),
      });

      // Create subscription if this is a subscription order
      if (orderType === "subscription" && planName && vehicleType) {
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

    // Redirect to success page
    return NextResponse.redirect(
      new URL(`/dashboard/payments/success?orderId=${orderId}`, request.url),
    );
  } catch (error) {
    console.error("Error processing payment success:", error);
    return NextResponse.redirect(
      new URL("/dashboard/payments/failure?error=processing_error", request.url),
    );
  }
}
