import Link from "next/link";
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
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { cn } from "@/lib/utils";
import type { SiteConfig } from "@/config/site";

type OnDemand = SiteConfig["onDemand"];
type Addon = SiteConfig["subscriberAddons"][number];

function PriceRow({
  name,
  hatchSedan,
  suvMuv,
}: {
  name: string;
  hatchSedan: string;
  suvMuv: string;
}) {
  return (
    <div className="grid grid-cols-3 items-center gap-4 py-3 border-b border-border/30 last:border-0">
      <div className="text-sm">{name}</div>
      <div className="text-sm text-center font-medium">{hatchSedan}</div>
      <div className="text-sm text-center font-medium">{suvMuv}</div>
    </div>
  );
}

function OnDemandSection({ onDemand }: { onDemand: OnDemand }) {
  const categories = [
    { label: "Exterior", items: onDemand.exterior },
    { label: "Interior", items: onDemand.interior },
    { label: "Combos", items: onDemand.combos },
  ] as const;

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">On-Demand Pricing</CardTitle>
        <CardDescription>
          Individual service pricing — no subscription required
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {categories.map((cat) => (
          <div key={cat.label}>
            <h4 className="text-sm font-semibold mb-2">{cat.label}</h4>
            <div className="grid grid-cols-3 items-center gap-4 pb-2 border-b border-border/50">
              <div className="text-xs text-muted-foreground">Service</div>
              <div className="text-xs text-muted-foreground text-center">
                Hatch/Sedan
              </div>
              <div className="text-xs text-muted-foreground text-center">
                SUV/MUV
              </div>
            </div>
            {cat.items.map((item) => (
              <PriceRow
                key={item.name}
                name={item.name}
                hatchSedan={item.hatchSedan}
                suvMuv={item.suvMuv}
              />
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function AddonsSection({ addons }: { addons: readonly Addon[] }) {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Subscriber Add-ons</CardTitle>
        <CardDescription>
          Extra services available to active subscribers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 items-center gap-4 pb-2 border-b border-border/50">
          <div className="text-xs text-muted-foreground">Add-on</div>
          <div className="text-xs text-muted-foreground text-center">
            Hatch/Sedan
          </div>
          <div className="text-xs text-muted-foreground text-center">
            SUV/MUV
          </div>
        </div>
        {addons.map((addon) => (
          <PriceRow
            key={addon.name}
            name={addon.name}
            hatchSedan={addon.hatchSedan}
            suvMuv={addon.suvMuv}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export function Pricing({
  subscriptions,
  subscriberAddons,
  onDemand,
}: {
  subscriptions: SiteConfig["subscriptions"];
  subscriberAddons: SiteConfig["subscriberAddons"];
  onDemand: SiteConfig["onDemand"];
}) {
  return (
    <section id="pricing" className="bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Subscriptions */}
        <ScrollReveal direction="up">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Subscription Plans
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Subscribe for regular doorstep washes. Billed monthly.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal
          direction="up"
          delay={0.1}
          stagger={0.15}
          staggerTarget=":scope > div"
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {subscriptions.map((plan) => (
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
              <CardContent className="flex-1 space-y-4">
                <div className="rounded-lg border border-border/50 p-4">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Hatch / Sedan
                  </div>
                  <div className="mt-1">
                    <span className="text-3xl font-bold">
                      {plan.hatchSedan.monthly}
                    </span>
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {plan.hatchSedan.perWash}/wash
                  </div>
                </div>
                <div className="rounded-lg border border-border/50 p-4">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    SUV / MUV
                  </div>
                  <div className="mt-1">
                    <span className="text-3xl font-bold">
                      {plan.suvMuv.monthly}
                    </span>
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {plan.suvMuv.perWash}/wash
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link href="/dashboard/plans">Subscribe</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </ScrollReveal>

        {/* Add-ons + On-Demand */}
        <ScrollReveal
          direction="up"
          stagger={0.2}
          staggerTarget=":scope > div"
          className="mt-20 grid gap-8 grid-cols-1"
        >
          <AddonsSection addons={subscriberAddons} />
          <OnDemandSection onDemand={onDemand} />
        </ScrollReveal>
      </div>
    </section>
  );
}
