import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../index.css";
import Header from "../components/Header";
import { useUserId } from "../hooks/useUserId";
import { useAuth } from "../hooks/AuthContext";
import halfImage from "../photos/halfImage.jpeg";

const Login = () => {
  const { login } = useAuth();
  const { setUserId } = useUserId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send login data to backend'https://swimfoodapp.uc.r.appspot.com/login'
      const response = await fetch("https://swimfoodapp.uc.r.appspot.com/login", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();

      if (response.ok && data.message === "Login successful") {
        // Login successful, set userId in context and navigate
        const { userId } = data; // Extract userId from response
        login(data); // Store user data in context
        setUserId(userId); // Set userId using context
        console.log("UserId after successful login:", userId);
        toast.success("Login successful");
        // Navigate to the desired page after successful login
        navigate("/");
      } else {
        // Login failed, display error message
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred during login");
    }
  };

  return (
    <>
      <div className="flex h-screen">
        <div className="flex-1 bg-dark p-10 flex flex-col items-center bg-[#ECFFDC]">
          <div className="p-10 w-full md:w-full md:max-w-md ">
            {/* Left side - Form */}
            <h1 className="text-2xl font-semibold mb-4 justify-center text-center text-[#023020]">
              Welcome to SWIM-Food Climate Solutions{" "}
            </h1>
            <h2 className="text-lg font-semibold mb-4 text-center italic text-[#023020]">
              Zero Hunger!
            </h2>
            <p className="text-base mb-4 text-[#023020]">
              Please log in to continue.
            </p>
            <form className="flex-1" onSubmit={handleSubmit}>
              <label className="font-semibold text-sm pb-1 block text-accent-content text-[#023020]">
                Email
              </label>
              <input
                type="email"
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label className="font-semibold text-sm pb-1 block text-accent-content text-[#023020]">
                Password
              </label>
              <input
                type="password"
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="transition duration-200 bg-[#008000] hover:[#008000] focus:bg-[#008000] focus:shadow-sm focus:ring-4 focus:ring-[#008000] focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
              >
                Login
              </button>
            </form>
            <p className="text-sm text-gray-600">
              Don't have an account yet?{" "}
              <Link to="/register" className="text-[#008000] hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
        <div
          className="flex-1 bg-[#ECFFDC] p-10 flex flex-col items-center"
          style={{
            backgroundImage: `url(${halfImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      </div>
    </>
  );
};

export default Login;
