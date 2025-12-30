import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export const Adminlayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div>
        <Sidebar />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};
