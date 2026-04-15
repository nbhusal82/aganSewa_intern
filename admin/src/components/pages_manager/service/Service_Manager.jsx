import { useState } from "react";
import {
  ArrowLeft,
  Pencil,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { Button } from "../../shared/Button";
import { Table } from "../../shared/Table";
import DetailsModal from "../../shared/Model";
import { Error } from "../../shared/Error";

import {
  useAddServiceMutation,
  useDeleteServiceMutation,
  useGetServicesQuery,
  useUpdateServiceMutation,
} from "../../redux/features/managerSlice";
import { getAssetUrl } from "../../../utils/assetUrl";
import Input from "../../shared/Input";

const initialState = {
  services_name: "",
  description: "",
  image: null,
};

export const ServiceManager = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { data, isLoading, isError } = useGetServicesQuery();
  const [addService, { isLoading: isSaving }] = useAddServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [formData, setFormData] = useState(initialState);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const services = data?.data || [];

  const buildPayload = () => {
    const payload = new FormData();
    payload.append("services_name", formData.services_name);
    payload.append("description", formData.description);
    payload.append("branch_id", user?.branch_id || "");
    if (formData.image) payload.append("image", formData.image);
    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = buildPayload();
      if (editId) {
        await updateService({ id: editId, data: payload }).unwrap();
        toast.success("Service updated successfully");
      } else {
        await addService(payload).unwrap();
        toast.success("Service added successfully");
      }
      handleCloseModal();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save service");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setFormData(initialState);
  };
  const handleDelete = async () => {
    if (confirmText !== "DELETE") return;

    try {
      await deleteService(deleteId).unwrap();
      toast.success("Service deleted successfully");
      setShowDeleteModal(false);
      setDeleteId(null);
      setConfirmText("");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete service");
    }
  };

  const handleEdit = (service) => {
    setEditId(service.services_id);
    setFormData({
      services_name: service.services_name || "",
      description: service.description || "",
      image: null,
    });
    setIsModalOpen(true);
  };

  if (isError) return <Error message="Failed to load services." />;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("/manager/dashboard")}
            variant="teal"
            className="h-10 w-10 rounded-full p-0"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Services</h1>
            <p className="text-sm text-slate-500">
              Manage your branch offerings
            </p>
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
          Add Service
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table
          columns={[
            { key: "name", header: "Service" },
            { key: "desc", header: "Description" },
            { key: "img", header: "Media" },
            { key: "act", header: "Actions" },
          ]}
          data={services}
          renderRow={
            isLoading
              ? null
              : (service) => (
                  <tr
                    key={service.services_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-800 border-b border-gray-100">
                      {service.services_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 border-b border-gray-100 max-w-xs truncate">
                      {service.description}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      {service.image ? (
                        <a
                          href={getAssetUrl(service.image)}
                          target="_blank"
                          className="text-teal-600 text-sm hover:underline"
                        >
                          View Image
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(service)}
                          size="sm"
                          variant="muted"
                          icon={Pencil}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => {
                            setDeleteId(service.services_id);
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
      </div>

      {/* Modern Form Modal */}
      <DetailsModal
        show={isModalOpen}
        onClose={handleCloseModal}
        title={editId ? "Edit Service" : "Add New Service"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Using your custom Input Component */}
          <Input
            label="Service Name"
            placeholder="e.g. Premium Room Cleaning"
            required
            value={formData.services_name}
            onChange={(e) =>
              setFormData({ ...formData, services_name: e.target.value })
            }
          />

          <div className="flex flex-col text-left space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Description
            </label>
            <textarea
              required
              rows={4}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10"
              placeholder="Describe this service..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* Styled File Upload */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 text-left block">
              Cover Image
            </label>
            <div
              className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all p-8 ${formData.image ? "border-teal-500 bg-teal-50/30" : "border-gray-300 bg-gray-50"}`}
            >
              <Upload
                className={formData.image ? "text-teal-500" : "text-gray-400"}
                size={28}
              />
              <p className="mt-2 text-sm text-gray-600">
                {formData.image ? (
                  <span className="font-bold">{formData.image.name}</span>
                ) : (
                  "Click to upload image"
                )}
              </p>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    image: e.target.files?.[0] || null,
                  })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t pt-6">
            <Button type="button" onClick={handleCloseModal} variant="muted">
              Cancel
            </Button>
            <Button type="submit" loading={editId ? isUpdating : isSaving}>
              {editId ? "Update Service" : "Save Service"}
            </Button>
          </div>
        </form>
      </DetailsModal>

      {/* Delete Modal */}
      <DetailsModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Are you sure?"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Type <span className="font-bold">DELETE</span> to confirm.
          </p>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="text-center font-bold tracking-widest"
          />
          <div className="flex justify-end gap-2">
            <Button onClick={() => setShowDeleteModal(false)} variant="muted">
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              loading={isDeleting}
              disabled={confirmText !== "DELETE"}
              variant="danger"
            >
              Confirm
            </Button>
          </div>
        </div>
      </DetailsModal>
    </div>
  );
};

export default ServiceManager;
