import { RouterProvider } from "react-router-dom";

import { ToastContainer } from "react-toastify";

import { router } from "./Router/Index.jsx";

export const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
};
