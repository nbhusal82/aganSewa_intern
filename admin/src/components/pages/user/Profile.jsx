import { useState, useEffect } from "react";
import { ArrowLeft, User, Mail, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Loading } from "../../shared/Loading";
import { Error } from "../../shared/Error";
import { useGetProfileQuery } from "../../redux/features/profileSlice";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  
  const { data: profileData, isLoading: profileLoading, error: profileError } = useGetProfileQuery();
  
  // Use profile data if available, otherwise fallback to user from state
  const currentUser = profileData?.data || user;

  // Retry loading profile if error
  useEffect(() => {
    if (profileError && user) {
      console.log('Profile load error, using user data:', user);
    }
  }, [profileError, user]);

  // Show loading only if no user data available
  if (profileLoading && !user) return <Loading />;
  
  // Show error only if no fallback data
  if (profileError && !user) return <Error message="Failed to load profile" />;

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <h1 className="text-2xl font-bold ml-6">Admin Profile</h1>
        </div>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-linear-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User size={40} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {currentUser?.name || "Admin User"}
            </h2>
            <div className="flex items-center gap-2 text-gray-600">
              <Shield size={16} />
              <span className="capitalize">{currentUser?.role || "Administrator"}</span>
            </div>
          </div>
        </div>

        {/* PROFILE DETAILS */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User size={18} className="text-gray-500" />
              <span className="text-gray-800">{currentUser?.name || "Not provided"}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail size={18} className="text-gray-500" />
              <span className="text-gray-800">{currentUser?.email || "Not provided"}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Shield size={18} className="text-gray-500" />
              <span className="text-gray-800 capitalize">{currentUser?.role || "Administrator"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;