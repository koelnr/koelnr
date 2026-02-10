"use client";

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
import { User, Car, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
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
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="+91 98765 43210" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              placeholder="Enter your complete address for doorstep service"
              rows={3}
            />
          </div>

          <Button>Save Changes</Button>
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
              <Label htmlFor="vehicle-type">Vehicle Type</Label>
              <Select defaultValue="hatchSedan">
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
              <Input id="make" placeholder="e.g., Honda, Maruti" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input id="model" placeholder="e.g., City, Swift" />
            </div>
          </div>

          <Button>Save Vehicle Details</Button>
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
