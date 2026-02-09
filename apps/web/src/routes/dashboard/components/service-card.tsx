import { useUserProfileStore } from "@/stores/user-profile-store";
import { parsePrice, formatPrice } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ServiceItem = {
  name: string;
  hatchSedan: string;
  suvMuv: string;
};

export function ServiceCard({
  service,
  onBook,
}: {
  service: ServiceItem;
  onBook: (name: string, price: number) => void;
}) {
  const vehicleType = useUserProfileStore((s) => s.vehicleType);
  const priceStr = service[vehicleType];
  const price = parsePrice(priceStr);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{service.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <span className="text-lg font-bold">{formatPrice(price)}</span>
        <Button size="sm" onClick={() => onBook(service.name, price)}>
          Book
        </Button>
      </CardContent>
    </Card>
  );
}
