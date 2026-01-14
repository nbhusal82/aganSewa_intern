import Services from "../components/pages/BranchServices";
import Home from "../components/public/Home";
import Login from "../components/shared/Login";

export const publicRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/services/:place",
    element: <Services />,
  },
];
