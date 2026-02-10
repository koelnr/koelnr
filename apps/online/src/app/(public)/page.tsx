import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Star } from "lucide-react";
import { Droplets, Waves, SprayCan, Sparkles } from "lucide-react";
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
import { ContactForm } from "@/components/forms/contact-form";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import type { SiteConfig } from "@/config/site";

const iconMap = {
  Droplets,
  Waves,
  SprayCan,
  Sparkles,
} as const;

type HeroConfig = SiteConfig["hero"];
type AboutConfig = SiteConfig["about"];
type Service = SiteConfig["services"][number];
type OnDemand = SiteConfig["onDemand"];
type Addon = SiteConfig["subscriberAddons"][number];
type Testimonial = SiteConfig["testimonials"][number];

// Hero Component
function Hero({ config }: { config: HeroConfig }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={config.image}
          alt="Car wash hero"
          fill
          priority
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-linear-to-b from-background/10 to-background" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="max-w-2xl">
          <ScrollReveal direction="up" scroll={false} duration={0.8}>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {config.headline}
            </h1>
          </ScrollReveal>
          <ScrollReveal
            direction="up"
            scroll={false}
            delay={0.15}
            duration={0.8}
          >
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {config.subheadline}
            </p>
          </ScrollReveal>
          <ScrollReveal
            direction="up"
            scroll={false}
            delay={0.3}
            duration={0.8}
          >
            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href={config.cta.href}>{config.cta.label}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={config.ctaSecondary.href}>
                  {config.ctaSecondary.label}
                </a>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

// About Component
function About({ config }: { config: AboutConfig }) {
  return (
    <section id="about" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <ScrollReveal direction="left">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {config.headline}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                {config.description}
              </p>
            </ScrollReveal>

            <ScrollReveal
              direction="up"
              delay={0.15}
              stagger={0.1}
              staggerTarget=":scope > div"
              className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4"
            >
              {config.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </ScrollReveal>
          </div>

          <ScrollReveal direction="right">
            <div className="relative overflow-hidden rounded-2xl aspect-video">
              <Image
                src={config.image}
                alt="About Koelnr"
                fill
                className="object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

// Services Component
function Services({ services }: { services: readonly Service[] }) {
  return (
    <section id="services" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Our Services
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Professional care for every type of vehicle
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal
          direction="up"
          stagger={0.12}
          staggerTarget=":scope > div"
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap];
            return (
              <Card
                key={service.title}
                className="pt-0 group overflow-hidden border-border/50 transition-colors hover:border-border"
              >
                <div className="relative aspect-3/2 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    {Icon && <Icon className="size-5 text-primary" />}
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
}

// Pricing Component and its sub-components
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

function Pricing({
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

// Testimonials Component
function Testimonials({
  testimonials,
}: {
  testimonials: readonly Testimonial[];
}) {
  return (
    <section className="bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              What Our Customers Say
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Don&apos;t take our word for it
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal
          direction="up"
          stagger={0.12}
          staggerTarget=":scope > div"
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((t) => (
            <Card key={t.name} className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  &quot;{t.text}&quot;
                </blockquote>
                <div className="mt-4 text-sm font-medium">{t.name}</div>
              </CardContent>
            </Card>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}

// Contact Component
function Contact({ config }: { config: SiteConfig }) {
  return (
    <section id="contact" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <ScrollReveal direction="left">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Get in Touch
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Ready to get started? Reach out and we&apos;ll set you up.
              </p>

              <div className="mt-10 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="size-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Service Area</div>
                    <div className="text-sm text-muted-foreground">
                      {config.address}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="size-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-sm text-muted-foreground">
                      {config.phone}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="size-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">
                      {config.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="size-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Service Slots</div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>
                        <span className="font-medium text-foreground">
                          Morning:
                        </span>{" "}
                        {config.serviceSlots.morning.join(", ")}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">
                          Evening:
                        </span>{" "}
                        {config.serviceSlots.evening.join(", ")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.1}>
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <ContactForm />
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

// Main Page Component
export default function Home() {
  return (
    <main>
      <Hero config={siteConfig.hero} />
      <About config={siteConfig.about} />
      <Services services={siteConfig.services} />
      <Pricing
        subscriptions={siteConfig.subscriptions}
        subscriberAddons={siteConfig.subscriberAddons}
        onDemand={siteConfig.onDemand}
      />
      <Testimonials testimonials={siteConfig.testimonials} />
      <Contact config={siteConfig} />
    </main>
  );
}
