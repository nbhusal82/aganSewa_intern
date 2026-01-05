import Dashboard from "../components/Dashboard";
import Branch from "../components/pages/branch/Branchdas";
import District from "../components/pages/district/Districtdash";
import Province from "../components/pages/provience/ProvienceDashboard";
import Manager from "../components/pages/user/Manager";
import Profile from "../components/pages/user/Profile";

export const adminRoutes = [
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "province",
    element: <Province />,
  },
  {
    path: "district",
    element: <District />,
  },
  {
    path: "branch",
    element: <Branch />,
  },
  {
    path: "manager",
    element: <Manager />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
 
];
