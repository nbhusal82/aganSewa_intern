import { useState } from "react";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";


import { Loading } from "../../shared/Loading";
import { Error } from "../../shared/Error";
import { toast } from "react-toastify";
import { useAddbranchMutation, useDeletebranchMutation, useGetBranchesQuery, useUpdatebranchMutation } from "../../redux/features/branchSlice";
import { useGetdistrictQuery } from "../../redux/features/districtslice";

const Branch = () => {
  const navigate = useNavigate();

  const { data: branchData, isLoading, isError } = useGetBranchesQuery();
  const { data: districtData } = useGetdistrictQuery();

  const branches = branchData?.data || [];
  const districts = districtData?.data || [];

  const [addBranch] = useAddbranchMutation();
  const [updateBranch] = useUpdatebranchMutation();
  const [deleteBranch] = useDeletebranchMutation();

  const initialState = {
    branch_name: "",
    district_id: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.branch_name || !formData.district_id) {
      toast.warning("All fields are required");
      return;
    }

    try {
      if (editId) {
        await updateBranch({ id: editId, ...formData }).unwrap();
        toast.success("Branch updated");
      } else {
        await addBranch(formData).unwrap();
        toast.success("Branch added");
      }

      setFormData(initialState);
      setEditId(null);
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (branch) => {
    setEditId(branch.branch_id);
    setFormData({
      branch_name: branch.branch_name,
      district_id: branch.district_id,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this branch?")) {
      try {
        await deleteBranch(id).unwrap();
        toast.success("Branch deleted successfully");
      } catch (err) {
        toast.error(err?.data?.message || "Delete failed");
      }
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <Error />;

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

          <h1 className="text-2xl font-bold ml-6">Branches</h1>
        </div>

        <button
          onClick={() => {
            setEditId(null);
            setFormData(initialState);
            setIsModalOpen(true);
          }}
          className="cursor-pointer flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full"
        >
          <Plus size={18} /> Add Branch
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-emerald-100">
            <tr>
              <th className="px-6 py-3 text-left text-emerald-800 font-semibold">
                ID
              </th>
              <th className="px-6 py-3 text-left text-emerald-800 font-semibold">
                Branch
              </th>
              <th className="px-6 py-3 text-left text-emerald-800 font-semibold">
                District
              </th>
              <th className="px-6 py-3 text-left text-emerald-800 font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {branches.map((b) => (
              <tr key={b.branch_id} className="border-t hover:bg-emerald-50">
                <td className="px-6 py-3">{b.branch_id}</td>
                <td className="px-6 py-3 font-medium">{b.branch_name}</td>
                <td className="px-6 py-3">{b.district_name}</td>
                <td className="px-6 py-3 flex gap-3">
                  <button
                    onClick={() => handleEdit(b)}
                    className="cursor-pointer flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(b.branch_id)}
                    className="cursor-pointer flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-full"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-96 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">
              {editId ? "Edit Branch" : "Add Branch"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                value={formData.district_id}
                onChange={(e) =>
                  setFormData({ ...formData, district_id: e.target.value })
                }
                className="w-full border p-2 rounded"
              >
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d.district_id} value={d.district_id}>
                    {d.district_name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Branch Name"
                value={formData.branch_name}
                onChange={(e) =>
                  setFormData({ ...formData, branch_name: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Branch;
