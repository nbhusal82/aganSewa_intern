import { createBrowserRouter } from "react-router-dom";

import { Guard } from "./Guard";
import PublicLayout from "../Layout/PublicLayout";

import { Adminlayout } from "../Layout/Admin";
import { adminRoutes } from "./AdminRoutes";
import { publicRoutes } from "./PublicRoutes";
import NOTFound from "../components/shared/NotFound";

export const router = createBrowserRouter([
  {
    path: "/admin",
    element: <Adminlayout />,
    children: adminRoutes,
  },
  {
    path: "",
    element: <PublicLayout />,
    children: publicRoutes,
  },
  // {
  //   path: "/",
  //   element: <Login />,
  // },
  {
    path: "*",
    element: <NOTFound />,
  },
]);
