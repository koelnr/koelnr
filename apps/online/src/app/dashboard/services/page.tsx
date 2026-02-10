import { siteConfig } from "@/config/site";
import { ServiceCard } from "@/components/dashboard/service-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function ServicesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">On-Demand Services</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Book any service for immediate or scheduled delivery
        </p>
      </div>

      {/* Exterior Services */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Exterior Cleaning</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.onDemand.exterior.map((service) => (
            <ServiceCard key={service.name} service={service} />
          ))}
        </div>
      </div>

      {/* Interior Services */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Interior Cleaning</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.onDemand.interior.map((service) => (
            <ServiceCard key={service.name} service={service} />
          ))}
        </div>
      </div>

      {/* Combo Packages */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Combo Packages</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.onDemand.combos.map((service) => (
            <ServiceCard key={service.name} service={service} featured />
          ))}
        </div>
      </div>

      {/* Service Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="size-5" />
            Service Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {siteConfig.policies.map((policy, index) => (
              <li key={index} className="flex gap-2">
                <span className="text-muted-foreground">•</span>
                <span>{policy}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
