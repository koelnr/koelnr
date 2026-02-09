import { Button } from "@/components/ui/button";
import type { SiteConfig } from "@/config/site";

type HeroConfig = SiteConfig["hero"];

export function Hero({ config }: { config: HeroConfig }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={config.image}
          alt="Car wash hero"
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {config.headline}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {config.subheadline}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <a href={config.cta.href}>{config.cta.label}</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={config.ctaSecondary.href}>
                {config.ctaSecondary.label}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
