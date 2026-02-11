"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { XCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/auth-store";
import { getOrderById, getUserProfile } from "@/lib/firestore";
import { createPaymentOrder } from "@/app/actions";
import { redirectToPayU } from "@/lib/payu-redirect";
import type { Order } from "@/lib/firestore";

export default function PaymentFailurePage() {
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const error = searchParams.get("error") || "Payment failed. Please try again.";
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(!!orderId);
  const [retrying, setRetrying] = useState(false);

  // Load failed order details
  useEffect(() => {
    if (!orderId) return;

    getOrderById(orderId)
      .then((data) => {
        if (data && data.status === "failed") {
          setOrder(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load order:", err);
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleRetryPayment = async () => {
    if (!user || !order) return;

    setRetrying(true);

    try {
      // Get user profile for phone
      const profile = await getUserProfile(user.uid);

      if (!profile?.phone || profile.phone.length < 10) {
        toast.error("Please add your phone number in your profile");
        return;
      }

      // Create new order with same details
      const result = await createPaymentOrder({
        userId: user.uid,
        type: order.type,
        items: order.items,
        planName: order.type === "subscription" ? order.items[0]?.name.split(" - ")[0] : undefined,
        vehicleType: order.type === "subscription"
          ? (order.items[0]?.name.includes("SUV") ? "suvMuv" : "hatchSedan")
          : undefined,
        customerInfo: {
          name: user.displayName || user.email?.split("@")[0] || "Customer",
          email: user.email || "",
          phone: profile.phone,
        },
      });

      if (result.success && result.payuParams && result.payuUrl) {
        redirectToPayU(result.payuUrl, result.payuParams);
      } else {
        toast.error(result.message || "Failed to create new order");
        setRetrying(false);
      }
    } catch (error) {
      console.error("Retry payment error:", error);
      toast.error("Failed to retry payment. Please try again.");
      setRetrying(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[600px] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl">Payment Failed</CardTitle>
          <CardDescription>
            We couldn't process your payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertDescription>
              {decodeURIComponent(error)}
            </AlertDescription>
          </Alert>

          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : order ? (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
              <p className="text-sm font-medium">Failed Order Details</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Order ID: {order.id.slice(-8)}</p>
                <p>Amount: ₹{order.totalAmount}</p>
                <p>{order.items.map(item => item.name).join(", ")}</p>
              </div>
            </div>
          ) : null}

          <div className="space-y-3">
            <p className="text-center text-sm text-muted-foreground">
              Don't worry, no charges were made to your account. {order ? "You can retry the payment below." : "Please try again or contact support if the issue persists."}
            </p>

            <div className="flex flex-col gap-2">
              {order && user ? (
                <Button
                  onClick={handleRetryPayment}
                  disabled={retrying}
                  className="w-full"
                >
                  {retrying ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 size-4" />
                      Retry Payment
                    </>
                  )}
                </Button>
              ) : (
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard/subscriptions">Browse Plans</Link>
                </Button>
              )}
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
