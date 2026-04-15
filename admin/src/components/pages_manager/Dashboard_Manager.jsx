import { Building2, Briefcase, Image, MessageSquare, UserCog } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetBranchesQuery } from "../redux/features/branchSlice";
import {
  useGetGalleryQuery,
  useGetInquiriesQuery,
  useGetServicesQuery,
  useGetStaffsQuery,
} from "../redux/features/managerSlice";

const modules = [
  { title: "Branch", path: "/manager/branch", icon: Building2 },
  { title: "Services", path: "/manager/service", icon: Briefcase },
  { title: "Inquiries", path: "/manager/inquiry", icon: MessageSquare },
  { title: "Staff", path: "/manager/staff", icon: UserCog },
  { title: "Gallery", path: "/manager/gallery", icon: Image },
];

export const Dashboard_Manager = () => {
  const { data: branchData } = useGetBranchesQuery();
  const { data: serviceData } = useGetServicesQuery();
  const { data: inquiryData } = useGetInquiriesQuery();
  const { data: staffData } = useGetStaffsQuery();
  const { data: galleryData } = useGetGalleryQuery();

  const stats = [
    { label: "Branch", value: branchData?.data?.length || 0 },
    { label: "Services", value: serviceData?.data?.length || 0 },
    { label: "Inquiries", value: inquiryData?.data?.length || 0 },
    { label: "Staff", value: staffData?.data?.length || 0 },
    { label: "Gallery", value: galleryData?.data?.length || 0 },
  ];

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-linear-to-r from-slate-900 via-slate-800 to-orange-600 p-8 text-white shadow-sm">
        <p className="text-sm uppercase tracking-[0.25em] text-orange-200">
          Aagan Sewa
        </p>
        <h1 className="mt-3 text-3xl font-bold">Manager Dashboard</h1>
        <p className="mt-3 max-w-2xl text-slate-200">
          Welcome to the manager workspace. Use the sidebar to manage branch
          operations, staff coordination, services, inquiries, and gallery
          content.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((card) => (
          <article
            key={card.label}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <p className="text-sm text-slate-500">{card.label}</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {card.value}
            </h2>
          </article>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <Link
              key={module.path}
              to={module.path}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <Icon size={22} />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                {module.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Open the {module.title.toLowerCase()} module and manage your
                branch data with the same table workflow as the admin panel.
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
