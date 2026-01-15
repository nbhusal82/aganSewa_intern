import Services from "../components/pages/BranchServices";
import Home from "../components/public/Home";
import PublicServices from "../components/public/PublicServices";
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
    path: "/services",
    element: <PublicServices />,
  },
  {
    path: "/services/:place",
    element: <Services />,
  },
];
