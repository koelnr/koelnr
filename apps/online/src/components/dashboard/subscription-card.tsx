"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { SiteConfig } from "@/config/site";
import { createPaymentOrder } from "@/app/actions";
import { redirectToPayU } from "@/lib/payu-redirect";
import { useAuthStore } from "@/stores/auth-store";
import { getUserProfile } from "@/lib/firestore";
import type { UserProfile } from "@/lib/firestore";

type SubscriptionPlan = SiteConfig["subscriptions"][number];

export function SubscriptionCard({ plan }: { plan: SubscriptionPlan }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [vehicleType, setVehicleType] = useState<"hatchSedan" | "suvMuv">("hatchSedan");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile on mount
  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then((profile) => {
        if (profile) {
          setUserProfile(profile);
          // Set default vehicle type from profile
          setVehicleType(profile.vehicleType);
        }
      });
    }
  }, [user]);

  const handleSubscribe = async () => {
    setError(null);

    // Check authentication
    if (!user) {
      setError("Please sign in to subscribe");
      setTimeout(() => router.push("/sign-in"), 2000);
      return;
    }

    // Check user profile
    if (!userProfile) {
      setError("Loading your profile...");
      return;
    }

    // Check if phone number is available
    if (!userProfile.phone || userProfile.phone.length < 10) {
      setError("Please add your phone number in your profile before subscribing");
      setTimeout(() => router.push("/dashboard/profile"), 2000);
      return;
    }

    setLoading(true);

    try {
      const userId = user.uid;
      const userEmail = user.email || "";
      const userName = user.displayName || userEmail.split("@")[0];
      const userPhone = userProfile.phone;

      // Parse price (remove ₹ and comma)
      const price = parseFloat(
        (vehicleType === "hatchSedan" ? plan.hatchSedan.monthly : plan.suvMuv.monthly)
          .replace("₹", "")
          .replace(",", ""),
      );

      const result = await createPaymentOrder({
        userId,
        type: "subscription",
        items: [
          {
            name: `${plan.name} - ${vehicleType === "hatchSedan" ? "Hatch/Sedan" : "SUV/MUV"}`,
            price,
            quantity: 1,
          },
        ],
        planName: plan.name,
        vehicleType,
        customerInfo: {
          name: userName,
          email: userEmail,
          phone: userPhone,
        },
      });

      if (result.success && result.payuParams && result.payuUrl) {
        redirectToPayU(result.payuUrl, result.payuParams);
      } else {
        alert(result.message || "Failed to create order");
        setLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Card className={plan.highlighted ? "border-primary shadow-md" : ""}>
      {plan.highlighted && (
        <div className="flex justify-center pt-4">
          <Badge className="bg-primary">Most Popular</Badge>
        </div>
      )}
      <CardHeader className={plan.highlighted ? "pb-4" : ""}>
        <h3 className="text-2xl font-bold">{plan.name}</h3>
        <p className="text-sm text-muted-foreground">{plan.schedule}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-medium">Select Vehicle Type:</p>
          <RadioGroup value={vehicleType} onValueChange={(v) => setVehicleType(v as typeof vehicleType)}>
            <div className="flex items-center space-x-2 rounded-lg border p-3">
              <RadioGroupItem value="hatchSedan" id={`${plan.name}-hatchSedan`} />
              <Label htmlFor={`${plan.name}-hatchSedan`} className="flex-1 cursor-pointer">
                <div className="font-medium">{plan.hatchSedan.monthly}/month</div>
                <div className="text-sm text-muted-foreground">
                  Hatch/Sedan • {plan.hatchSedan.perWash}/wash
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border p-3">
              <RadioGroupItem value="suvMuv" id={`${plan.name}-suvMuv`} />
              <Label htmlFor={`${plan.name}-suvMuv`} className="flex-1 cursor-pointer">
                <div className="font-medium">{plan.suvMuv.monthly}/month</div>
                <div className="text-sm text-muted-foreground">
                  SUV/MUV • {plan.suvMuv.perWash}/wash
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2 border-t pt-4">
          <div className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>
              <strong>{plan.washDays}</strong> wash days
            </span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{plan.inclusions}</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>Doorstep service at your parking spot</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>Same-day redo if quality issue reported</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-3">
        {error && (
          <Alert variant="destructive" className="w-full">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button
          className="w-full"
          variant={plan.highlighted ? "default" : "outline"}
          onClick={handleSubscribe}
          disabled={loading || authLoading || !user}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Processing...
            </>
          ) : authLoading ? (
            "Loading..."
          ) : !user ? (
            "Sign In to Subscribe"
          ) : (
            `Subscribe to ${plan.name}`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
