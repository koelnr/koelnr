import { createBrowserRouter } from "react-router";
import { RootLayout } from ".";
import { Home } from "./home";
import { SignIn } from "./auth/sign-in";
import { SignUp } from "./auth/sign-up";
import { ForgotPassword } from "./auth/forgot-password";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "./dashboard";
import { Overview } from "./dashboard/overview";
import { Plans } from "./dashboard/plans";
import { Services } from "./dashboard/services";
import { Orders } from "./dashboard/orders";
import { Profile } from "./dashboard/profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      {
        Component: ProtectedRoute,
        children: [
          {
            path: "dashboard",
            Component: DashboardLayout,
            children: [
              { index: true, Component: Overview },
              { path: "plans", Component: Plans },
              { path: "services", Component: Services },
              { path: "orders", Component: Orders },
              { path: "profile", Component: Profile },
            ],
          },
        ],
      },
    ],
  },
  { path: "/sign-in", Component: SignIn },
  { path: "/sign-up", Component: SignUp },
  { path: "/forgot-password", Component: ForgotPassword },
]);
