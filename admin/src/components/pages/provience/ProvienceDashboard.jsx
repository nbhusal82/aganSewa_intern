import { useState } from "react";
import { Plus, Trash2, Eye } from "lucide-react";
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
} from "../../redux/features/branchSlice";

import { useGetdistrictQuery } from "../../redux/features/districtslice";
import DetailsModal from "../../shared/Model";

const Province = () => {
  const { role } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const initialData = { name: "" };

  const { data, isLoading, isError } = useGetProvienceQuery();
  const { data: districtData } = useGetdistrictQuery();

  const [addProvience] = useAddProvienceMutation();
  const [deleteProvience] = useDeleteprovienceMutation();

  const provinces = data?.data || [];
  const allDistricts = districtData?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialData);

  // 🔥 NEW
  const [selectedProvinceId, setSelectedProvinceId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.warning("Province name is required");
      return;
    }

    try {
      await addProvience({ province_name: formData.name }).unwrap();
      toast.success("Province added successfully");

      setFormData(initialData);
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  /* ================= VIEW ================= */
  const handleView = (provinceId) => {
    console.log("Province ID:", provinceId);
    console.log("All provinces:", provinces);
    const province = provinces.find((p) => p.province_id === provinceId);
    console.log("Found province:", province);
    setSelectedProvince(province);
    setShowModal(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this province?")) return;

    try {
      await deleteProvience(id).unwrap();
      toast.success("Province deleted successfully");
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
            className="flex items-center gap-2 px-3 py-2 bg-teal-600 text-white rounded-lg"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <h1 className="text-2xl font-bold">Provinces</h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-amber-700 text-white px-4 py-2 rounded-full"
        >
          <Plus size={18} /> Add Province
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-purple-100">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {provinces.map((province) => {
              const filteredDistricts = allDistricts.filter(
                (d) => d.province_id === province.province_id
              );

              return (
                <>
                  <tr key={province.province_id}>
                    <td className="px-6 py-4">{province.province_id}</td>
                    <td className="px-6 py-4 font-medium">
                      {province.province_name}
                    </td>

                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleView(province.province_id)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full"
                      >
                        <Eye size={14} /> View
                      </button>

                      <button
                        onClick={() => handleDelete(province.province_id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-full"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white w-96 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Add Province</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Province Name"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                className="w-full p-2 border rounded-lg"
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
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISTRICTS MODAL */}
      <DetailsModal
        show={showModal}
        onClose={() => {
          console.log("Closing modal");
          setShowModal(false);
        }}
        title={
          selectedProvince
            ? `Districts in ${selectedProvince.province_name}`
            : "Districts"
        }
        size="lg"
      >
        <div className="space-y-3">
          {selectedProvince ? (
            allDistricts.filter(
              (d) => d.province_id === selectedProvince.province_id
            ).length > 0 ? (
              allDistricts
                .filter((d) => d.province_id === selectedProvince.province_id)
                .map((district) => (
                  <div
                    key={district.district_id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border"
                  >
                    <span className="text-sm text-gray-600 font-mono">
                      #{district.district_id}
                    </span>
                    <span className="font-medium text-gray-800">
                      {district.district_name}
                    </span>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 italic text-center py-4">
                No districts found in this province
              </p>
            )
          ) : (
            <p className="text-gray-500 italic text-center py-4">Loading...</p>
          )}
        </div>
      </DetailsModal>
    </div>
  );
};

export default Province;
