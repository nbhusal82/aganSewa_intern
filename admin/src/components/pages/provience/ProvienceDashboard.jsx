import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import { Loading } from "../../shared/Loading";
import { Error } from "../../shared/Error";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  useAddProvienceMutation,
  useDeleteprovienceMutation,
  useGetProvienceQuery,
  useUpdateprovienceMutation,
} from "../../redux/features/branchSlice";

const Province = () => {
  const { role } = useSelector((state) => state.user);

  const initialData = { name: "" };
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetProvienceQuery();
  const [addProvience] = useAddProvienceMutation();
  const [updateProvience] = useUpdateprovienceMutation();
  const [deleteProvience] = useDeleteprovienceMutation();

  const provinces = data?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [editId, setEditId] = useState(null);

  /* ================= ADD / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.warning("Province name is required");
      return;
    }

    try {
      if (editId) {
        await updateProvience({
          id: editId,
          name: formData.name,
        }).unwrap();
        toast.success("Province updated successfully");
      } else {
        await addProvience({ province_name: formData.name }).unwrap();
        toast.success("Province added successfully");
      }

      setFormData(initialData);
      setEditId(null);
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (province) => {
    setEditId(province.province_id);
    setFormData({ name: province.province_name });
    setIsModalOpen(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this province?")) return;

    try {
      await deleteProvience(id).unwrap();
      toast.success(data?.message || "Province deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  if (isLoading) return <Loading isLoading={isLoading} />;
  if (isError) return <Error />;

  return (
    <div className="p-6">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition"
            title="Back to Dashboard"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <h1 className="text-2xl font-bold ml-90">Provinces</h1>
        </div>

        {role === "admin" && (
          <button
            onClick={() => {
              setFormData(initialData);
              setEditId(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-amber-700 text-white px-4 py-2 rounded-full"
          >
            <Plus size={18} /> Add Province
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-purple-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-purple-800">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-purple-800">
                Name
              </th>
              {role === "admin" && (
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-purple-800">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {provinces.length === 0 ? (
              <tr>
                <td
                  colSpan={role === "admin" ? 3 : 2}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No provinces found
                </td>
              </tr>
            ) : (
              provinces.map((province) => (
                <tr key={province.province_id} className="hover:bg-purple-50">
                  <td className="px-6 py-4">{province.province_id}</td>
                  <td className="px-6 py-4 font-medium">
                    {province.province_name}
                  </td>

                  {role === "admin" && (
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(province)}
                        className="cursor-pointer flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full"
                      >
                        <Pencil size={14} /> Edit
                      </button>

                      <button
                        onClick={() => handleDelete(province.province_id)}
                        className="cursor-pointer flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-full"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-96 p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {editId ? "Edit Province" : "Add Province"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Province Name"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
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

export default Province;
