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
  useAddGalleryMutation,
  useDeleteGalleryMutation,
  useGetGalleryQuery,
  useUpdateGalleryMutation,
} from "../../redux/features/managerSlice";
import { getAssetUrl } from "../../../utils/assetUrl";

const initialState = {
  title: "",
  location: "",
  images: [],
};

export const GalleryManager = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { data, isLoading, isError } = useGetGalleryQuery();
  const [addGallery, { isLoading: isSaving }] = useAddGalleryMutation();
  const [updateGallery, { isLoading: isUpdating }] = useUpdateGalleryMutation();
  const [deleteGallery, { isLoading: isDeleting }] = useDeleteGalleryMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [formData, setFormData] = useState(initialState);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const galleries = data?.data || [];

  const buildPayload = () => {
    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("location", formData.location);
    payload.append("branch_id", user?.branch_id || "");
    formData.images.forEach((image) => {
      payload.append("image", image);
    });
    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = buildPayload();
      if (editId) {
        await updateGallery({ id: editId, data: payload }).unwrap();
        toast.success("Gallery updated successfully");
      } else {
        await addGallery(payload).unwrap();
        toast.success("Gallery created successfully");
      }

      setIsModalOpen(false);
      setEditId(null);
      setFormData(initialState);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save gallery");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteGallery(deleteId).unwrap();
      toast.success("Gallery deleted successfully");
      setShowDeleteModal(false);
      setDeleteId(null);
      setConfirmText("");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete gallery");
    }
  };

  const handleEdit = (gallery) => {
    setEditId(gallery.gallery_id);
    setFormData({
      title: gallery.title || "",
      location: gallery.location || "",
      images: [],
    });
    setIsModalOpen(true);
  };

  if (isError) return <Error message="Failed to load gallery." />;

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
          <h1 className="ml-6 text-2xl font-bold">Gallery</h1>
        </div>

        <Button
          onClick={() => {
            setEditId(null);
            setFormData(initialState);
            setIsModalOpen(true);
          }}
          icon={Plus}
        >
          Add Gallery
        </Button>
      </div>

      <Table
        columns={[
          { key: "title", header: "Title" },
          { key: "location", header: "Location" },
          { key: "images", header: "Images" },
          { key: "actions", header: "Actions" },
        ]}
        data={galleries}
        emptyMessage="No gallery records available."
        renderRow={
          isLoading
            ? null
            : (gallery) => {
                const imageList = gallery.image ? gallery.image.split(",") : [];

                return (
                  <tr key={gallery.gallery_id} className="odd:bg-gray-50">
                    <td className="border-r border-gray-200 px-4 py-3 font-medium text-slate-900">
                      {gallery.title}
                    </td>
                    <td className="border-r border-gray-200 px-4 py-3 text-slate-700">
                      {gallery.location}
                    </td>
                    <td className="border-r border-gray-200 px-4 py-3 text-slate-700">
                      <div className="flex flex-col gap-1">
                        {imageList.length
                          ? imageList.map((image, index) => (
                              <a
                                key={`${gallery.gallery_id}-${index}`}
                                href={getAssetUrl(image)}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 underline"
                              >
                                Image {index + 1}
                              </a>
                            ))
                          : "No image"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button onClick={() => handleEdit(gallery)} size="sm" icon={Pencil}>
                          Edit
                        </Button>
                        <Button
                          onClick={() => {
                            setDeleteId(gallery.gallery_id);
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
        title={editId ? "Edit Gallery" : "Add Gallery"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full rounded border p-2"
            placeholder="Title"
            value={formData.title}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
          />
          <input
            className="w-full rounded border p-2"
            placeholder="Location"
            value={formData.location}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                location: event.target.value,
              }))
            }
          />
          <input
            type="file"
            multiple
            accept="image/*"
            className="w-full rounded border p-2"
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                images: Array.from(event.target.files || []),
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
              {editId ? "Update Gallery" : "Add Gallery"}
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
              Delete Gallery
            </Button>
          </div>
        </div>
      </DetailsModal>
    </div>
  );
};

export default GalleryManager;
