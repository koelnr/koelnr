import { createBrowserRouter } from "react-router";
import { RootLayout } from ".";
import { Home } from "./home";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [{ index: true, Component: Home }],
  },
]);
