"use client";

import { useState, useEffect, useRef } from "react";
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

  const blobRef = useRef(null);

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

  // Mouse move effect for the blob
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (blobRef.current) {
        const { clientX, clientY } = e;
        blobRef.current.animate(
          {
            left: `${clientX}px`,
            top: `${clientY}px`,
          },
          { duration: 3000, fill: "forwards" }
        );
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Your Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>

        {/* Modern gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(0,0,0,0))]"></div>

        {/* Animated Waves */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Single wave that starts from center behind form and expands */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white dark:bg-white/20 animate-single-wave" />
        </div>

        {/* Your Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Mouse Following Blob */}
        <div
          ref={blobRef}
          className="absolute w-80 h-80 bg-linear-to-r from-blue-300 to-purple-400 dark:from-blue-400 dark:to-purple-500 rounded-full opacity-40 blur-3xl pointer-events-none transition-transform duration-3000 -translate-x-1/2 -translate-y-1/2"
          style={{
            left: "50%",
            top: "50%",
          }}
        />

        {/* Form container with glass effect */}
        <div className="relative z-10 w-full max-w-md p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
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
            <div className="max-w-xs mx-auto w-full">
              <label className="text-base font-semibold mb-1 block">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className={`p-2.5 border rounded-md w-full bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-blue-500 focus:ring-blue-500 hover:border-blue-600"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="max-w-xs mx-auto w-full">
              <label className="text-base font-semibold mb-1 block">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  className={`p-2.5 border rounded-md w-full bg-gray-50 dark:bg-gray-800 text-black dark:text-white pr-10 focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-blue-500 focus:ring-blue-500 hover:border-blue-600"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
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

            <div className="flex justify-center mt-2">
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 text-white rounded-md font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
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
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Dont have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline"
            >
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
