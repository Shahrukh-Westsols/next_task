// import AdminCard from "./AdminCard";
// export default function AdminCard({ title, children }) {
//   return (
//     <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition duration-300 hover:shadow-2xl">
//       <h2 className="text-2xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400 border-b border-gray-200 dark:border-gray-700 pb-2">
//         {title}
//       </h2>
//       {children}
//     </div>
//   );
// }

// export default function AdminPage() {
//   // Mock data for the dashboard widgets
//   const stats = [
//     { title: "Total Users", value: "1,245", icon: "👥", color: "indigo" },
//     { title: "Active Tasks", value: "3,872", icon: "✅", color: "blue" },
//     { title: "Open Tickets", value: "18", icon: "⚠️", color: "amber" },
//     { title: "Storage Used", value: "78%", icon: "💾", color: "emerald" },
//   ];

//   return (
//     <div className="min-h-screen p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
//       <div className="max-w-6xl mx-auto">
//         {/* Header Section with Gradient Text Effect */}
//         <div className="mb-8 text-center">
//           <h1
//             className="text-5xl font-extrabold mb-2
//                        bg-linear-to-r from-indigo-600 to-purple-600
//                        bg-clip-text text-transparent"
//           >
//             Admin Dashboard
//           </h1>
//           <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
//             A centralized place to manage users, tasks, and system health.
//             (Protected by Middleware)
//           </p>
//         </div>

//         {/* 4-Stat Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
//           {stats.map((stat) => (
//             <div
//               key={stat.title}
//               className={`p-5 rounded-xl shadow-md bg-white dark:bg-gray-800 border-l-4 border-${stat.color}-500 transition duration-300 hover:shadow-lg`}
//             >
//               <div className="flex items-center justify-between">
//                 <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   {stat.title}
//                 </p>
//                 <span
//                   className={`text-2xl text-${stat.color}-600 dark:text-${stat.color}-400`}
//                 >
//                   {stat.icon}
//                 </span>
//               </div>
//               <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
//                 {stat.value}
//               </p>
//             </div>
//           ))}
//         </div>

//         {/* Main Administration Tools Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* User Management Card */}
//           <AdminCard title="User Management">
//             <p className="text-gray-700 dark:text-gray-300 mb-4">
//               View, edit, or delete users. Assign or revoke admin roles.
//             </p>
//             <button className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-150 shadow-md">
//               Manage Users (WIP)
//             </button>
//             <ul className="mt-4 text-sm text-gray-500 dark:text-gray-400 space-y-1">
//               <li>- Search and Filter Users</li>
//               <li>- Password Reset Utility</li>
//             </ul>
//           </AdminCard>

//           {/* System Logs Card */}
//           <AdminCard title="System & Activity Logs">
//             <p className="text-gray-700 dark:text-gray-300 mb-4">
//               Monitor server actions, error reports, and user activity
//               timestamps.
//             </p>
//             <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-150 shadow-md">
//               View Logs (WIP)
//             </button>
//             <ul className="mt-4 text-sm text-gray-500 dark:text-gray-400 space-y-1">
//               <li>- Real-time Error Stream</li>
//               <li>- Performance Monitoring</li>
//             </ul>
//           </AdminCard>

//           {/* Task Audit Card */}
//           <AdminCard title="Task Audit & Cleanup">
//             <p className="text-gray-700 dark:text-gray-300 mb-4">
//               Review orphaned tasks, clean up old data, and ensure data
//               integrity.
//             </p>
//             <button className="w-full py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition duration-150 shadow-md">
//               Run Audit (WIP)
//             </button>
//             <ul className="mt-4 text-sm text-gray-500 dark:text-gray-400 space-y-1">
//               <li>- Orphaned Task Report</li>
//               <li>- Scheduled Backups</li>
//             </ul>
//           </AdminCard>
//         </div>

//         {/* Security Notice Footer */}
//         <div className="mt-10 text-center p-4 bg-gray-200 dark:bg-gray-800 border-l-4 border-amber-500 rounded-lg">
//           <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
//             SECURITY NOTICE: This page access is strictly limited to users with
//             the Admin role.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
// /home/westsols-sk/Desktop/Week_3/task_app/src/app/admin/page.js
export default function AdminPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 spiral-text">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Welcome to your command center. Manage users, monitor system health,
            and oversee application operations.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl shadow-lg border border-blue-200 dark:border-blue-700 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-xl">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="font-bold text-lg mb-2">User Management</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Manage user accounts, roles, and permissions across the platform
            </p>
          </div>

          <div className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl shadow-lg border border-green-200 dark:border-green-700 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-xl">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-bold text-lg mb-2">Analytics</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              View system usage statistics and performance metrics
            </p>
          </div>

          <div className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl shadow-lg border border-purple-200 dark:border-purple-700 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-xl">
            <div className="text-3xl mb-3">🔧</div>
            <h3 className="font-bold text-lg mb-2">System Tools</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Database maintenance and application configuration
            </p>
          </div>
        </div>

        {/* Admin Tools Section */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Administration Tools
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Secure administrative controls protected by role-based access
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span className="text-blue-500">📈</span>
                User Statistics
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>
                  • Total Users: <span className="font-semibold">24</span>
                </li>
                <li>
                  • Active Sessions: <span className="font-semibold">8</span>
                </li>
                <li>
                  • Tasks Created: <span className="font-semibold">125</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span className="text-green-500">🛡️</span>
                Security Status
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>
                  • System:{" "}
                  <span className="font-semibold text-green-500">Secure</span>
                </li>
                <li>
                  • Database:{" "}
                  <span className="font-semibold text-green-500">Healthy</span>
                </li>
                <li>
                  • Last Audit: <span className="font-semibold">Today</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold text-lg mb-4 text-center">
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium">
                View All Users
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium">
                System Logs
              </button>
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-sm font-medium">
                Database Check
              </button>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            🔒 This area is protected by Next.js Middleware and requires admin
            privileges
          </p>
        </div>
      </div>
    </div>
  );
}
