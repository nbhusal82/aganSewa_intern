import { useSelector } from "react-redux";
import { User, Mail, Shield } from "lucide-react";

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 ml-25">Admin Dashboard</h1>

        <div className="bg-white px-4 py-2 rounded-lg shadow text-gray-700 mr-25">
          Welcome, {user?.name || 'Admin'} 👋
        </div>
      </div>

      
    </div>
  );
};

export default Dashboard;
