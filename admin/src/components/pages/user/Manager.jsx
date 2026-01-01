import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Loading } from "../../shared/Loading";
import { Error } from "../../shared/Error";
import {
  useAddmanagerMutation,
  useDeletemanagerMutation,
  useGetdistrictQuery,
  useGetmanagerQuery,
} from "../../redux/features/districtslice";
import { useGetBranchesQuery } from "../../redux/features/branchSlice";

const Manager = () => {
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.user);
  const initialstate = {
    name: "",
    email: "",
    password: "",
    district_name: "",
    branch_name: "",
  };

  const { data, isLoading, isError } = useGetmanagerQuery();
  const { data: branchData } = useGetBranchesQuery();
  const { data: districtData } = useGetdistrictQuery();
  const [addManager] = useAddmanagerMutation();
  const [deleteManager] = useDeletemanagerMutation();

  const managers = data?.data || [];
  const branches = branchData?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialstate);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addManager(formData).unwrap();
      toast.success("Branch manager added successfully");
      setIsModalOpen(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        district_name: "",
        branch_name: "",
      });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add manager");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this manager?")) return;

    try {
      await deleteManager(id).unwrap();
      toast.success("Manager deleted successfully");
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
            {managers.map((m) => {
              // Find branch name from branches array
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
                      onClick={() => handleDelete(m.user_id)}
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

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white w-96 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Add Branch Manager</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                placeholder="Name"
                className="w-full p-2 border rounded"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
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
              <select
                className="w-full p-2 border rounded"
                value={formData.district_name}
                onChange={(e) =>
                  setFormData({ ...formData, district_name: e.target.value })
                }
              >
                <option value="">Select District</option>
                {branches.map((district) => (
                  <option
                    key={district.district_id}
                    value={district.district_id}
                  >
                    {district.district_name}
                  </option>
                ))}
              </select>

              <select
                className="w-full p-2 border rounded"
                value={formData.branch_name}
                onChange={(e) =>
                  setFormData({ ...formData, branch_name: e.target.value })
                }
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch.branch_id} value={branch.branch_name}>
                    {branch.branch_name}
                  </option>
                ))}
              </select>

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
          </div>
        </div>
      )}
    </div>
  );
};

export default Manager;
