import Home from "../components/public/Home";
import Login from "../components/shared/Login";



export const publicRoutes = [
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
];
