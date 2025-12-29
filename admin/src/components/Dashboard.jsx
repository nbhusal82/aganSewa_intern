import { useEffect } from "react";
import {
  Users,
  Building2,
  Wrench,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useLogoutMutation } from "./redux/features/authSlice";
import { logout } from "./redux/features/authState";
import { toast } from "react-toastify";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth } = useSelector((state) => state.user);

  const [logoutMutation] = useLogoutMutation();

  useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
  }, [isAuth, navigate]);

  const handlelogout = async () => {
    try {
      dispatch(logout());
      const res = await logoutMutation().unwrap();
      toast.success(res.message || "Logged Out Successfully");
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.message || "Logout Failed");
    }
  };
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          AganSewa
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem icon={<LayoutDashboard />} text="Dashboard" />
          <SidebarItem icon={<Users />} text="Users" />
          <SidebarItem icon={<Building2 />} text="Provinces" />
          <SidebarItem icon={<Building2 />} text="Districts" />
          <SidebarItem icon={<Building2 />} text="Branches" />
          <SidebarItem icon={<Wrench />} text="Services" />
        </nav>

        <button
          onClick={handlelogout}
          className="flex items-center gap-2 p-4 hover:bg-red-600 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="text-gray-600 font-medium">Welcome, Admin 👋</div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Users" value="1,240" />

          <StatCard title="Branches" value="18" />
          <StatCard title="Services" value="42" />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <ul className="space-y-3 text-gray-600">
            <li>✔ New branch added – Kathmandu</li>
            <li>✔ Service updated – Fire Inspection</li>
            <li>✔ New admin user created</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, text }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-800 transition">
    {icon}
    <span>{text}</span>
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
    <h3 className="text-gray-500 text-sm">{title}</h3>
    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
  </div>
);

export default Dashboard;
