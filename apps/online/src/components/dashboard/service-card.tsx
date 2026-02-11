"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceBookingModal } from "./service-booking-modal";

type Service = {
  name: string;
  hatchSedan: string;
  suvMuv: string;
};

export function ServiceCard({
  service,
  featured = false,
}: {
  service: Service;
  featured?: boolean;
}) {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <Card className={featured ? "border-primary" : ""}>
      <CardContent className="pt-6">
        {featured && (
          <Badge className="mb-3 bg-primary">Best Value</Badge>
        )}
        <h4 className="font-semibold">{service.name}</h4>
        <div className="mt-4 space-y-1">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Hatch/Sedan</span>
            <span className="text-lg font-bold">{service.hatchSedan}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">SUV/MUV</span>
            <span className="text-lg font-bold text-primary">{service.suvMuv}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={featured ? "default" : "outline"}
          onClick={() => setShowBooking(true)}
        >
          Book Now
        </Button>
      </CardFooter>
      <ServiceBookingModal
        open={showBooking}
        onOpenChange={setShowBooking}
        service={service}
      />
    </Card>
  );
}
