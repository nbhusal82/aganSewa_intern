import { useState } from "react";
import { ArrowLeft, Eye, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { Error } from "../../shared/Error";
import DetailsModal from "../../shared/Model";
import { Button } from "../../shared/Button";
import { Table } from "../../shared/Table";
import {
  useAdddistrictMutation,
  useDeletedistrictMutation,
  useGetdistrictQuery,
} from "../../redux/features/districtslice";
import {
  useGetBranchesQuery,
  useGetProvienceQuery,
} from "../../redux/features/branchSlice";

const District = () => {
  const navigate = useNavigate();

  const { data: districtData, isLoading, isError } = useGetdistrictQuery();
  const { data: provinceData } = useGetProvienceQuery();
  const { data: branchData } = useGetBranchesQuery();

  const districts = districtData?.data || [];
  const provinces = provinceData?.data || [];
  const allBranches = branchData?.data || [];

  const [addDistrict, { isLoading: isSaving }] = useAdddistrictMutation();
  const [deleteDistrict, { isLoading: isDeleting }] =
    useDeletedistrictMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [confirmText, setConfirmText] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
      await addDistrict(formData).unwrap();
      toast.success("District added");
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

  const handleDelete = async () => {
    try {
      await deleteDistrict(deleteId).unwrap();
      toast.success("District deleted successfully");
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
          <h1 className="text-2xl font-bold">Districts</h1>
        </div>

        <Button
          onClick={() => {
            setFormData(initialState);
            setIsModalOpen(true);
          }}
        >
          Add District
        </Button>
      </div>

      <Table
        columns={[
          { key: "id", header: "ID" },
          { key: "district", header: "District" },
          { key: "province", header: "Province" },
          { key: "actions", header: "Actions" },
        ]}
        data={districts}
        renderRow={
          isLoading
            ? null
            : (district) => (
                <tr key={district.district_id} className="odd:bg-gray-50">
                  <td className="border-r border-gray-200 px-4 py-3">
                    {district.district_id}
                  </td>
                  <td className="border-r border-gray-200 px-4 py-3 font-medium text-slate-900">
                    {district.district_name}
                  </td>
                  <td className="border-r border-gray-200 px-4 py-3 text-slate-700">
                    {district.province_name}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleView(district)}
                        size="sm"
                        icon={Eye}
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => {
                          setDeleteId(district.district_id);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-xl bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Add District</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                value={formData.province_id}
                onChange={(e) =>
                  setFormData({ ...formData, province_id: e.target.value })
                }
                className="w-full rounded border p-2"
              >
                <option value="">Select Province</option>
                {provinces.map((province) => (
                  <option
                    key={province.province_id}
                    value={province.province_id}
                  >
                    {province.province_name}
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
                className="w-full rounded border p-2"
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
        show={showBranchModal}
        onClose={() => setShowBranchModal(false)}
        title={
          selectedDistrict
            ? `Branches in ${selectedDistrict.district_name}`
            : "Branches"
        }
        size="lg"
      >
        <div className="space-y-3">
          {selectedDistrict ? (
            allBranches.filter(
              (branch) => branch.district_id === selectedDistrict.district_id,
            ).length > 0 ? (
              allBranches
                .filter(
                  (branch) =>
                    branch.district_id === selectedDistrict.district_id,
                )
                .map((branch) => (
                  <div
                    key={branch.branch_id}
                    className="flex items-center gap-3 rounded-lg border bg-gray-50 p-3"
                  >
                    <span className="font-mono text-sm text-gray-600">
                      #{branch.branch_id}
                    </span>
                    <span className="font-medium text-gray-800">
                      {branch.branch_name}
                    </span>
                  </div>
                ))
            ) : (
              <p className="py-4 text-center italic text-gray-500">
                No branches found in this district
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
              Delete District
            </Button>
          </div>
        </div>
      </DetailsModal>
    </div>
  );
};

export default District;
