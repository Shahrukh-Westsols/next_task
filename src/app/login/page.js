"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Popup from "../components/Popup";

// my login validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  // const API_URL = process.env.NEXT_PUBLIC_API_URL;
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Initializing React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // const handleLogin = async (e) => {
  const handleLogin = async (data) => {
    //e.preventDefault(); // Prevent page reload
    // setError("");
    setLoading(true);

    try {
      // const res = await fetch(`${API_URL}/auth/login`, {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
        // body: JSON.stringify({ email, password }),
      });

      // const data = await res.json();
      // if (!res.ok) {
      //   setError(data.message || "Login failed");
      //   return;
      // }
      const responseData = await res.json();
      if (!res.ok) {
        setFormError("root", {
          type: "server",
          message: responseData.message || "Login failed",
        });
        return;
      }

      // Storing user in localStorage for UI
      // localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("user", JSON.stringify(responseData.user));
      setShowSuccessPopup(true);

      console.log("Login response data:", responseData);

      // if (!data.token) {
      //   setError("No token received from server");
      //   return;
      // }

      // console.log("Login response data:", data);

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
      // } catch (err) {
      //   console.error(err);
      //   setError("Something went wrong. Please try again.");
      // }
    } catch (err) {
      console.error(err);
      setFormError("root", {
        type: "server",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
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
          {/* {error && <p className="text-red-500 mb-4">{error}</p>} */}
          {errors.root && (
            <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {errors.root.message}
            </div>
          )}

          {/* <form className="flex flex-col gap-4" onSubmit={handleLogin}> */}
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(handleLogin)}
          >
            <div>
              <input
                type="email"
                placeholder="Enter valid Email"
                //     value={email}
                //     onChange={(e) => setEmail(e.target.value)}
                //     className="p-3 border rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-black
                // dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                //     required
                //   />
                {...register("email")}
                className={`p-3 border rounded-lg w-full bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="Enter valid Password"
                //     value={password}
                //     onChange={(e) => setPassword(e.target.value)}
                //     className="p-3 border rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800
                // text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                //     required
                //   />
                {...register("password")}
                className={`p-3 border rounded-lg w-full bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`p-3 text-white rounded-lg transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
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
