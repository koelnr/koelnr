import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useOrderStore } from "@/stores/order-store";
import { OrderHistory } from "./components/order-history";

export function Orders() {
  const user = useAuthStore((s) => s.user);
  const fetchOrders = useOrderStore((s) => s.fetchOrders);

  useEffect(() => {
    if (user) {
      fetchOrders(user.uid);
    }
  }, [user, fetchOrders]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Order History</h2>
        <p className="text-sm text-muted-foreground">
          View all your past and current orders
        </p>
      </div>
      <OrderHistory />
    </div>
  );
}
