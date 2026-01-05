import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export const Adminlayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div>
        <Sidebar />
      </div>
      <div className="ml-64 flex-1 bg-gray-100 min-h-screen p-6">
        <Outlet />
      </div>
    </div>
  );
};
