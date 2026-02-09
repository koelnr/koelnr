import { Link } from "react-router";
import { useSubscriptionStore } from "@/stores/subscription-store";
import { useOrderStore } from "@/stores/order-store";
import { ActiveSubscriptionCard } from "./active-subscription-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, Car, ClipboardList } from "lucide-react";
import { formatPrice } from "@/lib/pricing";

export function OverviewSection() {
  const activeSub = useSubscriptionStore((s) => s.activeSubscription);
  const subLoading = useSubscriptionStore((s) => s.loading);
  const orders = useOrderStore((s) => s.orders);
  const ordersLoading = useOrderStore((s) => s.loading);

  return (
    <div className="space-y-6">
      {/* Active Subscription */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Active Subscription</h2>
        {subLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : activeSub ? (
          <ActiveSubscriptionCard subscription={activeSub} />
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-8">
              <CreditCard className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No active subscription
              </p>
              <Button asChild size="sm">
                <Link to="/dashboard/plans">Browse Plans</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
            <Link to="/dashboard/plans">
              <CreditCard className="size-5" />
              <span className="text-sm">Browse Plans</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
            <Link to="/dashboard/services">
              <Car className="size-5" />
              <span className="text-sm">Book Service</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
            <Link to="/dashboard/orders">
              <ClipboardList className="size-5" />
              <span className="text-sm">View Orders</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          {orders.length > 0 && (
            <Button variant="link" size="sm" asChild>
              <Link to="/dashboard/orders">View all</Link>
            </Button>
          )}
        </div>
        {ordersLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-8">
              <ClipboardList className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No orders yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 5).map((order) => (
              <Card key={order.id}>
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm">
                        {order.items.map((i) => i.name).join(", ")}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {order.createdAt?.toDate?.()
                          ? order.createdAt.toDate().toLocaleDateString()
                          : "Pending"}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {formatPrice(order.totalAmount)}
                      </span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
