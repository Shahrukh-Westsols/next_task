"use client";

import Navbar from "./Navbar";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
  };

  const getUser = () => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  };

  const user = getUser();

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
          <h1 className="text-xl font-bold text-gray-800 dark:text-white whitespace-nowrap">
            TaskFlow
          </h1>
        </Link>

        <div className="flex-1 flex justify-center">
          <Navbar user={user} />
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, <span className="font-semibold">{user.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// "use client";

// import Navbar from "./Navbar";
// import Image from "next/image";

// export default function Header() {
//   return (
//     <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
//       <div className="flex items-center gap-3 mr-8">
//         <Image
//           src="/task_logo.png"
//           alt="Task App Logo"
//           width={48}
//           height={48}
//           className="rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 shadow-sm"
//           priority
//         />
//         <h1 className="text-xl font-bold text-gray-800 dark:text-white whitespace-nowrap">
//           TaskFlow
//         </h1>
//       </div>
//       <Navbar />
//     </header>
//   );
// }
