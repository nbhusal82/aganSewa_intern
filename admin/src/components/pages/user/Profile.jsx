import { useState, useEffect } from "react";
import { ArrowLeft, User, Mail, Shield, Edit, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { Loading } from "../../shared/Loading";
import { Error } from "../../shared/Error";
import DetailsModal from "../../shared/Model";
import { useUpdateProfileMutation, useChangePasswordMutation } from "../../redux/features/profileSlice";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Update form data when user changes
  useEffect(() => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
  }, [user]);

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    console.log('Attempting to save profile:', formData);
    
    try {
      const result = await updateProfile({
        name: formData.name,
        email: formData.email
      }).unwrap();
      
      console.log('Profile update success:', result);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error(err?.data?.message || err?.message || "Failed to update profile");
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    console.log('Attempting to change password');
    
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }).unwrap();
      
      console.log('Password change success');
      toast.success("Password changed successfully");
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error('Password change error:', err);
      toast.error(err?.data?.message || err?.message || "Failed to change password");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
    setIsEditing(false);
  };

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

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full"
          >
            <Edit size={18} /> Edit Profile
          </button>
        )}
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User size={40} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {user?.name || "Admin User"}
            </h2>
            <div className="flex items-center gap-2 text-gray-600">
              <Shield size={16} />
              <span className="capitalize">{user?.role || "Administrator"}</span>
            </div>
          </div>
        </div>

        {/* PROFILE DETAILS */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User size={18} className="text-gray-500" />
                <span className="text-gray-800">{user?.name || "Not provided"}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail size={18} className="text-gray-500" />
                <span className="text-gray-800">{user?.email || "Not provided"}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Shield size={18} className="text-gray-500" />
              <span className="text-gray-800 capitalize">{user?.role || "Administrator"}</span>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        {isEditing ? (
          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              <X size={18} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                isUpdating 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              <Save size={18} />
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        ) : (
          <div className="flex justify-end mt-8">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              Change Password
            </button>
          </div>
        )}
      </div>

      {/* PASSWORD CHANGE MODAL */}
      <DetailsModal
        show={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Confirm new password"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordChange}
              disabled={isChangingPassword}
              className={`px-4 py-2 rounded transition ${
                isChangingPassword
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {isChangingPassword ? "Changing..." : "Change Password"}
            </button>
          </div>
        </div>
      </DetailsModal>
    </div>
  );
};

export default Profile;