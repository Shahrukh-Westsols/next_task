"use client";

import React from "react";
import { X, CheckCircle, AlertTriangle } from "lucide-react";

export default function Popup({
  isOpen,
  message,
  onConfirm,
  onCancel,
  type = "confirm",
}) {
  if (!isOpen) return null;

  // Determine colors and icon based on the popup type
  let icon = <AlertTriangle className="w-8 h-8 text-yellow-500" />;
  let confirmColor = "bg-blue-600 hover:bg-blue-700";

  if (type === "success") {
    icon = <CheckCircle className="w-8 h-8 text-green-500" />;
    confirmColor = "bg-green-600 hover:bg-green-700";
  } else if (type === "error") {
    icon = <X className="w-8 h-8 text-red-500" />;
    confirmColor = "bg-red-600 hover:bg-red-700";
  }

  const isConfirmation = type === "confirm" || type === "delete";

  if (type === "delete") {
    confirmColor = "bg-red-600 hover:bg-red-700";
    icon = <AlertTriangle className="w-8 h-8 text-red-500" />;
  }

  return (
    // Backdrop with blurred effect
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/50 backdrop-blur-sm transition-opacity">
      <div
        className="w-full max-w-sm mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 
        border border-gray-100 dark:border-gray-700 transform scale-100 transition-transform duration-300"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">{icon}</div>

          <p className="mb-6 text-gray-900 dark:text-gray-100 text-lg font-semibold">
            {message}
          </p>
        </div>

        <div
          className={`flex gap-3 ${
            isConfirmation ? "justify-between" : "justify-center"
          } pt-2`}
        >
          {isConfirmation && (
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
            >
              Cancel
            </button>
          )}

          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 ${confirmColor} text-white rounded-lg font-semibold 
                       shadow-md transition duration-150 transform hover:scale-[1.02]`}
          >
            {type === "delete" ? "Delete" : "OK"}
          </button>
        </div>
      </div>
    </div>
  );
}
