import { siteConfig } from "@/config/site";
import { Hero } from "@/components/landing/hero";
import { Services } from "@/components/landing/services";
import { Pricing } from "@/components/landing/pricing";
import { About } from "@/components/landing/about";
import { Testimonials } from "@/components/landing/testimonials";
import { Contact } from "@/components/landing/contact";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar config={siteConfig} />
      <main>
        <Hero config={siteConfig.hero} />
        <Services services={siteConfig.services} />
        <Pricing plans={siteConfig.pricing} />
        <About config={siteConfig.about} />
        <Testimonials testimonials={siteConfig.testimonials} />
        <Contact config={siteConfig} />
      </main>
      <Footer config={siteConfig} />
    </div>
  );
}
