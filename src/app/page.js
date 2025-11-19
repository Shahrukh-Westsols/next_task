import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white flex flex-col items-center">
      <main className="flex flex-col items-center justify-center py-32 px-8 gap-10 w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          Welcome to Task App
        </h1>
        <p className="text-lg text-center sm:text-left text-gray-700 dark:text-gray-300 max-w-xl">
          This is a simple task management app. You can register, login, and
          manage your tasks efficiently.
        </p>
        <div className="flex gap-4">
          <a
            href="/register"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </a>
          <a
            href="/login"
            className="px-6 py-3 border border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            Login
          </a>
        </div>
        <Image
          src="/next.svg"
          alt="Next.js Logo"
          width={120}
          height={40}
          className="dark:invert"
        />
      </main>
    </div>
  );
}
