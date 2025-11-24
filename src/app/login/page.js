"use client";

import { useState } from "react";
import Link from "next/link";
import Popup from "../components/Popup";

export default function LoginPage() {
  // const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload
    setError("");

    try {
      // const res = await fetch(`${API_URL}/auth/login`, {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Storing user in localStorage for UI
      localStorage.setItem("user", JSON.stringify(data.user));

      setShowSuccessPopup(true);

      // if (!data.token) {
      //   setError("No token received from server");
      //   return;
      // }

      console.log("Login response data:", data);

      // Storing JWT in localStorage
      // localStorage.setItem("token", data.token);
      // Storing JWT in cookie instead of localStorage for  24 hours
      // document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
      // console.log(
      //   "Cookie set with token:",
      //   data.token.substring(0, 20) + "..."
      // );

      // Storing user info for client side use
      // localStorage.setItem("user", JSON.stringify(data.user));

      // // Redirect to / home page
      // window.location.href = "/";
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }

    // Added token expiration becouase i was not able to check protected routes access
    // const tokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
    // localStorage.setItem("tokenExpiry", tokenExpiry.toString());
  };

  const handlePopupConfirm = () => {
    setShowSuccessPopup(false);
    window.location.href = "/";
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black text-black dark:text-white">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-black 
            dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 border rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 
            text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
      <Popup
        isOpen={showSuccessPopup}
        message="Login successful!"
        onConfirm={handlePopupConfirm}
        onCancel={null}
      />
    </>
  );
}
