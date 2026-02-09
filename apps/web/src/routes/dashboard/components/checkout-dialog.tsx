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
import { useSubscriptionStore } from "@/stores/subscription-store";
import { useOrderStore } from "@/stores/order-store";
import { getSubscriptionPrice, formatPrice } from "@/lib/pricing";
import { initiatePayment } from "@/lib/razorpay";
import { SlotPicker } from "./slot-picker";
import { useState } from "react";
import { toast } from "sonner";
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
  userId,
  userEmail,
  userName,
}: CheckoutDialogProps) {
  const vehicleType = useUserProfileStore((s) => s.vehicleType);
  const fetchSubscription = useSubscriptionStore((s) => s.fetchSubscription);
  const fetchOrders = useOrderStore((s) => s.fetchOrders);
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
    try {
      const items = [{ name: displayName!, price: amount, quantity: 1 }];

      const result = await initiatePayment({
        type,
        planName: isSubscription ? planName : undefined,
        serviceName: !isSubscription ? serviceName : undefined,
        items,
        totalAmount: amount,
        vehicleType,
        scheduledSlot: !isSubscription ? selectedSlot : undefined,
        scheduledDate: !isSubscription ? selectedDate : undefined,
        userName,
        userEmail,
      });

      if (result.success) {
        toast.success("Payment successful!", {
          description: isSubscription
            ? `Subscribed to ${planName}`
            : `Booked ${serviceName}`,
        });
        // Refresh stores
        fetchSubscription(userId);
        fetchOrders(userId);
        onOpenChange(false);
      } else {
        toast.info("Payment cancelled");
      }
    } catch {
      toast.error("Payment failed", {
        description: "Something went wrong. Please try again.",
      });
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
