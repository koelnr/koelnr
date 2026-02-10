import { siteConfig } from "@/config/site";
import { SubscriptionCard } from "@/components/dashboard/subscription-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

export default function SubscriptionsPage() {
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
            <Badge variant="secondary">
              <Calendar className="mr-1 size-3" />
              No Active Plan
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed bg-muted/30 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              You don&apos;t have an active subscription yet. Choose a plan
              below to get started with daily doorstep car care.
            </p>
          </div>
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
