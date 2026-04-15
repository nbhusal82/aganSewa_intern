import { useMemo, useState } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { Button } from "../../shared/Button";
import { Table } from "../../shared/Table";
import DetailsModal from "../../shared/Model";
import { Error } from "../../shared/Error";
import { useGetdistrictQuery } from "../../redux/features/districtslice";
import {
  useGetBranchesQuery,
  useUpdatebranchMutation,
} from "../../redux/features/branchSlice";

const initialState = {
  branch_name: "",
  district_id: "",
  Remark: "",
};

export const BranchManager = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { data: branchData, isLoading, isError } = useGetBranchesQuery();
  const { data: districtData } = useGetdistrictQuery();
  const [updateBranch, { isLoading: isUpdating }] = useUpdatebranchMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [editId, setEditId] = useState(null);

  const branches = branchData?.data || [];
  const districts = districtData?.data || [];

  const branchRows = useMemo(
    () =>
      branches.filter(
        (branch) => Number(branch.branch_id) === Number(user?.branch_id)
      ),
    [branches, user?.branch_id]
  );

  const handleEdit = (branch) => {
    setEditId(branch.branch_id);
    setFormData({
      branch_name: branch.branch_name || "",
      district_id: branch.district_id || "",
      Remark: branch.Remark || branch.remark || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await updateBranch({ id: editId, ...formData }).unwrap();
      toast.success("Branch updated successfully");
      setIsModalOpen(false);
      setEditId(null);
      setFormData(initialState);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update branch");
    }
  };

  if (isError) return <Error message="Failed to load branch details." />;

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
          <h1 className="ml-6 text-2xl font-bold">My Branch</h1>
        </div>
      </div>

      <Table
        columns={[
          { key: "branch", header: "Branch" },
          { key: "district", header: "District" },
          { key: "province", header: "Province" },
          { key: "remark", header: "Remark" },
          { key: "actions", header: "Actions" },
        ]}
        data={branchRows}
        emptyMessage="No branch assigned to this manager."
        renderRow={
          isLoading
            ? null
            : (branch) => (
                <tr key={branch.branch_id} className="odd:bg-gray-50">
                  <td className="border-r border-gray-200 px-4 py-3 font-medium text-slate-900">
                    {branch.branch_name}
                  </td>
                  <td className="border-r border-gray-200 px-4 py-3 text-slate-700">
                    {branch.district_name}
                  </td>
                  <td className="border-r border-gray-200 px-4 py-3 text-slate-700">
                    {branch.province_name}
                  </td>
                  <td className="border-r border-gray-200 px-4 py-3 text-slate-700">
                    {branch.Remark || branch.remark || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <Button onClick={() => handleEdit(branch)} size="sm" icon={Pencil}>
                      Edit
                    </Button>
                  </td>
                </tr>
              )
        }
      />

      <DetailsModal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Update Branch"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full rounded border p-2"
            placeholder="Branch name"
            value={formData.branch_name}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                branch_name: event.target.value,
              }))
            }
          />
          <select
            className="w-full rounded border p-2"
            value={formData.district_id}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                district_id: event.target.value,
              }))
            }
          >
            <option value="">Select district</option>
            {districts.map((district) => (
              <option key={district.district_id} value={district.district_id}>
                {district.district_name} - {district.province_name}
              </option>
            ))}
          </select>
          <textarea
            className="min-h-28 w-full rounded border p-2"
            placeholder="Remark"
            value={formData.Remark}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                Remark: event.target.value,
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
            <Button type="submit" loading={isUpdating} loadingText="Updating...">
              Update Branch
            </Button>
          </div>
        </form>
      </DetailsModal>
    </div>
  );
};

export default BranchManager;
