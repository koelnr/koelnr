import { siteConfig } from "@/config/site";
import { Hero } from "@/routes/home/components/hero";
import { Services } from "@/routes/home/components/services";
import { Pricing } from "@/routes/home/components/pricing";
import { About } from "@/routes/home/components/about";
import { Testimonials } from "@/routes/home/components/testimonials";
import { Contact } from "@/routes/home/components/contact";

export const Home = () => {
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
};
