import React, { useState } from "react";
import Input from "./shared/Input";

const Login = () => {
  const [fromdata, setFromData] = useState({
    email: "",
    password: "",
  });
        console.log(fromdata);
  const handleSubmit = (e) => {

    e.preventDefault();
    alert("hello" + fromdata.email);
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
