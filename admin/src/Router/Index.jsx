import { createBrowserRouter } from "react-router-dom";

import { adminRoutes } from "./AdminRoutes";
import { Adminlayout } from "../Layout/Admin";
import Login from "../components/Login";
import NOTFound from "../components/shared/NotFound";

export const router = createBrowserRouter([
  {
    path: "/admin",
    element: <Adminlayout />,
    children: adminRoutes,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "*",
    element: <NOTFound />,
  },
]);
