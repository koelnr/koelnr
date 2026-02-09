import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { SiteConfig } from "@/config/site";

export function Contact({ config }: { config: SiteConfig }) {
  return (
    <section id="contact" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Get in Touch
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Ready to get started? Reach out and we'll set you up.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="size-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Service Area</div>
                  <div className="text-sm text-muted-foreground">
                    {config.address}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="size-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Phone</div>
                  <div className="text-sm text-muted-foreground">
                    {config.phone}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="size-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">
                    {config.email}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="size-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Service Slots</div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>
                      <span className="font-medium text-foreground">Morning:</span>{" "}
                      {config.serviceSlots.morning.join(", ")}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Evening:</span>{" "}
                      {config.serviceSlots.evening.join(", ")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <form
                className="space-y-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium"
                    >
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="Your phone"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="service"
                    className="mb-2 block text-sm font-medium"
                  >
                    Interested In
                  </label>
                  <select
                    id="service"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select an option</option>
                    <option value="smart-3d">Smart 3D Subscription</option>
                    <option value="pro-6d">Pro 6D Subscription</option>
                    <option value="elite-6d">Elite 6D Subscription</option>
                    <option value="on-demand">On-Demand Wash</option>
                    <option value="deep-interior">Deep Interior</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="vehicle"
                    className="mb-2 block text-sm font-medium"
                  >
                    Vehicle Type
                  </label>
                  <select
                    id="vehicle"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select vehicle type</option>
                    <option value="hatch-sedan">Hatchback / Sedan</option>
                    <option value="suv-muv">SUV / MUV</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Your address, preferred slot, or any questions"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
