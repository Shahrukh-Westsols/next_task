"use client";

import Navbar from "./Navbar";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Popup from "./Popup";
import { toast } from "./toast";

export default function Header() {
  // const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = async () => {
    try {
      const logoutToast = toast.loading("Logging out...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      console.log("Backend logout response:", response.status);
      localStorage.removeItem("user");
      setUser(null);
      setShowLogoutPopup(false);

      toast.success("Logged out successfully!");

      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
      setShowLogoutPopup(false);
    }
  };

  const cancelLogout = () => {
    setShowLogoutPopup(false);
  };

  if (!mounted) {
    return (
      <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/task_logo.png"
              alt="Task App Logo"
              width={48}
              height={48}
              className="rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 shadow-sm"
              priority
            />
            <h1 className="text-xl font-bold spiral-text whitespace-nowrap">
              TaskFlow
            </h1>
          </Link>
          <div className="flex-1 flex justify-center">
            <Navbar user={null} />
          </div>
          <div className="min-w-[200px]"></div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/task_logo.png"
              alt="Task App Logo"
              width={48}
              height={48}
              className="rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 shadow-sm"
              priority
            />
            <h1 className="text-xl font-bold spiral-text whitespace-nowrap">
              TaskFlow
            </h1>
          </Link>

          <div className="flex-1 flex justify-center">
            <Navbar user={user} />
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Welcome,{" "}
                <span className="font-semibold">
                  {user.username.charAt(0).toUpperCase() +
                    user.username.slice(1)}
                </span>
              </span>

              {/* {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium shadow-md whitespace-nowrap"
                >
                  Admin Panel
                </Link>
              )} */}

              <button
                onClick={handleLogoutClick}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="min-w-[200px]"></div>
          )}
        </div>
      </header>

      <Popup
        isOpen={showLogoutPopup}
        message="Are you sure you want to logout?"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </>
  );
}
