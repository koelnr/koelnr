import { Droplets, Waves, SprayCan, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import type { SiteConfig } from "@/config/site";

const iconMap = {
  Droplets,
  Waves,
  SprayCan,
  Sparkles,
} as const;

type Service = SiteConfig["services"][number];

export function Services({ services }: { services: readonly Service[] }) {
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
                <div className="aspect-3/2 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
