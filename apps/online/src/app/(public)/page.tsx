import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Star } from "lucide-react";
import { Droplets, Waves, SprayCan, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { ContactForm } from "@/components/forms/contact-form";
import { PricingSection } from "@/components/pricing-section";
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
      <PricingSection
        subscriptions={siteConfig.subscriptions}
        subscriberAddons={siteConfig.subscriberAddons}
        onDemand={siteConfig.onDemand}
      />
      <Testimonials testimonials={siteConfig.testimonials} />
      <Contact config={siteConfig} />
    </main>
  );
}
