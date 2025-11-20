"use client";

export default function Popup({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Remove pointer-events-none from parent */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl max-w-sm mx-4 border border-gray-200 dark:border-gray-700">
        {/* Remove pointer-events-auto - not needed */}
        <p className="mb-4 text-gray-800 dark:text-white text-center font-medium">
          {message}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

// "use client";

// export default function Popup({ message, type = "info", onConfirm, onCancel }) {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm mx-4">
//         <p className="mb-4 text-gray-800 dark:text-white">{message}</p>
//         <div className="flex gap-3 justify-end">
//           {onCancel && (
//             <button
//               onClick={onCancel}
//               className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
//             >
//               Cancel
//             </button>
//           )}
//           <button
//             onClick={onConfirm}
//             className={`px-4 py-2 rounded text-white ${
//               type === "success"
//                 ? "bg-green-600 hover:bg-green-700"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             OK
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
