import { createBrowserRouter } from "react-router";
import { RootLayout } from ".";
import { Home } from "./home";
import { SignIn } from "./auth/sign-in";
import { SignUp } from "./auth/sign-up";
import { ForgotPassword } from "./auth/forgot-password";
import { ProtectedRoute } from "@/components/protected-route";
import { Dashboard } from "./dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      {
        Component: ProtectedRoute,
        children: [
          { path: "dashboard", Component: Dashboard },
        ],
      },
    ],
  },
  { path: "/sign-in", Component: SignIn },
  { path: "/sign-up", Component: SignUp },
  { path: "/forgot-password", Component: ForgotPassword },
]);
