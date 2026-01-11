import React from "react";
import { router } from "./Router/Index";
import { ToastContainer } from "react-toastify";
import { RouterProvider } from "react-router-dom";
export default function App() {
  return (
    <div>
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
}
