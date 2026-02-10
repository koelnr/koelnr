import { ScrollReveal } from "@/components/animations/scroll-reveal";
import type { SiteConfig } from "@/config/site";

type AboutConfig = SiteConfig["about"];

export function About({ config }: { config: AboutConfig }) {
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
            <div className="overflow-hidden rounded-2xl">
              <img
                src={config.image}
                alt="About Koelnr"
                className="h-full max-h-[50vh] w-full object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
