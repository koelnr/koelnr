import Image from "next/image";
import { Link } from "lucide-react";
import { siteConfig as config } from "@/config/site";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { hero } = config;

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={hero.image}
            alt="Car wash hero"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-linear-to-b from-background/10 to-background" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="max-w-2xl">
            <ScrollReveal direction="up" scroll={false} duration={0.8}>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {hero.headline}
              </h1>
            </ScrollReveal>
            <ScrollReveal
              direction="up"
              scroll={false}
              delay={0.15}
              duration={0.8}
            >
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
                {hero.subheadline}
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
                  <Link to={hero.cta.href}>{hero.cta.label}</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href={hero.ctaSecondary.href}>
                    {hero.ctaSecondary.label}
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </main>
  );
}
