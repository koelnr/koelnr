"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores/auth-store";
import {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
} from "@/lib/firestore";
import type { VehicleType } from "@/lib/firestore";

export function OnboardingModal() {
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType>("hatchSedan");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    getUserProfile(user.uid).then((profile) => {
      if (!profile || !profile.phone) {
        setOpen(true);
        if (profile?.vehicleType) setVehicleType(profile.vehicleType);
        if (profile?.address) setAddress(profile.address);
      }
    });
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 10 || cleaned.length > 15) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setError("");
    setSaving(true);

    try {
      const profile = await getUserProfile(user.uid);
      if (profile) {
        await updateUserProfile(user.uid, { phone, vehicleType, address });
      } else {
        await createUserProfile(user.uid, { phone, vehicleType, address });
      }
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            We need your phone number for service updates and payments.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="onboard-phone">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="onboard-phone"
              type="tel"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="onboard-vehicle">Vehicle Type</Label>
            <Select
              value={vehicleType}
              onValueChange={(v) => setVehicleType(v as VehicleType)}
            >
              <SelectTrigger id="onboard-vehicle">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hatchSedan">Hatch / Sedan</SelectItem>
                <SelectItem value="suvMuv">SUV / MUV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="onboard-address">Address (optional)</Label>
            <Input
              id="onboard-address"
              placeholder="Your parking location"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Saving..." : "Continue to Dashboard"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
