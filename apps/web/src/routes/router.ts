import { createBrowserRouter } from "react-router";
import { RootLayout } from ".";
import { Home } from "./home";
import { SignIn } from "./auth/sign-in";
import { SignUp } from "./auth/sign-up";
import { ProtectedRoute } from "@/components/protected-route";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      {
        Component: ProtectedRoute,
        children: [
          // Add protected routes here
        ],
      },
    ],
  },
  { path: "/sign-in", Component: SignIn },
  { path: "/sign-up", Component: SignUp },
]);
