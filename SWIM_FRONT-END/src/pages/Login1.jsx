import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "react-modal";
import "../index.css";
import Header from "../components/Header";
import { useUserId } from "../hooks/useUserId";
import { useAuth } from "../hooks/AuthContext";
import "../styles/login.css";

const Login1 = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUserId } = useUserId();
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost/api/login.php", {
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
        const userId = data.user_id;
        login(userId);
        setUserId(userId);
        console.log("UserId after successful login:", userId);
        navigate("/", { state: { userId } });
        toast.success("Login successful");
        closeModal();
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred during login");
    }
  };

  return (
    <>
      <button onClick={openModal}>Open Login Modal</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Login Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-semibold mb-4">Free Foodstuff Hub</h1>
          <h2 className="text-xl font-semibold mb-2">Welcome Back!</h2>
          <p className="text-base mb-4">Please log in to continue.</p>
          <form className="w-full md:max-w-sm" onSubmit={handleSubmit}>
            <label className="font-semibold text-sm pb-1 block text-accent-content">
              Email
            </label>
            <input
              type="email"
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="font-semibold text-sm pb-1 block text-accent-content">
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
              className="transition duration-200 bg-blue-600 hover:bg-blue-500 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
            >
              Login
            </button>
          </form>
          <p className="text-sm mt-4">
            Don't have an account yet?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
        <button onClick={closeModal}>Close Modal</button>
      </Modal>
    </>
  );
};

export default Login1;
