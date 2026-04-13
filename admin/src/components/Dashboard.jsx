import {
  ArrowRight,
  Building2,
  Map,
  MapPin,
  Shield,
  User,
  Users,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  useGetBranchesQuery,
  useGetProvienceQuery,
} from "./redux/features/branchSlice";
import {
  useGetdistrictQuery,
  useGetmanagerQuery,
} from "./redux/features/districtslice";
import { Button } from "./shared/Button";
import { Error } from "./shared/Error";
import { Table } from "./shared/Table";

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const {
    data: provinceData,
    isLoading: provincesLoading,
    isError: provincesError,
  } = useGetProvienceQuery();
  const {
    data: districtData,
    isLoading: districtsLoading,
    isError: districtsError,
  } = useGetdistrictQuery();
  const {
    data: branchData,
    isLoading: branchesLoading,
    isError: branchesError,
  } = useGetBranchesQuery();
  const {
    data: managerData,
    isLoading: managersLoading,
    isError: managersError,
  } = useGetmanagerQuery();

  const provinces = provinceData?.data || [];
  const districts = districtData?.data || [];
  const branches = branchData?.data || [];
  const managers = managerData?.data || [];

  const isLoading =
    provincesLoading || districtsLoading || branchesLoading || managersLoading;
  const hasError =
    provincesError || districtsError || branchesError || managersError;

  const stats = [
    {
      title: "Total Provinces",
      value: provinces.length,
      detail: "Base geographic setup",
      icon: Map,
      tone: "bg-orange-50 text-orange-600",
    },
    {
      title: "Total Districts",
      value: districts.length,
      detail: "District coverage count",
      icon: MapPin,
      tone: "bg-sky-50 text-sky-600",
    },
    {
      title: "Total Branches",
      value: branches.length,
      detail: "Operational branch network",
      icon: Building2,
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Branch Managers",
      value: managers.length,
      detail: "Assigned manager accounts",
      icon: Users,
      tone: "bg-violet-50 text-violet-600",
    },
  ];

  const quickLinks = [
    {
      label: "Manage Provinces",
      description: "Create and review provinces",
      path: "/admin/province",
    },
    {
      label: "Manage Districts",
      description: "Track districts and linked branches",
      path: "/admin/district",
    },
    {
      label: "Manage Branches",
      description: "Maintain branch records",
      path: "/admin/branch",
    },
    {
      label: "Manage Managers",
      description: "Update branch manager accounts",
      path: "/admin/manager",
    },
  ];

  if (hasError) return <Error message="Failed to load dashboard data." />;

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            Admin Overview
          </p>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Central place to monitor the full province, district, branch, and
            manager setup.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Signed In As
          </p>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white">
              <User size={18} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                {user?.name || "Admin"}
              </p>
              <p className="text-sm capitalize text-slate-500">
                {user?.role || "administrator"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {item.title}
                  </p>
                  <p className="mt-3 text-3xl font-bold text-slate-900">
                    {isLoading ? "--" : item.value}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">{item.detail}</p>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.tone}`}
                >
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
            <p className="text-sm text-slate-500">
              Open core admin modules with the same shared controls.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {quickLinks.map((item) => (
              <div
                key={item.path}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <h3 className="font-semibold text-slate-900">{item.label}</h3>
                <p className="mt-2 text-sm text-slate-500">
                  {item.description}
                </p>
                <div className="mt-4">
                  <Button
                    onClick={() => navigate(item.path)}
                    variant="secondary"
                    icon={ArrowRight}
                  >
                    Open
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Shield size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                System Snapshot
              </h2>
              <p className="text-sm text-slate-500">
                Quick view of current admin-side structure.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Province to District Ratio
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {provinces.length || 0} : {districts.length || 0}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Branches per Manager
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {managers.length
                  ? (branches.length / managers.length).toFixed(1)
                  : "0.0"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Latest Branch
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {branches.at(-1)?.branch_name || "No branch data"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Table
          columns={[
            { key: "branch", header: "Recent Branches" },
            { key: "district", header: "District" },
          ]}
          data={branches.slice(0, 5)}
          emptyMessage="No branch records available."
          renderRow={
            isLoading
              ? null
              : (branch) => (
                  <tr key={branch.branch_id} className="odd:bg-gray-50">
                    <td className="border-r border-gray-200 px-4 py-3 font-medium text-slate-900">
                      {branch.branch_name}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {branch.district_name || "N/A"}
                    </td>
                  </tr>
                )
          }
        />

        <Table
          columns={[
            { key: "manager", header: "Managers" },
            { key: "email", header: "Email" },
          ]}
          data={managers.slice(0, 5)}
          emptyMessage="No manager records available."
          renderRow={
            isLoading
              ? null
              : (manager) => (
                  <tr key={manager.user_id} className="odd:bg-gray-50">
                    <td className="border-r border-gray-200 px-4 py-3 font-medium text-slate-900">
                      {manager.name}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {manager.email}
                    </td>
                  </tr>
                )
          }
        />
      </div>
    </div>
  );
};

export default Dashboard;
