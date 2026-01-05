import { useState } from "react";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Loading } from "../../shared/Loading";
import { Error } from "../../shared/Error";
import DetailsModal from "../../shared/Model";
import { toast } from "react-toastify";
import {
  useAddbranchMutation,
  useDeletebranchMutation,
  useGetBranchesQuery,
  useGetProvienceQuery,
  useUpdatebranchMutation,
} from "../../redux/features/branchSlice";
import { useGetdistrictQuery } from "../../redux/features/districtslice";

const Branch = () => {
  const navigate = useNavigate();

  const { data: branchData, isLoading, isError } = useGetBranchesQuery();
  const { data: districtData } = useGetdistrictQuery();
  const { data: provinceData } = useGetProvienceQuery();
  const branches = branchData?.data || [];
  const districts = districtData?.data || [];
  const provinces = provinceData?.data || [];

  const [addBranch] = useAddbranchMutation();
  const [updateBranch] = useUpdatebranchMutation();
  const [deleteBranch] = useDeletebranchMutation();

  const initialState = {
    branch_name: "",
    district_id: "",
    province_id: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterProvince] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  // Filter districts based on selected province in form
  const filteredDistricts = formData.province_id
    ? districts.filter((d) => d.province_id === parseInt(formData.province_id))
    : districts;

  // Filter branches based on selected province filter
  const filteredBranches = filterProvince
    ? branches.filter((b) => b.province_id === parseInt(filterProvince))
    : branches;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.branch_name ||
      !formData.district_id ||
      !formData.province_id
    ) {
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
      province_id: branch.province_id,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteBranch(deleteId).unwrap();
      toast.success("Branch deleted successfully");
      setShowDeleteModal(false);
      setConfirmText("");
      setDeleteId(null);
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
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
            {filteredBranches.map((b) => (
              <tr key={b.branch_id} className="border-t hover:bg-emerald-50">
                <td className="px-6 py-3">{b.branch_id}</td>
                <td className="px-6 py-3 font-medium">{b.branch_name}</td>
                <td className="px-6 py-3">{b.district_name}</td>
                {/* <td className="px-6 py-3">{b.province_name}</td> */}
                <td className="px-6 py-3 flex gap-3">
                  <button
                    onClick={() => handleEdit(b)}
                    className="cursor-pointer flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(b.branch_id);
                      setConfirmText("");
                      setShowDeleteModal(true);
                    }}
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
      <DetailsModal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editId ? "Edit Branch" : "Add Branch"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={formData.province_id}
            onChange={(e) =>
              setFormData({ ...formData, province_id: e.target.value })
            }
            className="w-full border p-2 rounded"
          >
            <option value="">Select Province</option>
            {provinces.map((p) => (
              <option key={p.province_id} value={p.province_id}>
                {p.province_name}
              </option>
            ))}
          </select>

          <select
            value={formData.district_id}
            onChange={(e) =>
              setFormData({ ...formData, district_id: e.target.value })
            }
            className="w-full border p-2 rounded"
          >
            <option value="">Select District</option>
            {filteredDistricts.map((d) => (
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
              Delete Branch
            </button>
          </div>
        </div>
      </DetailsModal>
    </div>
  );
};

export default Branch;
