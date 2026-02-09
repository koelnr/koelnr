import type { Subscription } from "@/types";
import { formatPrice } from "@/lib/pricing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CreditCard } from "lucide-react";

export function ActiveSubscriptionCard({
  subscription,
}: {
  subscription: Subscription;
}) {
  const renewalDate = subscription.currentPeriodEnd?.toDate?.();

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{subscription.planName}</CardTitle>
            <CardDescription>
              {subscription.vehicleType === "hatchSedan"
                ? "Hatch / Sedan"
                : "SUV / MUV"}
            </CardDescription>
          </div>
          <Badge variant="default">Active</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <CreditCard className="size-4" />
          <span>{formatPrice(subscription.monthlyPrice)}/month</span>
        </div>
        {renewalDate && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="size-4" />
            <span>
              Renews{" "}
              {renewalDate.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
