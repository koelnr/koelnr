import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUserProfileStore } from "@/stores/user-profile-store";
import { getSubscriptionPrice, formatPrice } from "@/lib/pricing";
import { SlotPicker } from "./slot-picker";
import { useState } from "react";
import type { VehicleType } from "@/types";

type CheckoutDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userEmail: string;
  userName: string;
} & (
  | {
      type: "subscription";
      planName: string;
      serviceName?: undefined;
      servicePrice?: undefined;
      vehicleType?: undefined;
    }
  | {
      type: "on_demand";
      serviceName: string;
      servicePrice: number;
      vehicleType: VehicleType;
      planName?: undefined;
    }
);

export function CheckoutDialog({
  open,
  onOpenChange,
  type,
  planName,
  serviceName,
  servicePrice,
}: CheckoutDialogProps) {
  const vehicleType = useUserProfileStore((s) => s.vehicleType);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const isSubscription = type === "subscription";
  const displayName = isSubscription ? planName : serviceName;
  const amount = isSubscription
    ? getSubscriptionPrice(planName!, vehicleType)
    : servicePrice!;

  const handlePurchase = async () => {
    setLoading(true);
    // Razorpay integration will be added in Phase 5
    // For now, show that the flow works
    try {
      // TODO: Call cloud function to create Razorpay order
      // TODO: Open Razorpay checkout modal
      // TODO: Verify payment on success
      alert(
        `Payment flow coming soon!\n\n${displayName}\nAmount: ${formatPrice(amount)}\n${!isSubscription && selectedSlot ? `Slot: ${selectedSlot}` : ""}`,
      );
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isSubscription ? "Subscribe to" : "Book"} {displayName}
          </DialogTitle>
          <DialogDescription>
            {isSubscription
              ? "Monthly subscription, cancel anytime"
              : "One-time on-demand service"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="font-medium">{displayName}</p>
              <p className="text-sm text-muted-foreground">
                {vehicleType === "hatchSedan" ? "Hatch / Sedan" : "SUV / MUV"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">{formatPrice(amount)}</p>
              {isSubscription && (
                <p className="text-xs text-muted-foreground">/month</p>
              )}
            </div>
          </div>

          {!isSubscription && (
            <SlotPicker
              selectedSlot={selectedSlot}
              onSlotChange={setSelectedSlot}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handlePurchase}
            disabled={loading || (!isSubscription && !selectedSlot)}
          >
            {loading ? "Processing..." : `Pay ${formatPrice(amount)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
