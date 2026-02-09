import { SubscriptionPlans } from "./components/subscription-plans";

export function Plans() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Subscription Plans</h2>
        <p className="text-sm text-muted-foreground">
          Choose a plan for regular doorstep car care
        </p>
      </div>
      <SubscriptionPlans />
    </div>
  );
}
