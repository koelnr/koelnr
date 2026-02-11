"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Calendar,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { getActiveSubscription, getOrdersByUserId } from "@/lib/firestore";
import type { Subscription, Order } from "@/lib/firestore";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data
  useEffect(() => {
    if (!user) return;

    Promise.all([
      getActiveSubscription(user.uid),
      getOrdersByUserId(user.uid),
    ])
      .then(([sub, ordersData]) => {
        setSubscription(sub);
        setOrders(ordersData);
      })
      .catch((err) => {
        console.error("Failed to load dashboard data:", err);
        toast.error("Failed to load dashboard data");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const paidOrdersCount = orders.filter(o => o.status === "paid").length;
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-2xl font-semibold">
          Welcome back, {user?.displayName || user?.email?.split("@")[0]}!
        </h2>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s what&apos;s happening with your account today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscription
            </CardTitle>
            <Calendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : subscription ? (
              <>
                <div className="text-2xl font-bold">{subscription.planName}</div>
                <p className="text-xs text-muted-foreground">
                  {subscription.vehicleType === "hatchSedan" ? "Hatch/Sedan" : "SUV/MUV"}
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">None</div>
                <p className="text-xs text-muted-foreground">
                  Subscribe for daily car care
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Services
            </CardTitle>
            <ShoppingBag className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold">{paidOrdersCount}</div>
                <p className="text-xs text-muted-foreground">
                  Total orders placed
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rewards Points</CardTitle>
            <Sparkles className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Earn points with every service
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Get Started Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subscribe for Daily Care</CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose from our Smart, Pro, or Elite subscription plans
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 text-primary" />
                <span>Save up to 60% vs on-demand pricing</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 text-primary" />
                <span>Priority scheduling and crew assignment</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 text-primary" />
                <span>Free pressure wash upgrades included</span>
              </li>
            </ul>
            <Button asChild className="w-full">
              <Link href="/dashboard/subscriptions">
                View Plans
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Book On-Demand Service</CardTitle>
            <p className="text-sm text-muted-foreground">
              Need a one-time wash? Book any service right now
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 text-primary" />
                <span>Basic wash, pressure wash, interior cleaning</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 text-primary" />
                <span>Same-day or scheduled appointments</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 text-primary" />
                <span>Professional 2-person crew at your doorstep</span>
              </li>
            </ul>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/services">
                Browse Services
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your latest orders and services
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium">{order.items[0]?.name || "Order"}</p>
                    <p className="text-sm text-muted-foreground">
                      ₹{order.totalAmount} · {order.type}
                    </p>
                  </div>
                  <Badge variant={order.status === "paid" ? "default" : order.status === "failed" ? "destructive" : "secondary"}>
                    {order.status}
                  </Badge>
                </div>
              ))}
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/orders">View All Orders</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-muted p-4">
                <ShoppingBag className="size-6 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm font-medium">No activity yet</p>
              <p className="text-sm text-muted-foreground">
                Subscribe to a plan or book a service to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
