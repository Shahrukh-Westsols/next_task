export default function AdminPage() {
  return (
    <div className="min-h-screen p-8 bg-zinc-50 dark:bg-gray-900 text-black dark:text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-red-600 mb-6">Admin Panel</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          This page is protected! Only users with the &apos;admin&apos; role can
          see this content, thanks to the **Next.js Middleware** security check.
        </p>

        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-red-500">
          <h2 className="text-2xl font-semibold mb-3">
            Administration Tools Placeholder
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>User Management (Coming Soon)</li>
            <li>System Logs (Coming Soon)</li>
            <li>Database Health Check (Coming Soon)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
