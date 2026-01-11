import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Loading } from "../../shared/Loading";
import { Error } from "../../shared/Error";
import DetailsModal from "../../shared/Model";
import {
  useAddmanagerMutation,
  useDeletemanagerMutation,
  useGetdistrictQuery,
  useGetmanagerQuery,
} from "../../redux/features/districtslice";
import {
  useGetBranchesQuery,
  useGetProvienceQuery,
  useGetPDBQuery,
} from "../../redux/features/branchSlice";

const Manager = () => {
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.user);
  const initialstate = {
    name: "",
    email: "",
    password: "",
    district_id: "",
    branch_id: "",
    province_id: "",
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialstate);
  const [filterProvince, setFilterProvince] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data, isLoading, isError } = useGetmanagerQuery();
  const { data: branchData } = useGetBranchesQuery();
  const { data: districtData } = useGetPDBQuery(
    { province_id: formData.province_id },
    { skip: !formData.province_id }
  );
  const { data: branchFilteredData } = useGetPDBQuery(
    { district_id: formData.district_id },
    { skip: !formData.district_id }
  );
  const { data: provinceData } = useGetProvienceQuery();
  const [addManager] = useAddmanagerMutation();
  const [deleteManager] = useDeletemanagerMutation();

  const managers = data?.data || [];
  const branches = branchData?.data || [];
  const districts = districtData?.data || [];
  const filteredBranchesFromAPI = branchFilteredData?.data || [];
  const provinces = provinceData?.data || [];

  // Use API filtered data
  const filteredDistricts = districts;
  const filteredBranches = filteredBranchesFromAPI;

  // Filter managers based on selected province filter
  const filteredManagers = filterProvince
    ? managers.filter((m) => {
        const branch = branches.find((b) => b.branch_id === m.branch_id);
        return branch?.province_id === parseInt(filterProvince);
      })
    : managers;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addManager(formData).unwrap();
      toast.success("Branch manager added successfully");
      setIsModalOpen(false);
      setFormData(initialstate);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add manager");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteManager(deleteId).unwrap();
      toast.success("Manager deleted successfully");
      setShowDeleteModal(false);
      setConfirmText("");
      setDeleteId(null);
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  if (isLoading) return <Loading isLoading />;
  if (isError) return <Error />;

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 px-3 py-2 bg-teal-600 text-white rounded-lg"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <h1 className="text-2xl font-bold">Branch Managers</h1>
        </div>

        {role === "admin" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-amber-700 text-white px-4 py-2 rounded-full"
          >
            <Plus size={18} /> Add Manager
          </button>
        )}
      </div>

     

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold">
                Branch Name
              </th>
              
              <th className="px-6 py-3 text-left text-xs font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredManagers.map((m) => {
              const branch = branches.find((b) => b.branch_id === m.branch_id);

              return (
                <tr key={m.user_id}>
                  <td className="px-6 py-4">{m.name}</td>
                  <td className="px-6 py-4">{m.email}</td>
                  <td className="px-6 py-4">
                    {branch?.branch_name || m.branch_name || "N/A"}
                  </td>
                  
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setDeleteId(m.user_id);
                        setConfirmText("");
                        setShowDeleteModal(true);
                      }}
                      className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-full"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ADD MANAGER MODAL */}
      <DetailsModal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Branch Manager"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <select
            className="w-full p-2 border rounded"
            value={formData.province_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                province_id: e.target.value,
                district_id: "",
                branch_id: "",
              })
            }
          >
            <option value="">Select Province</option>
            {provinces.map((p) => (
              <option key={p.province_id} value={p.province_id}>
                {p.province_name}
              </option>
            ))}
          </select>

          <select
            className="w-full p-2 border rounded"
            value={formData.district_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                district_id: e.target.value,
                branch_id: "",
              })
            }
          >
            <option value="">Select District</option>
            {filteredDistricts.map((district) => (
              <option key={district.district_id} value={district.district_id}>
                {district.district_name}
              </option>
            ))}
          </select>

          <select
            className="w-full p-2 border rounded"
            value={formData.branch_id}
            onChange={(e) =>
              setFormData({ ...formData, branch_id: e.target.value })
            }
          >
            <option value="">Select Branch</option>
            {filteredBranches.map((branch) => (
              <option key={branch.branch_id} value={branch.branch_id}>
                {branch.branch_name}
              </option>
            ))}
          </select>
          
          <input
            placeholder="Name"
            className="w-full p-2 border rounded"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            placeholder="Email"
            className="w-full p-2 border rounded"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Add
            </button>
          </div>
        </form>
      </DetailsModal>

      {/* DELETE CONFIRMATION MODAL */}
      <DetailsModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            To confirm deletion, please type <strong>NABIN</strong> below:
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE to confirm"
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={confirmText !== "DELETE"}
              className={`px-4 py-2 rounded ${
                confirmText === "DELETE"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Delete Manager
            </button>
          </div>
        </div>
      </DetailsModal>
    </div>
  );
};

export default Manager;