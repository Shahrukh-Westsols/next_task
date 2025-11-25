"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Popup from "../components/Popup";
import { UserPlus } from "lucide-react";

// Defined validation schema
const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be less than 50 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegister = async (data) => {
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        setFormError("root", {
          type: "server",
          message: responseData.message || "Registration failed",
        });
        return;
      }

      setShowSuccessPopup(true);
    } catch (err) {
      console.error(err);
      setFormError("root", {
        type: "server",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccessPopup(false);
    window.location.href = "/login";
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black text-black dark:text-white">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white flex items-center justify-center">
            <UserPlus className="w-6 h-6 mr-3 text-blue-600" />
            Register Account
          </h1>

          {/* Root error message */}
          {errors.root && (
            <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {errors.root.message}
            </div>
          )}

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(handleRegister)}
          >
            {/* Username Field */}
            <div>
              <input
                type="text"
                placeholder="Full Name"
                {...register("username")}
                className={`p-3 border rounded-lg w-full bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 ${
                  errors.username
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
                }`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <input
                type="email"
                placeholder="Email address"
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

            {/* Password Field */}
            <div>
              <input
                type="password"
                placeholder="Password (min 6 char, 1 uppercase, 1 number"
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

            {/* Confirm Password Field */}
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword")}
                className={`p-3 border rounded-lg w-full bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
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
                  Creating Account...
                </div>
              ) : (
                "Register"
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      <Popup
        isOpen={showSuccessPopup}
        message="Registration successful! Click OK to login."
        onConfirm={handleSuccessConfirm}
        onCancel={null}
      />
    </>
  );
}

// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import Popup from "../components/Popup";

// export default function RegisterPage() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError("");

//     // const API_URL = process.env.NEXT_PUBLIC_API_URL;

//     try {
//       // const res = await fetch(`${API_URL}/auth/register`, {
//       const res = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ username, email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || "Registration failed");
//         return;
//       }
//       // Storing user data in localStorage for client-side UI,
//       // if (data.user) {
//       //   localStorage.setItem("user", JSON.stringify(data.user));
//       // }

//       setShowSuccessPopup(true);
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong. Please try again.");
//     }
//   };

//   const handleSuccessConfirm = () => {
//     setShowSuccessPopup(false);
//     window.location.href = "/login";
//   };

//   return (
//     <>
//       <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black text-black dark:text-white">
//         <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-lg shadow-md">
//           <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
//           {error && <p className="text-red-500 mb-4">{error}</p>}
//           <form className="flex flex-col gap-4" onSubmit={handleRegister}>
//             <input
//               type="text"
//               placeholder="Full Name"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="p-3 border rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="p-3 border rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="p-3 border rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//             <button
//               type="submit"
//               className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//             >
//               Register
//             </button>
//           </form>
//           <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
//             Already have an account?{" "}
//             <Link href="/login" className="text-blue-600 hover:underline">
//               Login
//             </Link>
//           </p>
//         </div>
//       </div>

//       <Popup
//         isOpen={showSuccessPopup}
//         message="Registration successful! Click OK to login."
//         onConfirm={handleSuccessConfirm}
//         onCancel={null}
//       />
//     </>
//   );
// }
