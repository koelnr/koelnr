"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { siteConfig } from "@/config/site";
import { SubscriptionCard } from "@/components/dashboard/subscription-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";
import { getActiveSubscription } from "@/lib/firestore";
import type { Subscription } from "@/lib/firestore";

export default function SubscriptionsPage() {
  const user = useAuthStore((s) => s.user);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    getActiveSubscription(user.uid)
      .then(setSubscription)
      .catch((err) => {
        console.error("Failed to load subscription:", err);
        toast.error("Failed to load subscription data");
      })
      .finally(() => setLoading(false));
  }, [user]);

  // Format date for display
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <div className="space-y-8">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Subscription</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Your active subscription plan
              </p>
            </div>
            {loading ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <Badge variant={subscription ? "default" : "secondary"}>
                <Calendar className="mr-1 size-3" />
                {subscription ? "Active" : "No Active Plan"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-56" />
            </div>
          ) : subscription ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="text-lg font-semibold">{subscription.planName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle Type</p>
                  <p className="text-lg font-semibold">
                    {subscription.vehicleType === "hatchSedan" ? "Hatch / Sedan" : "SUV / MUV"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Price</p>
                  <p className="text-lg font-semibold">₹{subscription.monthlyPrice}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Renewal Date</p>
                  <p className="text-lg font-semibold">{formatDate(subscription.currentPeriodEnd)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed bg-muted/30 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                You don&apos;t have an active subscription yet. Choose a plan
                below to get started with daily doorstep car care.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Available Plans</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose the plan that best fits your needs
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {siteConfig.subscriptions.map((plan) => (
            <SubscriptionCard key={plan.name} plan={plan} />
          ))}
        </div>
      </div>

      {/* Add-ons */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriber Add-ons</CardTitle>
          <p className="text-sm text-muted-foreground">
            Available with any active subscription
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {siteConfig.subscriberAddons.map((addon) => (
              <div
                key={addon.name}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <span className="font-medium">{addon.name}</span>
                <div className="text-right text-sm">
                  <div className="font-semibold">{addon.hatchSedan}</div>
                  <div className="text-muted-foreground">{addon.suvMuv}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
