"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Loader2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import { createPaymentOrder } from "@/app/actions";
import { redirectToPayU } from "@/lib/payu-redirect";
import { getUserProfile } from "@/lib/firestore";
import type { VehicleType } from "@/lib/firestore";

type Service = {
  name: string;
  hatchSedan: string;
  suvMuv: string;
};

interface ServiceBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service;
}

export function ServiceBookingModal({
  open,
  onOpenChange,
  service,
}: ServiceBookingModalProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [vehicleType, setVehicleType] = useState<VehicleType>("hatchSedan");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const allSlots = [
    ...siteConfig.serviceSlots.morning,
    ...siteConfig.serviceSlots.evening,
  ];

  const handleBookService = async () => {
    // Validation
    if (!user) {
      toast.error("Please sign in to book a service");
      router.push("/sign-in");
      return;
    }

    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }

    setLoading(true);

    try {
      // Get user profile for phone number
      const profile = await getUserProfile(user.uid);

      if (!profile?.phone || profile.phone.length < 10) {
        toast.error("Please add your phone number in your profile");
        router.push("/dashboard/profile");
        return;
      }

      // Parse price
      const priceStr = vehicleType === "hatchSedan"
        ? service.hatchSedan
        : service.suvMuv;
      const price = parseFloat(priceStr.replace(/[₹,]/g, ""));

      // Create order
      const result = await createPaymentOrder({
        userId: user.uid,
        type: "on_demand",
        items: [
          {
            name: `${service.name} - ${vehicleType === "hatchSedan" ? "Hatch/Sedan" : "SUV/MUV"}`,
            price,
            quantity: 1,
          },
        ],
        customerInfo: {
          name: user.displayName || user.email?.split("@")[0] || "Customer",
          email: user.email || "",
          phone: profile.phone,
        },
      });

      if (result.success && result.payuParams && result.payuUrl) {
        // Close modal before redirect
        onOpenChange(false);
        redirectToPayU(result.payuUrl, result.payuParams);
      } else {
        toast.error(result.message || "Failed to create booking");
        setLoading(false);
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to create booking. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book {service.name}</DialogTitle>
          <DialogDescription>
            Choose your vehicle type, date, and time slot
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Vehicle Type Selection */}
          <div className="space-y-3">
            <Label>Vehicle Type</Label>
            <RadioGroup
              value={vehicleType}
              onValueChange={(v) => setVehicleType(v as VehicleType)}
            >
              <div className="flex items-center space-x-2 rounded-lg border p-3">
                <RadioGroupItem value="hatchSedan" id="booking-hatch" />
                <Label htmlFor="booking-hatch" className="flex-1 cursor-pointer">
                  <div className="font-medium">{service.hatchSedan}</div>
                  <div className="text-sm text-muted-foreground">Hatch/Sedan</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border p-3">
                <RadioGroupItem value="suvMuv" id="booking-suv" />
                <Label htmlFor="booking-suv" className="flex-1 cursor-pointer">
                  <div className="font-medium">{service.suvMuv}</div>
                  <div className="text-sm text-muted-foreground">SUV/MUV</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Date Selection */}
          <div className="space-y-3">
            <Label>Select Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </div>

          {/* Time Slot Selection */}
          <div className="space-y-3">
            <Label>Select Time Slot</Label>
            <RadioGroup value={selectedSlot} onValueChange={setSelectedSlot}>
              <div className="grid gap-2">
                {allSlots.map((slot) => (
                  <div
                    key={slot}
                    className="flex items-center space-x-2 rounded-lg border p-3"
                  >
                    <RadioGroupItem value={slot} id={`slot-${slot}`} />
                    <Label
                      htmlFor={`slot-${slot}`}
                      className="flex-1 cursor-pointer font-normal"
                    >
                      {slot}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleBookService} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Proceed to Payment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
