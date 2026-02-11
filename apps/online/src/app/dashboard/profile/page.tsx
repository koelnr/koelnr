"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { User, Car, LogOut, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getUserProfile, updateUserProfile, createUserProfile } from "@/lib/firestore";
import type { UserProfile, VehicleType } from "@/lib/firestore";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType>("hatchSedan");

  // Load user profile
  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then((data) => {
        if (data) {
          setProfile(data);
          setPhone(data.phone || "");
          setAddress(data.address || "");
          setVehicleType(data.vehicleType || "hatchSedan");
        }
        setLoading(false);
      });
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    setSuccess(false);

    try {
      if (profile) {
        // Update existing profile
        await updateUserProfile(user.uid, {
          phone,
          address,
          vehicleType,
        });
      } else {
        // Create new profile
        await createUserProfile(user.uid, {
          phone,
          address,
          vehicleType,
        });
      }

      // Refresh profile data
      const updatedProfile = await getUserProfile(user.uid);
      setProfile(updatedProfile);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Profile Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                defaultValue={user?.displayName || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Required for payment and service notifications
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              placeholder="Enter your complete address for doorstep service"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <Button onClick={handleSaveProfile} disabled={saving || !phone}>
            {saving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="mr-2 size-4" />
                Saved!
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Vehicle Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="size-5" />
            Vehicle Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vehicle-type">Vehicle Type *</Label>
              <Select
                value={vehicleType}
                onValueChange={(v) => setVehicleType(v as VehicleType)}
              >
                <SelectTrigger id="vehicle-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hatchSedan">Hatch / Sedan</SelectItem>
                  <SelectItem value="suvMuv">SUV / MUV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle-number">Vehicle Number</Label>
              <Input
                id="vehicle-number"
                placeholder="PB 01 AB 1234"
                className="uppercase"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <Input id="make" placeholder="e.g., Honda, Maruti" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input id="model" placeholder="e.g., City, Swift" disabled />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Vehicle details coming soon
          </p>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 size-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
