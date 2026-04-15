import { useState } from "react";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { Button } from "../../shared/Button";
import { Table } from "../../shared/Table";
import DetailsModal from "../../shared/Model";
import { Error } from "../../shared/Error";
import {
  useAddStaffMutation,
  useDeleteStaffMutation,
  useGetServicesQuery,
  useGetStaffsQuery,
  useUpdateStaffMutation,
} from "../../redux/features/managerSlice";
import { getAssetUrl } from "../../../utils/assetUrl";

const initialState = {
  staff_name: "",
  position: "",
  email: "",
  password: "",
  description: "",
  services_id: "",
  image: null,
};

export const StaffManager = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { data, isLoading, isError } = useGetStaffsQuery();
  const { data: servicesData } = useGetServicesQuery();
  const [addStaff, { isLoading: isSaving }] = useAddStaffMutation();
  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();
  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [formData, setFormData] = useState(initialState);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const staffs = data?.data || [];
  const services = servicesData?.data || [];

  const buildPayload = () => {
    const payload = new FormData();
    payload.append("staff_name", formData.staff_name);
    payload.append("position", formData.position);
    payload.append("description", formData.description);
    payload.append("services_id", formData.services_id);
    payload.append("branch_id", user?.branch_id || "");
    if (!editId) {
      payload.append("email", formData.email);
      payload.append("password", formData.password);
      payload.append("role", "staff");
    }
    if (formData.image) {
      payload.append("image", formData.image);
    }
    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = buildPayload();
      if (editId) {
        await updateStaff({ id: editId, data: payload }).unwrap();
        toast.success("Staff updated successfully");
      } else {
        await addStaff(payload).unwrap();
        toast.success("Staff created successfully");
      }

      setIsModalOpen(false);
      setEditId(null);
      setFormData(initialState);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save staff");
    }
  };

  const handleEdit = (staff) => {
    setEditId(staff.staff_id);
    setFormData({
      staff_name: staff.staff_name || "",
      position: staff.position || "",
      email: staff.email || "",
      password: "",
      description: staff.description || "",
      services_id: staff.services_id || "",
      image: null,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteStaff(deleteId).unwrap();
      toast.success("Staff deleted successfully");
      setShowDeleteModal(false);
      setDeleteId(null);
      setConfirmText("");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete staff");
    }
  };

  if (isError) return <Error message="Failed to load staff." />;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate("/manager/dashboard")}
            variant="teal"
            icon={ArrowLeft}
          >
            Back
          </Button>
          <h1 className="ml-6 text-2xl font-bold">Staff</h1>
        </div>

        <Button
          onClick={() => {
            setEditId(null);
            setFormData(initialState);
            setIsModalOpen(true);
          }}
          icon={Plus}
        >
          Add Staff
        </Button>
      </div>

      <Table
        columns={[
          { key: "name", header: "Name" },
          { key: "position", header: "Position" },
          { key: "email", header: "Email" },
          { key: "service", header: "Service" },
          { key: "image", header: "Image" },
          { key: "actions", header: "Actions" },
        ]}
        data={staffs}
        emptyMessage="No staff members available."
        renderRow={
          isLoading
            ? null
            : (staff) => (
                <tr key={staff.staff_id} className="odd:bg-gray-50">
                  <td className="border-r border-gray-200 px-4 py-3 font-medium text-slate-900">
                    {staff.staff_name}
                  </td>
                  <td className="border-r border-gray-200 px-4 py-3 text-slate-700">
                    {staff.position}
                  </td>
                  <td className="border-r border-gray-200 px-4 py-3 text-slate-700">
                    {staff.email}
                  </td>
                  <td className="border-r border-gray-200 px-4 py-3 text-slate-700">
                    {staff.services_name}
                  </td>
                  <td className="border-r border-gray-200 px-4 py-3 text-slate-700">
                    {staff.image ? (
                      <a
                        href={getAssetUrl(staff.image)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        View image
                      </a>
                    ) : (
                      "No image"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button onClick={() => handleEdit(staff)} size="sm" icon={Pencil}>
                        Edit
                      </Button>
                      <Button
                        onClick={() => {
                          setDeleteId(staff.staff_id);
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
        title={editId ? "Edit Staff" : "Add Staff"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full rounded border p-2"
            placeholder="Staff name"
            value={formData.staff_name}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                staff_name: event.target.value,
              }))
            }
          />
          <input
            className="w-full rounded border p-2"
            placeholder="Position"
            value={formData.position}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                position: event.target.value,
              }))
            }
          />
          <input
            className="w-full rounded border p-2"
            placeholder="Email"
            value={formData.email}
            disabled={Boolean(editId)}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
          />
          {!editId ? (
            <input
              type="password"
              className="w-full rounded border p-2"
              placeholder="Password"
              value={formData.password}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
            />
          ) : null}
          <select
            className="w-full rounded border p-2"
            value={formData.services_id}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                services_id: event.target.value,
              }))
            }
          >
            <option value="">Select service</option>
            {services.map((service) => (
              <option key={service.services_id} value={service.services_id}>
                {service.services_name}
              </option>
            ))}
          </select>
          <textarea
            className="min-h-28 w-full rounded border p-2"
            placeholder="Description"
            value={formData.description}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
          />
          <input
            type="file"
            accept="image/*"
            className="w-full rounded border p-2"
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                image: event.target.files?.[0] || null,
              }))
            }
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
              {editId ? "Update Staff" : "Add Staff"}
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
            onChange={(event) => setConfirmText(event.target.value)}
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
              Delete Staff
            </Button>
          </div>
        </div>
      </DetailsModal>
    </div>
  );
};

export default StaffManager;
