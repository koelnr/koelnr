"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  ShoppingBag,
  History,
  User,
} from "lucide-react";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Subscriptions", href: "/dashboard/subscriptions", icon: Calendar },
  { name: "Services", href: "/dashboard/services", icon: ShoppingBag },
  { name: "Orders", href: "/dashboard/orders", icon: History },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-6 flex gap-2 overflow-x-auto">
      {navigation.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="size-4" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
