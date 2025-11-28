"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar({ user = null }) {
  const pathname = usePathname();

  // Helper function to check if a link is active
  const isActive = (path) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  // Active link styles
  const activeStyles = "text-white bg-linear-to-r from-blue-600 to-purple-600";
  const inactiveStyles =
    "text-gray-700 dark:text-gray-300 hover:text-white dark:hover:text-white hover:bg-linear-to-r hover:from-blue-600 hover:to-purple-600";

  return (
    <nav className="flex items-center gap-1 bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl px-3 py-2 shadow-lg border border-gray-200 dark:border-gray-700">
      <Link
        href="/"
        className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
          isActive("/") ? activeStyles : inactiveStyles
        }`}
      >
        Home
      </Link>

      <Link
        href="/login"
        className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
          user ? "hidden" : "block"
        } ${isActive("/login") ? activeStyles : inactiveStyles}`}
      >
        Login
      </Link>

      <Link
        href="/register"
        className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
          user ? "hidden" : "block"
        } ${isActive("/register") ? activeStyles : inactiveStyles}`}
      >
        Register
      </Link>

      <Link
        href="/tasks"
        className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
          user ? "block" : "hidden"
        } ${isActive("/tasks") ? activeStyles : inactiveStyles}`}
      >
        My Tasks
      </Link>

      <Link
        href="/profile"
        className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
          user ? "block" : "hidden"
        } ${isActive("/profile") ? activeStyles : inactiveStyles}`}
      >
        Profile
      </Link>

      {user?.role === "admin" && (
        <Link
          href="/admin"
          className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
            isActive("/admin") ? activeStyles : inactiveStyles
          }`}
        >
          Admin Panel
        </Link>
      )}
    </nav>
  );
}
