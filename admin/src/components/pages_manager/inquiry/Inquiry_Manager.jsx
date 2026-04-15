import { useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Button } from "../../shared/Button";
import { Table } from "../../shared/Table";
import DetailsModal from "../../shared/Model";
import { Error } from "../../shared/Error";
import {
  useDeleteInquiryMutation,
  useGetInquiriesQuery,
} from "../../redux/features/managerSlice";

export const InquiryManager = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetInquiriesQuery();
  const [deleteInquiry, { isLoading: isDeleting }] = useDeleteInquiryMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const inquiries = data?.data || [];

  const handleDelete = async () => {
    try {
      await deleteInquiry(deleteId).unwrap();
      toast.success("Inquiry deleted successfully");
      setShowDeleteModal(false);
      setDeleteId(null);
      setConfirmText("");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete inquiry");
    }
  };

  if (isError) return <Error message="Failed to load inquiries." />;

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
          <h1 className="ml-6 text-2xl font-bold">Inquiries</h1>
        </div>
      </div>

      <Table
        columns={[
          { key: "name", header: "Name" },
          { key: "phone", header: "Phone" },
          { key: "email", header: "Email" },
          { key: "address", header: "Address" },
          { key: "description", header: "Description" },
          { key: "actions", header: "Actions" },
        ]}
        data={inquiries}
        emptyMessage="No inquiries available."
        renderRow={
          isLoading
            ? null
            : (inquiry) => (
                <tr key={inquiry.inquiry_id} className="odd:bg-gray-50">
                  <td className="border-r border-gray-200 px-4 py-3 font-medium text-slate-900">
                    {inquiry.name}
                  </td>
                  <td className="border-r border-gray-200 px-4 py-3 text-slate-700">
                    {inquiry.phone}
                  </td>
                  <td className="border-r border-gray-200 px-4 py-3 text-slate-700">
                    {inquiry.email || "-"}
                  </td>
                  <td className="border-r border-gray-200 px-4 py-3 text-slate-700">
                    <div className="max-w-xs whitespace-normal">
                      {inquiry.address}
                    </div>
                  </td>
                  <td className="border-r border-gray-200 px-4 py-3 text-slate-700">
                    <div className="max-w-md whitespace-normal">
                      {inquiry.description}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      onClick={() => {
                        setDeleteId(inquiry.inquiry_id);
                        setConfirmText("");
                        setShowDeleteModal(true);
                      }}
                      size="sm"
                      variant="danger"
                      icon={Trash2}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              )
        }
      />

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
              Delete Inquiry
            </Button>
          </div>
        </div>
      </DetailsModal>
    </div>
  );
};

export default InquiryManager;
