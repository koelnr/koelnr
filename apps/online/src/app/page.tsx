import { siteConfig } from "@/config/site";
import { About } from "./(public)/components/about";
import { Hero } from "./(public)/components/hero";
import { Pricing } from "./(public)/components/pricing";
import { Services } from "./(public)/components/services";
import { Testimonials } from "./(public)/components/testimonials";
import { Contact } from "./(public)/components/contact";

export default function Home() {
  return (
    <main>
      <Hero config={siteConfig.hero} />
      <Services services={siteConfig.services} />
      <Pricing
        subscriptions={siteConfig.subscriptions}
        subscriberAddons={siteConfig.subscriberAddons}
        onDemand={siteConfig.onDemand}
      />
      <About config={siteConfig.about} />
      <Testimonials testimonials={siteConfig.testimonials} />
      <Contact config={siteConfig} />
    </main>
  );
}
