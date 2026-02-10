import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Package } from "lucide-react";

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Order History</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          View all your past orders and subscriptions
        </p>
      </div>

      {/* Empty State */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="size-5" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4">
              <Package className="size-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-semibold">No orders yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your order history will appear here once you subscribe or book a
              service
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Example of what orders will look like when populated */}
      {/* Uncomment this when you have actual orders */}
      {/*
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Order #12345</p>
                  <Badge variant="secondary">Completed</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Pressure Wash + Interior Refresh
                </p>
                <p className="text-sm text-muted-foreground">
                  March 15, 2024 at 10:00 AM
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">₹749</p>
                <p className="text-xs text-muted-foreground">Hatch/Sedan</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      */}
    </div>
  );
}
