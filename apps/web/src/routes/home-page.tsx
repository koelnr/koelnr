import { siteConfig } from "@/config/site";
import { Hero } from "@/components/home-page/hero";
import { Services } from "@/components/home-page/services";
import { Pricing } from "@/components/home-page/pricing";
import { About } from "@/components/home-page/about";
import { Testimonials } from "@/components/home-page/testimonials";
import { Contact } from "@/components/home-page/contact";
import { Navbar } from "@/components/home-page/navbar";
import { Footer } from "@/components/home-page/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar config={siteConfig} />
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
      <Footer config={siteConfig} />
    </div>
  );
}
