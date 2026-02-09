import { OnDemandServices } from "./components/on-demand-services";

export function Services() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">On-Demand Services</h2>
        <p className="text-sm text-muted-foreground">
          Book individual services — no subscription required
        </p>
      </div>
      <OnDemandServices />
    </div>
  );
}
