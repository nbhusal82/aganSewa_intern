import React, { useEffect, useState } from "react";
import Input from "./shared/Input";
import { useLoginMutation } from "./redux/features/authSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, setUser } from "./redux/features/authState";

const Login = () => {
  const [login] = useLoginMutation();
  const { isAuth } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [fromdata, setFromData] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
  }, [isAuth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fromdata.email || !fromdata.password) {
      toast.error("Please fill all filed");

      return;
    }
    try {
      const res = await login(fromdata).unwrap(); // api call by redux

      dispatch(setUser(res?.user));
      if (res.user.role === "admin") {
        toast.success("Welcome Admin");
        navigate("/admin/dashboard");
      } else {
        toast.error("You are not authorized as admin");
        dispatch(logout());
      }
    } catch (error) {
      toast.error(error.data?.message || "Login failed");
    }
  };

  const handelChange = (e) => {
    const { id, value } = e.target;
    setFromData({
      ...fromdata,
      [id]: value,
    });
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="flex flex-col items-center bg-white p-10 rounded-xl shadow-md w-96">
        {/* Login Heading */}
        <h1 className="text-3xl font-bold mb-6">LOGIN</h1>

        {/* Form */}
        <form className="flex flex-col w-full gap-5" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="text"
            placeholder="Enter the email"
            id="email"
            onChange={handelChange}
            value={fromdata.email}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter the password"
            id="password"
            onChange={handelChange}
            value={fromdata.password}
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-lg mt-3"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
