"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { History, Package, ArrowRight } from "lucide-react";
import { getOrdersByUserId } from "@/lib/firestore";
import type { Order } from "@/lib/firestore";

export default function OrdersPage() {
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    getOrdersByUserId(user.uid)
      .then(setOrders)
      .catch((err) => {
        console.error("Failed to load orders:", err);
        toast.error("Failed to load orders");
      })
      .finally(() => setLoading(false));
  }, [user]);

  // Format date for display
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
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

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Order History</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          View all your past orders and subscriptions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="size-5" />
            All Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3 border-b pb-4 last:border-0">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ))}
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link key={order.id} href={`/dashboard/orders/${order.id}`}>
                  <Card className="hover:border-primary transition-colors cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-sm">Order #{order.id.slice(-6)}</p>
                            <Badge variant={getStatusVariant(order.status)}>
                              {order.status}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {order.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {order.items.map(item => item.name).join(", ")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </p>
                          {order.paymentMode && (
                            <p className="text-xs text-muted-foreground capitalize">
                              Payment: {order.paymentMode}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-bold">₹{order.totalAmount}</p>
                          <p className="text-xs text-muted-foreground">{order.currency}</p>
                          <ArrowRight className="size-4 mt-1 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4">
                <Package className="size-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-semibold">No orders yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your order history will appear here once you subscribe or book a service
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/subscriptions">
                  Browse Plans
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
