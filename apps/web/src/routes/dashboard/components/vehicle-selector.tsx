import { cn } from "@/lib/utils";
import { useUserProfileStore } from "@/stores/user-profile-store";
import { Car } from "lucide-react";
import type { VehicleType } from "@/types";

const options: { value: VehicleType; label: string }[] = [
  { value: "hatchSedan", label: "Hatch / Sedan" },
  { value: "suvMuv", label: "SUV / MUV" },
];

export function VehicleSelector() {
  const vehicleType = useUserProfileStore((s) => s.vehicleType);
  const setVehicleType = useUserProfileStore((s) => s.setVehicleType);

  return (
    <div className="flex items-center gap-2">
      <Car className="size-4 text-muted-foreground" />
      <div className="flex rounded-lg border border-border bg-muted/50 p-0.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setVehicleType(opt.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              vehicleType === opt.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
