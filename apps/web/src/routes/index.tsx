import { Outlet } from "react-router";
import { SmoothScroll } from "@/components/animations/smooth-scroll";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { siteConfig } from "@/config/site";

export const RootLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar config={siteConfig} />
      <SmoothScroll className="pt-16">
        <Outlet />
      </SmoothScroll>
      <Footer config={siteConfig} />
    </div>
  );
};
