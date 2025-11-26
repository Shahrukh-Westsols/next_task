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
