"use client";

import Navbar from "./Navbar";
import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3 mr-8">
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
      </div>
      <Navbar />
    </header>
  );
}
