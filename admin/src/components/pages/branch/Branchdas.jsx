import { useState } from "react";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { Error } from "../../shared/Error";
import DetailsModal from "../../shared/Model";
import { Button } from "../../shared/Button";
import { Table } from "../../shared/Table";
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

  const [addBranch, { isLoading: isSaving }] = useAddbranchMutation();
  const [updateBranch, { isLoading: isUpdating }] = useUpdatebranchMutation();
  const [deleteBranch, { isLoading: isDeleting }] = useDeletebranchMutation();

  const initialState = {
    branch_name: "",
    district_id: "",
    province_id: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const filterProvince = "";
  const [confirmText, setConfirmText] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const filteredDistricts = formData.province_id
    ? districts.filter((d) => d.province_id === parseInt(formData.province_id))
    : districts;

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

  if (isError) return <Error />;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button onClick={() => navigate("/admin/dashboard")} variant="teal" icon={ArrowLeft}>
            Back
          </Button>
          <h1 className="ml-6 text-2xl font-bold">Branches</h1>
        </div>

        <Button
          onClick={() => {
            setEditId(null);
            setFormData(initialState);
            setIsModalOpen(true);
          }}
          
        >
          Add Branch
        </Button>
      </div>

      <Table
        columns={[
          { key: "id", header: "ID" },
          { key: "branch", header: "Branch" },
          { key: "district", header: "District" },
          { key: "actions", header: "Actions" },
        ]}
        data={filteredBranches}
        renderRow={
          isLoading
            ? null
            : (branch) => (
                <tr key={branch.branch_id} className="odd:bg-gray-50">
                  <td className="border-r border-gray-200 px-4 py-3">
                    {branch.branch_id}
                  </td>
                  <td className="border-r border-gray-200 px-4 py-3 font-medium text-slate-900">
                    {branch.branch_name}
                  </td>
                  <td className="border-r border-gray-200 px-4 py-3 text-slate-700">
                    {branch.district_name}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button onClick={() => handleEdit(branch)} size="sm" icon={Pencil}>
                        Edit
                      </Button>
                      <Button
                        onClick={() => {
                          setDeleteId(branch.branch_id);
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
            className="w-full rounded border p-2"
          >
            <option value="">Select Province</option>
            {provinces.map((province) => (
              <option key={province.province_id} value={province.province_id}>
                {province.province_name}
              </option>
            ))}
          </select>

          <select
            value={formData.district_id}
            onChange={(e) =>
              setFormData({ ...formData, district_id: e.target.value })
            }
            className="w-full rounded border p-2"
          >
            <option value="">Select District</option>
            {filteredDistricts.map((district) => (
              <option key={district.district_id} value={district.district_id}>
                {district.district_name}
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
              loading={editId ? isUpdating : isSaving}
              loadingText={editId ? "Updating..." : "Saving..."}
            >
              {editId ? "Update" : "Add"}
            </Button>
          </div>
        </form>
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
              Delete Branch
            </Button>
          </div>
        </div>
      </DetailsModal>
    </div>
  );
};

export default Branch;
