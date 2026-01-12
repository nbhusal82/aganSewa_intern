import { Outlet } from "react-router-dom";

export const Adminlayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      <div className="ml-64 flex-1 bg-gray-100 min-h-screen p-6">
        <Outlet />
      </div>
    </div>
  );
};
