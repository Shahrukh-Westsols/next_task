"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Filter,
  Search,
  Clock,
  User,
  HardHat,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Zap,
  AlertCircle,
} from "lucide-react";

// Configuration for pagination and table display
const LOGS_PER_PAGE = 10;

// Client-side time component to prevent hydration errors
function ClientSideTime({ timestamp }) {
  const [displayTime, setDisplayTime] = useState("");

  useEffect(() => {
    if (timestamp) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayTime(new Date(timestamp).toLocaleString());
    }
  }, [timestamp]);

  return (
    <span className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
      {displayTime || "Loading..."}
    </span>
  );
}

export default function AdminPage() {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterUser, setFilterUser] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [cacheUserId, setCacheUserId] = useState("");
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
  });

  // Available actions for filter dropdown
  const [availableActions, setAvailableActions] = useState([]);

  // Fetch audit logs from API
  const fetchLogs = async (page = 1) => {
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: LOGS_PER_PAGE.toString(),
      });

      if (filterUser) params.append("userId", filterUser);
      if (filterAction) params.append("action", filterAction);

      const res = await fetch(`/api/admin/audit-logs?${params}`, {
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch logs");
      }

      const data = await res.json();
      setLogs(data.logs);
      setPagination(data.pagination);

      // Extract unique actions for filter dropdown
      const actions = [...new Set(data.logs.map((log) => log.action))];
      setAvailableActions(actions);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
      setError(err.message);
      // Fallback to empty logs
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle clearing a user's task cache
  const handleClearCache = async () => {
    if (!cacheUserId) {
      setError("Please enter a User ID to clear the cache.");
      return;
    }

    setIsClearingCache(true);
    setError("");

    try {
      const res = await fetch("/api/admin/clear-cache", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userId: cacheUserId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to clear cache");
      }

      alert(`Cache for User ID: ${cacheUserId} successfully cleared.`);

      // Refresh logs to show the cache invalidation entry
      fetchLogs(currentPage);
    } catch (err) {
      console.error("Cache clearance error:", err);
      setError(err.message);
    } finally {
      setIsClearingCache(false);
      setCacheUserId("");
    }
  };

  // Load logs on component mount and when filters change
  useEffect(() => {
    fetchLogs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterUser, filterAction]);

  // Handle page changes
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
      fetchLogs(newPage);
    }
  };

  // Utility to format metadata into readable string
  const formatMetadata = (metadata) => {
    if (!metadata) return "No details";

    try {
      const parsed =
        typeof metadata === "string" ? JSON.parse(metadata) : metadata;
      return Object.entries(parsed)
        .map(([key, value]) => {
          if (typeof value === "object" && value !== null) {
            return `${key}: ${JSON.stringify(value)}`;
          }
          return `${key}: ${value}`;
        })
        .join(", ");
    } catch {
      return String(metadata);
    }
  };

  const getActionBadgeColor = (action) => {
    if (
      action.includes("success") ||
      action.includes("created") ||
      action.includes("write")
    )
      return "bg-green-500";
    if (
      action.includes("failure") ||
      action.includes("deleted") ||
      action.includes("invalidation")
    )
      return "bg-red-500";
    if (action.includes("hit") || action.includes("updated"))
      return "bg-blue-500";
    if (action.includes("login") || action.includes("logout"))
      return "bg-purple-500";
    return "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 spiral-text">
            Admin Dashboard
          </h1>
          <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Welcome to your command center. Monitor user activity and system
            performance.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-xl">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">Error:</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Audit Log Section */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-4 sm:p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center justify-between mb-8 flex-col sm:flex-row gap-4">
            <h2 className="text-3xl font-bold bg-linear-to-r spiral-text from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
              <HardHat className="w-7 h-7" />
              Audit Log Trail
            </h2>
            <button
              onClick={() => fetchLogs(currentPage)}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm shadow-md disabled:bg-gray-400"
            >
              {isLoading ? "Refreshing..." : "Refresh Logs"}
            </button>
          </div>

          {/* Filters and Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Filter by User */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Filter by User ID..."
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Filter by Action */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg appearance-none bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="">All Actions</option>
                {availableActions.map((action) => (
                  <option key={action} value={action}>
                    {action.replace(/_/g, " ").toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Filtered Count */}
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                  {pagination.totalCount}
                </span>{" "}
                Total Logs
              </p>
            </div>
          </div>

          {/* Logs Table */}
          <div className="overflow-x-auto rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/4">
                    <User className="inline w-4 h-4 mr-1" /> User ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/4">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/3">
                    Details
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/6">
                    <Clock className="inline w-4 h-4 mr-1" /> Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-6 text-center text-blue-500 font-semibold"
                    >
                      Loading audit logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                    >
                      {error ? "Error loading logs" : "No audit logs found"}
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-gray-100">
                        {log.user_id === 0 ? "SYSTEM" : log.user_id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${getActionBadgeColor(
                            log.action
                          )}`}
                        >
                          {log.action.toUpperCase().replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 break-all font-mono">
                        {formatMetadata(log.metadata)}
                      </td>
                      <td className="text-sm text-gray-500 dark:text-gray-400">
                        <ClientSideTime timestamp={log.created_at} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Page {pagination.page} of {pagination.totalPages}(
                {pagination.totalCount} total logs)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.page === 1}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50"
                >
                  <ChevronsLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50"
                >
                  <ChevronsRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Cache Management Section */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-4 sm:p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-red-600 dark:text-red-400">
            <Zap className="w-6 h-6" /> Cache Management Tools
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
            Manually clear the cached task data for a specific user to force a
            fresh load from the database.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <input
              type="text"
              placeholder="Enter User ID (e.g., 123)"
              value={cacheUserId}
              onChange={(e) => setCacheUserId(e.target.value)}
              className="grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-red-500 focus:border-red-500 transition-all"
            />
            <button
              onClick={handleClearCache}
              disabled={isClearingCache || !cacheUserId}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm shadow-md disabled:bg-gray-400 flex items-center justify-center whitespace-nowrap"
            >
              {isClearingCache ? "Invalidating..." : "Clear User Cache"}
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            🔒 This Audit Log is crucial for security monitoring and compliance.
          </p>
        </div>
      </div>
    </div>
  );
}
