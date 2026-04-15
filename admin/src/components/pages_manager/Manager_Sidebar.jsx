import { NavLink, useNavigate } from "react-router-dom";
import { Building2, Briefcase, MessageSquare, UserCog, Image, LogOut, Home } from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useLogoutMutation } from "../redux/features/authSlice";
import { Button } from "../shared/Button";
import { logout } from "../redux/features/authState";

const ManagerSidebar = () => {
  const menu = [
    { name: "Dashboard", path: "/manager/dashboard", icon: Home },
    { name: "Branch", path: "/manager/branch", icon: Building2 },
    { name: "Service", path: "/manager/service", icon: Briefcase },
    { name: "Inquiry", path: "/manager/inquiry", icon: MessageSquare },
    { name: "Staff", path: "/manager/staff", icon: UserCog },
    { name: "Gallery", path: "/manager/gallery", icon: Image },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
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
      <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-slate-700">
        Agan Sewa
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive ? "bg-orange-600 text-white" : "hover:bg-slate-800"
                }`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <Button
          onClick={handleLogout}
          variant="danger"
          icon={LogOut}
          loading={isLoggingOut}
          loadingText="Logging out..."
          className="w-full justify-start"
        >
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default ManagerSidebar;
