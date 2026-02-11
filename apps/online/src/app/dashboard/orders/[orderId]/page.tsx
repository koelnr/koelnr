"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Package, Calendar, CreditCard, FileText } from "lucide-react";
import { getOrderById } from "@/lib/firestore";
import type { Order } from "@/lib/firestore";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const orderId = params.orderId as string;

  useEffect(() => {
    if (!orderId) return;

    getOrderById(orderId)
      .then((data) => {
        if (!data) {
          setNotFound(true);
          return;
        }

        // Verify this order belongs to the current user
        if (user && data.userId !== user.uid) {
          toast.error("You don't have permission to view this order");
          router.push("/dashboard/orders");
          return;
        }

        setOrder(data);
      })
      .catch((err) => {
        console.error("Failed to load order:", err);
        toast.error("Failed to load order details");
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [orderId, user, router]);

  // Format date for display
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get badge variant based on status
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "failed":
        return "destructive";
      case "created":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Order Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button asChild>
              <Link href="/dashboard/orders">
                <ArrowLeft className="mr-2 size-4" />
                Back to Orders
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/orders">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">Order Details</h2>
          <p className="text-sm text-muted-foreground">Order #{order.id.slice(-8)}</p>
        </div>
        <Badge variant={getStatusVariant(order.status)} className="text-sm capitalize">
          {order.status}
        </Badge>
      </div>

      {/* Order Information Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="size-5" />
              Order Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono text-sm">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-medium capitalize">{order.type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">{formatDate(order.createdAt)}</p>
            </div>
            {order.updatedAt && (
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{formatDate(order.updatedAt)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="size-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">₹{order.totalAmount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Gateway</p>
              <p className="font-medium uppercase">{order.paymentGateway}</p>
            </div>
            {order.payuTxnId && (
              <div>
                <p className="text-sm text-muted-foreground">Transaction ID</p>
                <p className="font-mono text-sm">{order.payuTxnId}</p>
              </div>
            )}
            {order.payuPaymentId && (
              <div>
                <p className="text-sm text-muted-foreground">Payment ID</p>
                <p className="font-mono text-sm">{order.payuPaymentId}</p>
              </div>
            )}
            {order.paymentMode && (
              <div>
                <p className="text-sm text-muted-foreground">Payment Mode</p>
                <p className="font-medium capitalize">{order.paymentMode}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="size-5" />
            Order Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{item.price * item.quantity}</p>
                  <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between border-t pt-3">
              <p className="font-semibold">Total</p>
              <p className="text-xl font-bold">₹{order.totalAmount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {order.status === "paid" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" disabled>
              <FileText className="mr-2 size-4" />
              Download Invoice (Coming Soon)
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
