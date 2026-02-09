import { Outlet } from "react-router";
import { DashboardNav } from "./components/dashboard-nav";
import { VehicleSelector } from "./components/vehicle-selector";

export function DashboardLayout() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              Manage your account and services
            </p>
          </div>
          <VehicleSelector />
        </div>

        <DashboardNav />

        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </section>
  );
}
