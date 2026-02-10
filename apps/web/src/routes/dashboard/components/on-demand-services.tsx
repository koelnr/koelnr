import { siteConfig } from "@/config/site";
import { useAuthStore } from "@/stores/auth-store";
import { useUserProfileStore } from "@/stores/user-profile-store";
import { ServiceCard } from "./service-card";
import { CheckoutDialog } from "./checkout-dialog";
import { useState } from "react";

type SelectedService = { name: string; price: number } | null;

const categories = [
  { label: "Exterior", items: siteConfig.onDemand.exterior },
  { label: "Interior", items: siteConfig.onDemand.interior },
  { label: "Combos", items: siteConfig.onDemand.combos },
] as const;

export function OnDemandServices() {
  const user = useAuthStore((s) => s.user);
  const vehicleType = useUserProfileStore((s) => s.vehicleType);
  const [selected, setSelected] = useState<SelectedService>(null);

  return (
    <>
      <div className="space-y-8">
        {categories.map((cat) => (
          <div key={cat.label}>
            <h3 className="mb-3 text-base font-semibold">{cat.label}</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cat.items.map((service) => (
                <ServiceCard
                  key={service.name}
                  service={service}
                  onBook={(name, price) => setSelected({ name, price })}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {selected && user && (
        <CheckoutDialog
          open={!!selected}
          onOpenChange={(open) => {
            if (!open) setSelected(null);
          }}
          type="on_demand"
          serviceName={selected.name}
          servicePrice={selected.price}
          vehicleType={vehicleType}
          userId={user.uid}
        />
      )}
    </>
  );
}
