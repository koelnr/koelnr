import { createBrowserRouter } from "react-router";
import { RootLayout } from ".";
import { Home } from "./home";
import { SignIn } from "./auth/sign-in";
import { SignUp } from "./auth/sign-up";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [{ index: true, Component: Home }],
  },
  { path: "/sign-in", Component: SignIn },
  { path: "/sign-up", Component: SignUp },
]);
