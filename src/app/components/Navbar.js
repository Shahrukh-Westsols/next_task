import Link from "next/link";

export default function Navbar({ user }) {
  return (
    <nav className="flex gap-6">
      <Link href="/" className="hover:text-blue-600">
        Home
      </Link>

      {/* Show these if user is NOT logged in */}
      {!user && (
        <>
          <Link href="/login" className="hover:text-blue-600">
            Login
          </Link>
          <Link href="/register" className="hover:text-blue-600">
            Register
          </Link>
        </>
      )}

      {/* Show this if user IS logged in */}
      {user && (
        <Link href="/tasks" className="hover:text-blue-600">
          My Tasks
        </Link>
      )}
    </nav>
  );
}

// import Link from "next/link";

// export default function Navbar() {
//   return (
//     <header className="w-full bg-gray-100 dark:bg-gray-900 p-4 flex gap-6 shadow">
//       <Link href="/" className="hover:text-blue-600">
//         Home
//       </Link>
//       <Link href="/login" className="hover:text-blue-600">
//         Login
//       </Link>
//       <Link href="/register" className="hover:text-blue-600">
//         Register
//       </Link>
//       <Link href="/tasks" className="hover:text-blue-600">
//         Tasks
//       </Link>
//     </header>
//   );
// }
