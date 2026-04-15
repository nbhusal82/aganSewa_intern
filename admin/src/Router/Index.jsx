import { createBrowserRouter } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { adminRoutes } from "./AdminRoutes";
import { managerRoutes } from "./ManagerRoutes";
import { Adminlayout } from "../Layout/Admin";
import Login from "../components/Login";
import NOTFound from "../components/shared/NotFound";
import { Guard } from "./Guard";
import { ManagerGuard } from "./ManagerGuard";

export const router = createBrowserRouter([
  {
    path: "/admin",
    element: (
      <Guard>
        <Adminlayout />
      </Guard>
    ),
    children: adminRoutes,
  },
  {
    path: "/manager",
    element: (
      <ManagerGuard>
        <Adminlayout />
      </ManagerGuard>
    ),
    children: managerRoutes,
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
