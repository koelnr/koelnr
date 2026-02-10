import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import type { SiteConfig } from "@/config/site";

type SubscriptionPlan = SiteConfig["subscriptions"][number];

export function SubscriptionCard({ plan }: { plan: SubscriptionPlan }) {
  return (
    <Card className={plan.highlighted ? "border-primary shadow-md" : ""}>
      {plan.highlighted && (
        <div className="flex justify-center pt-4">
          <Badge className="bg-primary">Most Popular</Badge>
        </div>
      )}
      <CardHeader className={plan.highlighted ? "pb-4" : ""}>
        <h3 className="text-2xl font-bold">{plan.name}</h3>
        <p className="text-sm text-muted-foreground">{plan.schedule}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-3xl font-bold">{plan.hatchSedan.monthly}</div>
          <div className="text-sm text-muted-foreground">
            Hatch/Sedan • {plan.hatchSedan.perWash}/wash
          </div>
          <div className="mt-1 text-sm font-medium text-primary">
            {plan.suvMuv.monthly}
          </div>
          <div className="text-sm text-muted-foreground">
            SUV/MUV • {plan.suvMuv.perWash}/wash
          </div>
        </div>

        <div className="space-y-2 border-t pt-4">
          <div className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>
              <strong>{plan.washDays}</strong> wash days
            </span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{plan.inclusions}</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>Doorstep service at your parking spot</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>Same-day redo if quality issue reported</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={plan.highlighted ? "default" : "outline"}>
          Subscribe to {plan.name}
        </Button>
      </CardFooter>
    </Card>
  );
}
