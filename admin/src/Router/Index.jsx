import { createBrowserRouter } from "react-router-dom";

import { adminRoutes } from "./AdminRoutes";
import { Adminlayout } from "../Layout/Admin";
import Login from "../components/Login";
import NOTFound from "../components/shared/NotFound";
import { Guard } from "./Guard";

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
    path: "/",
    element: <Login />,
  },
  {
    path: "*",
    element: <NOTFound />,
  },
]);
