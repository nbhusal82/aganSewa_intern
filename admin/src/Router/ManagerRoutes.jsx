import { Navigate } from "react-router-dom";
import { Dashboard_Manager } from "../components/pages_manager/Dashboard_Manager";
import { BranchManager } from "../components/pages_manager/branch/Branch_Manager";
import { ServiceManager } from "../components/pages_manager/service/Service_Manager";
import { GalleryManager } from "../components/pages_manager/gallery/Gallery_Manager";
import { InquiryManager } from "../components/pages_manager/inquiry/Inquiry_Manager";
import { StaffManager } from "../components/pages_manager/staff/Staff_Manager";

export const managerRoutes = [
  { index: true, element: <Navigate to="dashboard" replace /> },
  { path: "dashboard", element: <Dashboard_Manager /> },
  { path: "branch", element: <BranchManager /> },
  { path: "service", element: <ServiceManager /> },
  { path: "gallery", element: <GalleryManager /> },
  { path: "inquiry", element: <InquiryManager /> },
  { path: "staff", element: <StaffManager /> },
];
