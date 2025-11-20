import Link from "next/link";

export default function Navbar({ user = null }) {
  return (
    <nav className="flex items-center gap-1 bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl px-3 py-2 shadow-lg border border-gray-200 dark:border-gray-700">
      <Link
        href="/"
        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-white dark:hover:text-white hover:bg-linear-to-r hover:from-blue-600 hover:to-purple-600 rounded-lg transition-all duration-300 font-medium"
      >
        Home
      </Link>

      <Link
        href="/login"
        className={`px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-white dark:hover:text-white hover:bg-linear-to-r hover:from-blue-600 hover:to-purple-600 rounded-lg transition-all duration-300 font-medium ${
          user ? "hidden" : "block"
        }`}
      >
        Login
      </Link>
      <Link
        href="/register"
        className={`px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-white dark:hover:text-white hover:bg-linear-to-r hover:from-blue-600 hover:to-purple-600 rounded-lg transition-all duration-300 font-medium ${
          user ? "hidden" : "block"
        }`}
      >
        Register
      </Link>

      <Link
        href="/tasks"
        className={`px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-white dark:hover:text-white hover:bg-linear-to-r hover:from-blue-600 hover:to-purple-600 rounded-lg transition-all duration-300 font-medium ${
          user ? "block" : "hidden"
        }`}
      >
        My Tasks
      </Link>
    </nav>
  );
}
