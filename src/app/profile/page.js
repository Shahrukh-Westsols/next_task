"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Shield, LogOut, Loader2 } from "lucide-react";
import { toast } from "../components/toast";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("/api/auth/profile", {
          method: "GET",
          credentials: "include", // Important to send HttpOnly cookie
        });

        if (!res.ok) {
          window.location.href = "/login";
          return;
        }

        const data = await res.json();
        setUser(data.user); // data.user comes from JWT in profile API
      } catch (err) {
        console.error("Error fetching user profile:", err);
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const logoutToast = toast.loading("Logging out...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) console.warn("Logout API call failed, continuing...");

      localStorage.removeItem("user"); // optional, just in case
      toast.success("Logged out successfully!", { id: logoutToast });

      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    } catch (err) {
      console.error("Error during logout:", err);
      toast.error("Logout failed. Please try again.", { id: logoutToast });
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin h-12 w-12 text-indigo-500" />
        <span className="ml-4 text-xl font-medium text-gray-700 dark:text-gray-300">
          Loading profile...
        </span>
      </div>
    );
  }

  if (!user) return null;

  const roleStyles = {
    admin: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-300",
    user: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-300",
  };

  const currentRoleStyle = roleStyles[user.role] || roleStyles.user;
  const capitalizedRole =
    user.role.charAt(0).toUpperCase() + user.role.slice(1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8 flex justify-center items-start pt-16">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700 transition duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-full mb-4">
            <User className="w-10 h-10 text-indigo-600 dark:text-indigo-300" />
          </div>
          <h1 className="text-5xl font-bold mb-4 spiral-text">User Profile</h1>
          <span
            className={`mt-2 px-4 py-1 text-sm font-semibold rounded-full border ${currentRoleStyle}`}
          >
            {capitalizedRole}
          </span>
        </div>

        <div className="space-y-4 mb-10">
          <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <User className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Name
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {user.username}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Email
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white break-all">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <Shield className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Access Role
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {capitalizedRole} Access
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition duration-150 shadow-md disabled:opacity-70"
        >
          {isLoggingOut ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <LogOut className="w-5 h-5" />
          )}
          {isLoggingOut ? "Logging Out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
