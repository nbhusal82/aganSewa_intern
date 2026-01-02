import { useState } from "react";
import { ArrowLeft, Plus, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loading } from "../../shared/Loading";
import { Error } from "../../shared/Error";
import DetailsModal from "../../shared/Model";

import {
  useAdddistrictMutation,
  useDeletedistrictMutation,
  useGetdistrictQuery,
} from "../../redux/features/districtslice";
import { useGetProvienceQuery, useGetBranchesQuery } from "../../redux/features/branchSlice";

const District = () => {
  const navigate = useNavigate();

  const { data: districtData, isLoading, isError } = useGetdistrictQuery();
  const { data: provinceData } = useGetProvienceQuery();
  const { data: branchData } = useGetBranchesQuery();

  const districts = districtData?.data || [];
  const provinces = provinceData?.data || [];
  const allBranches = branchData?.data || [];

  const [addDistrict] = useAdddistrictMutation();

  const [deleteDistrict] = useDeletedistrictMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
 

  const initialState = {
    district_name: "",
    province_id: "",
  };

  const [formData, setFormData] = useState(initialState);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.district_name || !formData.province_id) {
      toast.warning("All fields are required");
      return;
    }

    try {
      {
        await addDistrict(formData).unwrap();
        toast.success("District added");
      }

      setFormData(initialState);
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  const handleView = (district) => {
    setSelectedDistrict(district);
    setShowBranchModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this district?")) {
      try {
        await deleteDistrict(id).unwrap();
        toast.success(data?.message || "District deleted successfully");
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
            title="Back to Dashboard"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <h1 className="text-2xl font-bold ml-90 ">Districts</h1>
        </div>

        <button
          onClick={() => {
            setFormData(initialState);
            setIsModalOpen(true);
          }}
          className=" cursor-pointer flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full"
        >
          <Plus size={18} /> Add District
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
                District
              </th>
              <th className="px-6 py-3 text-left text-emerald-800 font-semibold">
                Province
              </th>
              <th className="px-6 py-3 text-left text-emerald-800 font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {districts.map((d) => (
              <tr key={d.district_id} className="border-t hover:bg-emerald-50">
                <td className="px-6 py-3">{d.district_id}</td>
                <td className="px-6 py-3 font-medium">{d.district_name}</td>
                <td className="px-6 py-3">{d.province_name}</td>
                <td className="px-6 py-3 flex gap-3">
                  <button
                    onClick={() => handleView(d)}
                    className=" cursor-pointer flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full"
                  >
                    <Eye size={16} /> View
                  </button>
                  <button
                    onClick={() => handleDelete(d.district_id)}
                    className=" cursor-pointer flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-full "
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
              Add District
            </h2>

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

              <input
                type="text"
                placeholder="District Name"
                value={formData.district_name}
                onChange={(e) =>
                  setFormData({ ...formData, district_name: e.target.value })
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
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BRANCHES MODAL */}
      <DetailsModal
        show={showBranchModal}
        onClose={() => setShowBranchModal(false)}
        title={selectedDistrict ? `Branches in ${selectedDistrict.district_name}` : "Branches"}
        size="lg"
      >
        <div className="space-y-3">
          {selectedDistrict ? (
            allBranches.filter(b => b.district_id === selectedDistrict.district_id).length > 0 ? (
              allBranches
                .filter(b => b.district_id === selectedDistrict.district_id)
                .map((branch) => (
                  <div
                    key={branch.branch_id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border"
                  >
                    <span className="text-sm text-gray-600 font-mono">
                      #{branch.branch_id}
                    </span>
                    <span className="font-medium text-gray-800">
                      {branch.branch_name}
                    </span>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 italic text-center py-4">
                No branches found in this district
              </p>
            )
          ) : (
            <p className="text-gray-500 italic text-center py-4">
              Loading...
            </p>
          )}
        </div>
      </DetailsModal>
    </div>
  );
};

export default District;
