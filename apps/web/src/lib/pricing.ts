import { siteConfig } from "@/config/site";
import type { VehicleType } from "@/types";

/**
 * Parse a price string like "₹2,499" or "₹1,199+" into a number (paise-free integer).
 * Strips currency symbol, commas, plus signs, and ranges (takes first value of "₹199–₹399").
 */
export function parsePrice(priceStr: string): number {
  const cleaned = priceStr.split("–")[0].replace(/[₹,+\s]/g, "");
  return parseInt(cleaned, 10);
}

/** Format a number as INR currency string */
export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

/** Get subscription monthly price for a plan + vehicle combo */
export function getSubscriptionPrice(
  planName: string,
  vehicleType: VehicleType,
): number {
  const plan = siteConfig.subscriptions.find((s) => s.name === planName);
  if (!plan) return 0;
  return parsePrice(plan[vehicleType].monthly);
}

/** Get on-demand service price for a service name + vehicle combo */
export function getOnDemandPrice(
  serviceName: string,
  vehicleType: VehicleType,
): number {
  const allServices = [
    ...siteConfig.onDemand.exterior,
    ...siteConfig.onDemand.interior,
    ...siteConfig.onDemand.combos,
  ];
  const service = allServices.find((s) => s.name === serviceName);
  if (!service) return 0;
  return parsePrice(service[vehicleType]);
}

/** Get addon price for a subscriber addon + vehicle combo */
export function getAddonPrice(
  addonName: string,
  vehicleType: VehicleType,
): number {
  const addon = siteConfig.subscriberAddons.find((a) => a.name === addonName);
  if (!addon) return 0;
  return parsePrice(addon[vehicleType]);
}
