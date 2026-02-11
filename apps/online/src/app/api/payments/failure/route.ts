import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyPayUHash } from "@/lib/payu-hash";
import type { PayUResponse } from "@/lib/payu-hash";
import { FieldValue } from "firebase-admin/firestore";

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
      error: formData.get("error") as string,
      error_Message: formData.get("error_Message") as string,
    };

    // Verify hash to prevent tampering
    if (!verifyPayUHash(response)) {
      console.error("Hash verification failed for failed payment, txnid:", response.txnid);
      return NextResponse.redirect(
        new URL("/dashboard/payments/failure?error=invalid_hash", request.url),
      );
    }

    const orderId = response.udf1;
    const errorMessage = response.error_Message || response.error || "Payment failed";

    // Update order status in Firestore
    if (orderId) {
      const orderRef = adminDb.collection("orders").doc(orderId);
      await orderRef.update({
        status: "failed",
        payuStatus: response.status,
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    // Redirect to failure page
    return NextResponse.redirect(
      new URL(
        `/dashboard/payments/failure?error=${encodeURIComponent(errorMessage)}`,
        request.url,
      ),
    );
  } catch (error) {
    console.error("Error processing payment failure:", error);
    return NextResponse.redirect(
      new URL("/dashboard/payments/failure?error=unknown_error", request.url),
    );
  }
}
