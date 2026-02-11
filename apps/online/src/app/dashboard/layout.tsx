import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { OnboardingModal } from "@/components/onboarding-modal";
import Logo from "@/assets/logo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/20">
        <div className="border-b bg-background">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/" className="transition-opacity hover:opacity-70" aria-label="Back to home">
                  <Logo className="size-8" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Manage your subscriptions and services
                  </p>
                </div>
              </div>
            </div>
            <DashboardNav />
          </div>
        </div>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
        <WhatsAppFloat />
        <OnboardingModal />
      </div>
    </ProtectedRoute>
  );
}
