"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [user] = useState(() => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white flex flex-col items-center">
      <main className="flex flex-col items-center justify-center py-20 px-8 gap-12 w-full max-w-4xl">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 transition-all duration-500">
            {user ? `Welcome back, ${user.username}!` : "Welcome to TaskFlow"}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
            {user
              ? "Continue managing your tasks and stay productive."
              : "The simple and powerful task management app that helps you stay organized and productive."}
          </p>
        </div>

        {user && (
          <div className="text-center">
            <Link
              href="/tasks"
              className="px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-500 ease-out font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Go to My Tasks
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl">
          <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-lg shadow-md text-center transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-lg border border-blue-200 dark:border-blue-700">
            <div className="text-2xl mb-4">📝</div>
            <h3 className="font-bold text-lg mb-2">Create Tasks</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Easily add and organize your daily tasks
            </p>
          </div>

          <div className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-lg shadow-md text-center transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-lg border border-green-200 dark:border-green-700">
            <div className="text-2xl mb-4">✅</div>
            <h3 className="font-bold text-lg mb-2">Manage Progress</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Update and track your task completion
            </p>
          </div>

          <div className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-lg shadow-md text-center transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-lg border border-purple-200 dark:border-purple-700">
            <div className="text-2xl mb-4">🔒</div>
            <h3 className="font-bold text-lg mb-2">Secure & Private</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your tasks are safe and only visible to you
            </p>
          </div>
        </div>

        {!user && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Organized?</h2>
            <div className="flex gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-500 ease-out font-semibold"
              >
                Get Started Free
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 border border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-500 ease-out font-semibold"
              >
                Login
              </Link>
            </div>
          </div>
        )}

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
