import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Navbar config={siteConfig} />
      <div className="pt-16">{children}</div>
      <Footer config={siteConfig} />
    </>
  );
}
