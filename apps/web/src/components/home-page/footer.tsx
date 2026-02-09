import { Separator } from "@/components/ui/separator";
import type { SiteConfig } from "@/config/site";

export function Footer({ config }: { config: SiteConfig }) {
  return (
    <footer className="border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="text-xl font-bold tracking-tight">
              {config.name}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {config.tagline}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <ul className="mt-3 space-y-2">
              {config.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Contact</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>{config.address}</li>
              <li>{config.phone}</li>
              <li>{config.email}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Follow Us</h3>
            <ul className="mt-3 space-y-2">
              {config.footer.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          {config.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
