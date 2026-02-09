import { useOrderStore } from "@/stores/order-store";
import { formatPrice } from "@/lib/pricing";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardList } from "lucide-react";
import type { OrderStatus } from "@/types";

const statusVariant: Record<OrderStatus, "default" | "secondary" | "destructive" | "outline"> = {
  created: "outline",
  payment_pending: "outline",
  paid: "default",
  scheduled: "secondary",
  in_progress: "secondary",
  completed: "default",
  cancelled: "destructive",
  failed: "destructive",
};

export function OrderHistory() {
  const orders = useOrderStore((s) => s.orders);
  const loading = useOrderStore((s) => s.loading);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12">
          <ClipboardList className="size-10 text-muted-foreground" />
          <p className="text-muted-foreground">No orders yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Items</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">
                {order.items.map((i) => i.name).join(", ")}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize text-xs">
                  {order.type.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell>{formatPrice(order.totalAmount)}</TableCell>
              <TableCell>
                <Badge
                  variant={statusVariant[order.status]}
                  className="capitalize text-xs"
                >
                  {order.status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {order.createdAt?.toDate?.()
                  ? order.createdAt.toDate().toLocaleDateString()
                  : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
