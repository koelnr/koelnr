import { NavLink } from "react-router";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CreditCard,
  Car,
  ClipboardList,
  UserCircle,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, end: true },
  { label: "Plans", href: "/dashboard/plans", icon: CreditCard, end: false },
  { label: "Services", href: "/dashboard/services", icon: Car, end: false },
  {
    label: "Orders",
    href: "/dashboard/orders",
    icon: ClipboardList,
    end: false,
  },
  { label: "Profile", href: "/dashboard/profile", icon: UserCircle, end: false },
] as const;

export function DashboardNav() {
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border pb-px">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.end}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )
          }
        >
          <item.icon className="size-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
