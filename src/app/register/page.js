"use client";

import { useState } from "react";
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

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
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
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
                className={`p-2.5 border rounded-md w-full bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 ${
                  errors.username
                    ? "border-red-500 focus:ring-red-500"
                    : "border-blue-500 focus:ring-blue-500"
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
                className={`p-2.5 border rounded-md w-full bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-blue-500 focus:ring-blue-500"
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
                  className={`p-2.5 border rounded-md w-full pr-10 bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-blue-500 focus:ring-blue-500"
                  }`}
                  placeholder="Enter password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword1(!showPassword1)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
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
                  className={`p-2.5 border rounded-md w-full pr-10 bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "border-blue-500 focus:ring-blue-500"
                  }`}
                  placeholder="Confirm password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword2(!showPassword2)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
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
                className={`px-8 py-2 text-white rounded-md font-medium ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Creating..." : "Register"}
              </button>
            </div>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
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
