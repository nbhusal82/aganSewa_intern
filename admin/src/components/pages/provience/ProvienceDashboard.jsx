import { useState } from "react";
import { ArrowLeft, Eye, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Error } from "../../shared/Error";
import DetailsModal from "../../shared/Model";
import { Button } from "../../shared/Button";
import { Table } from "../../shared/Table";
import {
  useAddProvienceMutation,
  useDeleteprovienceMutation,
  useGetProvienceQuery,
} from "../../redux/features/branchSlice";
import { useGetdistrictQuery } from "../../redux/features/districtslice";

const Province = () => {
  const { role } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const initialData = { name: "" };

  const { data, isLoading, isError } = useGetProvienceQuery();
  const { data: districtData } = useGetdistrictQuery();

  const [addProvience, { isLoading: isSaving }] = useAddProvienceMutation();
  const [deleteProvience, { isLoading: isDeleting }] =
    useDeleteprovienceMutation();

  const provinces = data?.data || [];
  const allDistricts = districtData?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [confirmText, setConfirmText] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  const handleView = (provinceId) => {
    const province = provinces.find((item) => item.province_id === provinceId);
    setSelectedProvince(province || null);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteProvience(deleteId).unwrap();
      toast.success("Province deleted successfully");
      setShowDeleteModal(false);
      setConfirmText("");
      setDeleteId(null);
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  if (isError) return <Error />;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate("/admin/dashboard")}
            variant="teal"
            icon={ArrowLeft}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold">Provinces</h1>
        </div>

        {role === "admin" && (
          <Button onClick={() => setIsModalOpen(true)}>Add Province</Button>
        )}
      </div>

      <Table
        columns={[
          { key: "id", header: "ID" },
          { key: "name", header: "Name" },
          { key: "actions", header: "Actions" },
        ]}
        data={provinces}
        renderRow={
          isLoading
            ? null
            : (province) => (
                <tr key={province.province_id} className="odd:bg-gray-50">
                  <td className="border-r border-gray-200 px-4 py-3">
                    {province.province_id}
                  </td>
                  <td className="border-r border-gray-200 px-4 py-3 font-medium text-slate-900">
                    {province.province_name}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleView(province.province_id)}
                        size="sm"
                        icon={Eye}
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => {
                          setDeleteId(province.province_id);
                          setConfirmText("");
                          setShowDeleteModal(true);
                        }}
                        size="sm"
                        variant="danger"
                        icon={Trash2}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              )
        }
      />

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="w-96 rounded-xl bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Add Province</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Province Name"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                className="w-full rounded-lg border p-2"
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  variant="muted"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isSaving}
                  loadingText="Saving..."
                >
                  Add
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DetailsModal
        show={showModal}
        onClose={() => setShowModal(false)}
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
              (district) =>
                district.province_id === selectedProvince.province_id,
            ).length > 0 ? (
              allDistricts
                .filter(
                  (district) =>
                    district.province_id === selectedProvince.province_id,
                )
                .map((district) => (
                  <div
                    key={district.district_id}
                    className="flex items-center gap-3 rounded-lg border bg-gray-50 p-3"
                  >
                    <span className="font-mono text-sm text-gray-600">
                      #{district.district_id}
                    </span>
                    <span className="font-medium text-gray-800">
                      {district.district_name}
                    </span>
                  </div>
                ))
            ) : (
              <p className="py-4 text-center italic text-gray-500">
                No districts found in this province
              </p>
            )
          ) : (
            <p className="py-4 text-center italic text-gray-500">Loading...</p>
          )}
        </div>
      </DetailsModal>

      <DetailsModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            To confirm deletion, please type <strong>DELETE</strong> below:
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE to confirm"
            className="w-full rounded border p-2"
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              variant="muted"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              loading={isDeleting}
              loadingText="Deleting..."
              disabled={confirmText !== "DELETE"}
              variant={confirmText === "DELETE" ? "danger" : "muted"}
            >
              Delete Province
            </Button>
          </div>
        </div>
      </DetailsModal>
    </div>
  );
};

export default Province;
