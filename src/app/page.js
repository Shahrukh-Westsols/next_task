import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white flex flex-col items-center">
      <main className="flex flex-col items-center justify-center py-20 px-8 gap-12 w-full max-w-4xl">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to TaskFlow
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
            The simple and powerful task management app that helps you stay
            organized and productive.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <div className="text-2xl mb-4">📝</div>
            <h3 className="font-bold text-lg mb-2">Create Tasks</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Easily add and organize your daily tasks
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <div className="text-2xl mb-4">✅</div>
            <h3 className="font-bold text-lg mb-2">Manage Progress</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Update and track your task completion
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <div className="text-2xl mb-4">🔒</div>
            <h3 className="font-bold text-lg mb-2">Secure & Private</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your tasks are safe and only visible to you
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Organized?</h2>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 border border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition font-semibold"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Demo Image/Logo */}
        <div className="mt-8">
          <Image
            src="/next.svg"
            alt="Next.js Logo"
            width={120}
            height={40}
            className="dark:invert opacity-50"
          />
        </div>
      </main>
    </div>
  );
}

// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white flex flex-col items-center">
//       <main className="flex flex-col items-center justify-center py-32 px-8 gap-10 w-full max-w-4xl">
//         <h1 className="text-4xl font-bold text-center sm:text-left">
//           Welcome to Task App
//         </h1>
//         <p className="text-lg text-center sm:text-left text-gray-700 dark:text-gray-300 max-w-xl">
//           This is a simple task management app. You can register, login, and
//           manage your tasks efficiently.
//         </p>
//         <div className="flex gap-4">
//           <a
//             href="/register"
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//           >
//             Get Started
//           </a>
//           <a
//             href="/login"
//             className="px-6 py-3 border border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition"
//           >
//             Login
//           </a>
//         </div>
//         <Image
//           src="/next.svg"
//           alt="Next.js Logo"
//           width={120}
//           height={40}
//           className="dark:invert"
//         />
//       </main>
//     </div>
//   );
// }
