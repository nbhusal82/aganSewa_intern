import { NavLink, useNavigate } from "react-router-dom";
import {
  Map,
  MapPin,
  Building2,
  Users,
  UserCircle,
  LogOut,
  Home,
} from "lucide-react";
import { logout } from "./redux/features/authState";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "./redux/features/authSlice";

import { toast } from "react-toastify";

const Sidebar = () => {
  const menu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: Home },
    { name: "Province", path: "/admin/province", icon: Map },
    { name: "District", path: "/admin/district", icon: MapPin },
    { name: "Branch", path: "/admin/branch", icon: Building2 },
    { name: "Manager", path: "/admin/manager", icon: Users },
    { name: "Profile", path: "/admin/profile", icon: UserCircle },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutMutation] = useLogoutMutation();

  const handlelogout = async () => {
    try {
      const res = await logoutMutation().unwrap();
      toast.success(res.message || "Logged Out Successfully");
      dispatch(logout());
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.message || "Logout Failed");
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-slate-700">
        Agan Sewa
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menu.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${isActive ? "bg-orange-600 text-white" : "hover:bg-slate-800"}`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handlelogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-600 transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
