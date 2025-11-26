"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
// import Popup from "../components/Popup";
import { LogIn, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "../components/toast";

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
  // const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    const loginToast = toast.loading("Attempting to log in...");

    try {
      // const res = await fetch(`${API_URL}/auth/login`, {
      await new Promise((resolve) => setTimeout(resolve, 2000));
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
          message:
            responseData.message || "Login failed. Check your credentials.",
        });
        toast.error(responseData.message || "Login failed!", {
          id: loginToast,
        });
        return;
      }

      // Storing user in localStorage for UI
      // localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("user", JSON.stringify(responseData.user));
      toast.success(`Welcome back, ${responseData.user.username}!`, {
        id: loginToast,
      });

      console.log("Login response data:", responseData);

      const redirectPath =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("redirectPath="))
          ?.split("=")[1] || "/";

      document.cookie = "redirectPath=; Max-Age=0; path=/";

      setTimeout(() => {
        window.location.href = redirectPath;
      }, 500);

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
      console.error("Login Network Error:", err);
      setFormError("root", {
        type: "server",
        message: "Network error. Please try again.",
      });
      // ADDED: Update loading toast to network error
      toast.error("Network error. Could not reach server.", { id: loginToast });
    } finally {
      setLoading(false);
    }

    // Added token expiration becouase i was not able to check protected routes access
    // const tokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
    // localStorage.setItem("tokenExpiry", tokenExpiry.toString());
  };

  // const handlePopupConfirm = () => {
  //   setShowSuccessPopup(false);
  //   window.location.href = "/";
  // };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black text-black dark:text-white">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white flex items-center justify-center">
            <LogIn className="w-6 h-6 mr-3 text-blue-600" />
            Sign In
          </h1>
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
              <label className="text-base font-semibold mb-1 block">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className={`p-2.5 border rounded-md w-full bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-blue-500 focus:ring-blue-500"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-base font-semibold mb-1 block">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  className={`p-2.5 border rounded-md w-full bg-gray-50 dark:bg-gray-800 text-black dark:text-white pr-10 focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-blue-500 focus:ring-blue-500"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mx-auto w-32 py-2.5 text-white rounded-md transition flex items-center justify-center ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Logging...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Dont have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* <Popup
        isOpen={showSuccessPopup}
        message="Login successful!"
        onConfirm={handlePopupConfirm}
        onCancel={null}
      /> */}
    </>
  );
}
