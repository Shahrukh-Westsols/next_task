"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
// import Popup from "../components/Popup";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { toast } from "../components/toast";

// Schema
const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be less than 50 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, underscores allowed"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Must contain lowercase, uppercase & number"
      ),
    confirmPassword: z.string().min(1, "Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  // const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const blobRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm({
    resolver: zodResolver(registerSchema),
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

  const handleRegister = async (data) => {
    setLoading(true);
    const registerToast = toast.loading("Creating your account...");
    // const registerToast = toast.loading("Creating your account...", { id: `register-${Date.now()}` });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const output = await res.json();

      if (!res.ok) {
        setFormError("root", {
          type: "server",
          message: output.message || "Registration failed",
        });
        toast.error("Registration failed. Please try again.", {
          id: registerToast,
        });
        return;
      }

      toast.success(
        `Account created for ${data.username}! Redirecting to login...`,
        { id: registerToast }
      );
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (e) {
      setFormError("root", {
        type: "server",
        message: "Something went wrong.",
      });
      toast.error("Registration failed. Please try again.", {
        id: registerToast,
      });
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold mb-6 flex items-center justify-center">
            <UserPlus className="w-6 h-6 mr-2 text-blue-600" />
            Register Account
          </h1>

          {errors.root && (
            <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
              {errors.root.message}
            </div>
          )}

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(handleRegister)}
          >
            <div className="max-w-xs mx-auto w-full">
              <label className="text-base font-semibold mb-1 block">
                Full Name
              </label>
              <input
                type="text"
                {...register("username")}
                className={`p-2.5 border rounded-md w-full bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.username
                    ? "border-red-500 focus:ring-red-500"
                    : "border-blue-500 focus:ring-blue-500 hover:border-blue-600"
                }`}
                placeholder="Enter full name"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="max-w-xs mx-auto w-full">
              <label className="text-base font-semibold mb-1 block">
                Email Address
              </label>
              <input
                type="email"
                {...register("email")}
                className={`p-2.5 border rounded-md w-full bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-blue-500 focus:ring-blue-500 hover:border-blue-600"
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
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
                  type={showPassword1 ? "text" : "password"}
                  {...register("password")}
                  className={`p-2.5 border rounded-md w-full pr-10 bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-blue-500 focus:ring-blue-500 hover:border-blue-600"
                  }`}
                  placeholder="Enter password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword1(!showPassword1)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword1 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="max-w-xs mx-auto w-full">
              <label className="text-base font-semibold mb-1 block">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword2 ? "text" : "password"}
                  {...register("confirmPassword")}
                  className={`p-2.5 border rounded-md w-full pr-10 bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 transition-all ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "border-blue-500 focus:ring-blue-500 hover:border-blue-600"
                  }`}
                  placeholder="Confirm password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword2(!showPassword2)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex justify-center mt-2">
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 text-white rounded-md font-medium transition-all duration-300 transform hover:scale-105 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                }`}
              >
                {loading ? "Creating..." : "Register"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* <Popup
        isOpen={showSuccessPopup}
        message="Registration successful! Click OK to login."
        onConfirm={() => (window.location.href = "/login")}
        onCancel={null}
      /> */}
    </>
  );
}
