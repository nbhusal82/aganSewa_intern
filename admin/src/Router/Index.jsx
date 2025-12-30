import { createBrowserRouter } from "react-router-dom";

import { adminRoutes } from "./AdminRoutes";
import { Adminlayout } from "../Layout/Admin";
import Login from "../components/Login";
import NOTFound from "../components/shared/NotFound";
import Province from "../components/pages/provience/ProvienceDashboard";

import District from "../components/pages/district/Districtdash";
import Branch from "../components/pages/branch/Branchdas";

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

  {
    path: "/province",
    element: <Province />,
  },
  {
    path: "/district",
    element: <District />,
  },
  {
    path: "/branch",
    element: <Branch />,
  },
]);
