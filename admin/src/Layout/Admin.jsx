import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ManagerSidebar from "../components/pages_manager/Manager_Sidebar";
import { useSelector } from "react-redux";

export const Adminlayout = () => {
  const user = useSelector((state) => state.user.user);
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div>
        {user?.role === "admin" && <Sidebar />}
        {user?.role === "manager" && <ManagerSidebar />}
      </div>
      <div className="ml-64 flex-1 bg-gray-100 min-h-screen p-6">
        <Outlet />
      </div>
    </div>
  );
};
