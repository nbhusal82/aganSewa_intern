import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export const Adminlayout = () => {
  return (
    <div className="flex">
      <Sidebar /> 

      <Outlet />
    </div>
  );
};
