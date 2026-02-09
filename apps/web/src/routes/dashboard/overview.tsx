import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useSubscriptionStore } from "@/stores/subscription-store";
import { useOrderStore } from "@/stores/order-store";
import { useUserProfileStore } from "@/stores/user-profile-store";
import { OverviewSection } from "./components/overview-section";

export function Overview() {
  const user = useAuthStore((s) => s.user);
  const fetchSubscription = useSubscriptionStore((s) => s.fetchSubscription);
  const fetchOrders = useOrderStore((s) => s.fetchOrders);
  const fetchProfile = useUserProfileStore((s) => s.fetchProfile);

  useEffect(() => {
    if (user) {
      fetchProfile(user.uid);
      fetchSubscription(user.uid);
      fetchOrders(user.uid);
    }
  }, [user, fetchProfile, fetchSubscription, fetchOrders]);

  return <OverviewSection />;
}
