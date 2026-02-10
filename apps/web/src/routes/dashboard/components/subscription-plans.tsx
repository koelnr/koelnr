import { siteConfig } from "@/config/site";
import { useUserProfileStore } from "@/stores/user-profile-store";
import { useSubscriptionStore } from "@/stores/subscription-store";
import { useAuthStore } from "@/stores/auth-store";
import { parsePrice, formatPrice } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { CheckoutDialog } from "./checkout-dialog";

export function SubscriptionPlans() {
  const vehicleType = useUserProfileStore((s) => s.vehicleType);
  const activeSub = useSubscriptionStore((s) => s.activeSubscription);
  const user = useAuthStore((s) => s.user);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {siteConfig.subscriptions.map((plan) => {
          const pricing = plan[vehicleType];
          const monthlyPrice = parsePrice(pricing.monthly);
          const isCurrentPlan =
            activeSub?.planName === plan.name && activeSub.status === "active";

          return (
            <Card
              key={plan.name}
              className={cn(
                "relative flex flex-col",
                plan.highlighted && "border-primary shadow-lg",
              )}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.schedule}</CardDescription>
                <p className="mt-2 text-xs text-muted-foreground">
                  {plan.inclusions}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {plan.washDays}
                </p>
              </CardHeader>
              <CardContent className="flex-1 space-y-2">
                <div className="rounded-lg border border-border/50 p-4 text-center">
                  <div className="text-3xl font-bold">
                    {formatPrice(monthlyPrice)}
                  </div>
                  <div className="text-sm text-muted-foreground">/month</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {pricing.perWash}/wash
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {isCurrentPlan ? (
                  <Button className="w-full" variant="outline" disabled>
                    <CheckCircle className="size-4" />
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                    onClick={() => setSelectedPlan(plan.name)}
                  >
                    {activeSub ? "Switch Plan" : "Subscribe"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {selectedPlan && user && (
        <CheckoutDialog
          open={!!selectedPlan}
          onOpenChange={(open) => {
            if (!open) setSelectedPlan(null);
          }}
          type="subscription"
          planName={selectedPlan}
          userId={user.uid}
        />
      )}
    </>
  );
}
