import { useEffect } from "react";
import { LogOut } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useLogoutMutation } from "./redux/features/authSlice";
import { logout } from "./redux/features/authState";
import { toast } from "react-toastify";

const Dashboard = () => {
  return (
    <div className=" w-full bg-gray-100">
      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 ml-40">
            Admin Dashboard
          </h1>
          <div className="text-gray-600 font-medium mr-45">
            Welcome, Admin 👋
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
