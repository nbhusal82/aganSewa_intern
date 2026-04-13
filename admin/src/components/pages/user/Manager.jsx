import { useState } from "react";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Error } from "../../shared/Error";
import DetailsModal from "../../shared/Model";
import { Button } from "../../shared/Button";
import { Table } from "../../shared/Table";
import {
  useAddmanagerMutation,
  useDeletemanagerMutation,
  useGetmanagerQuery,
  useUpdatemanagerMutation,
} from "../../redux/features/districtslice";
import {
  useGetBranchesQuery,
  useGetPDBQuery,
  useGetProvienceQuery,
} from "../../redux/features/branchSlice";

const Manager = () => {
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.user);
  const initialState = {
    name: "",
    email: "",
    password: "",
    district_id: "",
    branch_id: "",
    province_id: "",
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const filterProvince = "";
  const [confirmText, setConfirmText] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "" });

  const { data, isLoading, isError } = useGetmanagerQuery();
  const { data: branchData } = useGetBranchesQuery();
  const { data: districtData } = useGetPDBQuery(
    { province_id: formData.province_id },
    { skip: !formData.province_id },
  );
  const { data: branchFilteredData } = useGetPDBQuery(
    { district_id: formData.district_id },
    { skip: !formData.district_id },
  );
  const { data: provinceData } = useGetProvienceQuery();

  const [addManager, { isLoading: isSaving }] = useAddmanagerMutation();
  const [deleteManager, { isLoading: isDeleting }] =
    useDeletemanagerMutation();
  const [updateManager, { isLoading: isUpdating }] =
    useUpdatemanagerMutation();

  const managers = data?.data || [];
  const branches = branchData?.data || [];
  const districts = districtData?.data || [];
  const filteredBranchesFromAPI = branchFilteredData?.data || [];
  const provinces = provinceData?.data || [];

  const filteredManagers = filterProvince
    ? managers.filter((manager) => {
        const branch = branches.find((item) => item.branch_id === manager.branch_id);
        return branch?.province_id === parseInt(filterProvince);
      })
    : managers;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addManager(formData).unwrap();
      toast.success("Branch manager added successfully");
      setIsModalOpen(false);
      setFormData(initialState);
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

  const handleEdit = (manager) => {
    setEditId(manager.user_id);
    setEditData({ name: manager.name, email: manager.email });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateManager({ id: editId, ...editData }).unwrap();
      toast.success("Manager updated successfully");
      setShowEditModal(false);
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
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
          <h1 className="text-2xl font-bold">Branch Managers</h1>
        </div>

        {role === "admin" && (
          <Button onClick={() => setIsModalOpen(true)} >
            Add Manager
          </Button>
        )}
      </div>

      <Table
        columns={[
          { key: "name", header: "Name" },
          { key: "email", header: "Email" },
          { key: "branch", header: "Branch Name" },
          { key: "actions", header: "Actions" },
        ]}
        data={filteredManagers}
        renderRow={
          isLoading
            ? null
            : (manager) => {
                const branch = branches.find(
                  (item) => item.branch_id === manager.branch_id
                );

                return (
                  <tr key={manager.user_id} className="odd:bg-gray-50">
                    <td className="border-r border-gray-200 px-4 py-3 font-medium text-slate-900">
                      {manager.name}
                    </td>
                    <td className="border-r border-gray-200 px-4 py-3 text-slate-700">
                      {manager.email}
                    </td>
                    <td className="border-r border-gray-200 px-4 py-3 text-slate-700">
                      {branch?.branch_name || manager.branch_name || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(manager)}
                          size="sm"
                          icon={Pencil}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => {
                            setDeleteId(manager.user_id);
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
                );
              }
        }
      />

      <DetailsModal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Branch Manager"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <select
            className="w-full rounded border p-2"
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
            {provinces.map((province) => (
              <option key={province.province_id} value={province.province_id}>
                {province.province_name}
              </option>
            ))}
          </select>

          <select
            className="w-full rounded border p-2"
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
            {districts.map((district) => (
              <option key={district.district_id} value={district.district_id}>
                {district.district_name}
              </option>
            ))}
          </select>

          <select
            className="w-full rounded border p-2"
            value={formData.branch_id}
            onChange={(e) =>
              setFormData({ ...formData, branch_id: e.target.value })
            }
          >
            <option value="">Select Branch</option>
            {filteredBranchesFromAPI.map((branch) => (
              <option key={branch.branch_id} value={branch.branch_id}>
                {branch.branch_name}
              </option>
            ))}
          </select>

          <input
            placeholder="Name"
            value={formData.name}
            className="w-full rounded border p-2"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <input
            placeholder="Email"
            value={formData.email}
            className="w-full rounded border p-2"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            className="w-full rounded border p-2"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setFormData(initialState);
              }}
              variant="muted"
            >
              Cancel
            </Button>
            <Button type="submit" loading={isSaving} loadingText="Saving...">
              Add
            </Button>
          </div>
        </form>
      </DetailsModal>

      <DetailsModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Manager"
        size="md"
      >
        <form onSubmit={handleUpdate} className="space-y-3">
          <input
            placeholder="Name"
            value={editData.name}
            className="w-full rounded border p-2"
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />
          <input
            placeholder="Email"
            value={editData.email}
            className="w-full rounded border p-2"
            onChange={(e) =>
              setEditData({ ...editData, email: e.target.value })
            }
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              onClick={() => setShowEditModal(false)}
              variant="muted"
            >
              Cancel
            </Button>
            <Button type="submit" loading={isUpdating} loadingText="Updating...">
              Update
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
              Delete Manager
            </Button>
          </div>
        </div>
      </DetailsModal>
    </div>
  );
};

export default Manager;
