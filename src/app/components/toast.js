"use client";
import { Toaster, toast } from "react-hot-toast";

export { toast };

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-center"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          background: "rgb(255 255 255)", // Light mode background
          color: "rgb(17 24 39)", // Light mode text
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          padding: "16px",
          fontSize: "16px",
          fontWeight: "500",
          border: "1px solid rgb(229 231 235)", // Light mode border
        },
        // Dark mode styles
        className: `
          dark:bg-gray-800 
          dark:text-white 
          dark:border-gray-700
        `,
        success: {
          iconTheme: {
            primary: "#10B981", // Emerald 500
            secondary: "#fff",
          },
          className: `
            dark:bg-gray-800 
            dark:text-white 
            dark:border-gray-700
          `,
        },
        error: {
          iconTheme: {
            primary: "#EF4444", // Red 500
            secondary: "#fff",
          },
          className: `
            dark:bg-gray-800 
            dark:text-white 
            dark:border-gray-700
          `,
        },
      }}
    />
  );
}
