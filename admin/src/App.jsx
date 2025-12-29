import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import { ToastContainer } from "react-toastify";
import NOTFound from "./components/NotFound.jsx";

export const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NOTFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
};
