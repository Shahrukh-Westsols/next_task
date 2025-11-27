"use client";
import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2, // For global loading spinner
  Circle, // For incomplete task icon
  CheckCircle, // For completed task icon
  Edit, // For edit button
  Trash2, // For delete button
  ChevronUp, // For move up
  ChevronDown, // For move down
  Zap,
  RefreshCw,
  Database,
} from "lucide-react";
import Popup from "../components/Popup";
import { toast } from "../components/toast";
import { TaskSkeleton } from "../components/loader";

const taskSchema = z.object({
  content: z.string().min(1, "Task cannot be empty"),
});

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const totalTasks = tasks.length;
  // const [apiError, setApiError] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [user, setUser] = useState(null);
  const [cacheStatus, setCacheStatus] = useState(""); // "CACHED" or "LIVE"
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch {
      setUser(null);
    }
  }, []);

  const {
    register: taskRegister,
    handleSubmit: handleTaskSubmit,
    reset: resetTaskForm,
    formState: { errors: taskErrors },
  } = useForm({
    resolver: zodResolver(taskSchema),
  });

  // const [user] = useState(() => {
  //   try {
  //     const userData = localStorage.getItem("user");
  //     return userData ? JSON.parse(userData) : null;
  //   } catch {
  //     return null;
  //   }
  // });

  const handleAddTask = async ({ content }) => {
    if (!content.trim()) return;

    // setApiError(null);
    try {
      const addToast = toast.loading("Adding task...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const res = await fetch(`/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ content }),
      });
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server did not return JSON");
      }

      const data = await res.json();

      if (!res.ok) {
        // setApiError(data.message || "Failed to add task");
        toast.error(data.message || "Failed to add task", { id: addToast });
      } else {
        setTasks([...tasks, data.task]); // append new task
        toast.success("Task added successfully!", { id: addToast });
        resetTaskForm(); // clear input via react-hook-form
      }
    } catch (err) {
      console.error(err);
      // setApiError("Something went wrong while adding task.");
      toast.error("Something went wrong while adding task.");
    }
  };

  const handleDeleteClick = (id) => {
    setTaskToDelete(id);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    // setApiError(null);
    try {
      const deleteToast = toast.loading("Deleting task...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const res = await fetch(`/api/tasks/${taskToDelete}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        console.error(data.message || "Failed to delete task");
        // setApiError(data.message || "Failed to delete task");
        toast.error(data.message || "Failed to delete task", {
          id: deleteToast,
        });
      } else {
        setTasks(tasks.filter((task) => task.tasks_id !== taskToDelete));
        toast.success("Task deleted successfully!", { id: deleteToast });
      }
    } catch (err) {
      console.error("Error confirming deletion:", err);
      // setApiError("Something went wrong while deleting task.");
      toast.error("Something went wrong while deleting task.");
    } finally {
      setShowDeletePopup(false);
      setTaskToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
    setTaskToDelete(null);
  };

  const handleToggleCompleted = async (task) => {
    const newCompleted = !task.completed;
    // setApiError(null);
    try {
      const toggleToast = toast.loading("Updating task...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const res = await fetch(`/api/tasks/${task.tasks_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          content: task.content,
          completed: newCompleted,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error(data.message || "Failed to update completion status");
        // setApiError("Failed to update task completion status.");
        toast.error("Failed to update task completion status.", {
          id: toggleToast,
        });
      } else {
        setTasks(
          tasks.map((t) => (t.tasks_id === task.tasks_id ? data.task : t))
        );
        toast.success("Task status updated!", { id: toggleToast });
      }
    } catch (err) {
      console.error("Error toggling completion:", err);
      // setApiError("Something went wrong while updating task status.");
      toast.error("Something went wrong while updating task status.");
    }
  };

  const handleStartEdit = (task) => {
    setEditingTaskId(task.tasks_id);
    setEditingContent(task.content);
  };

  const handleSaveEdit = useCallback(
    async (task) => {
      if (!editingContent.trim() || editingContent === task.content) {
        setEditingTaskId(null);
        return;
      }
      // setApiError(null);
      try {
        const editToast = toast.loading("Updating task...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const res = await fetch(`/api/tasks/${task.tasks_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            content: editingContent,
            completed: task.completed,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setTasks(
            tasks.map((t) => (t.tasks_id === task.tasks_id ? data.task : t))
          );
          toast.success("Task updated successfully!", { id: editToast });
        } else {
          console.error(data.message || "Failed to save update");
          // setApiError("Failed to save task update.");
          toast.error("Failed to save task update.", { id: editToast });
        }
      } catch (err) {
        console.error("Error saving task:", err);
        // setApiError("Something went wrong while saving task.");
        toast.error("Something went wrong while saving task.");
      } finally {
        setEditingTaskId(null);
      }
    },
    [editingContent, tasks]
  );

  const handleMoveUp = async (id) => {
    // setApiError(null);
    // Update backend (API call intentionally not awaited to keep UI responsive)
    fetch(`/api/tasks/${id}/move-up`, {
      method: "POST",
      credentials: "include",
    }).catch((err) => {
      console.error("Failed to move task up on server:", err);
      // setApiError("Failed to save task order change.");
      toast.error("Failed to save task order change.");
    });

    // Update UI locally
    setTasks((prev) => {
      const index = prev.findIndex((t) => t.tasks_id === id);
      if (index === 0) return prev; // Already at top
      const newArr = [...prev];
      // Swap elements
      [newArr[index], newArr[index - 1]] = [newArr[index - 1], newArr[index]];
      return newArr;
    });
  };

  const handleMoveDown = async (id) => {
    // setApiError(null);
    // Update backend (API call intentionally not awaited to keep UI responsive)
    fetch(`/api/tasks/${id}/move-down`, {
      method: "POST",
      credentials: "include",
    }).catch((err) => {
      console.error("Failed to move task down on server:", err);
      // setApiError("Failed to save task order change.");
      toast.error("Failed to save task order change.");
    });

    // Update UI locally
    setTasks((prev) => {
      const index = prev.findIndex((t) => t.tasks_id === id);
      if (index === prev.length - 1) return prev; // Already at bottom
      const newArr = [...prev];
      // Swap elements
      [newArr[index], newArr[index + 1]] = [newArr[index + 1], newArr[index]];
      return newArr;
    });
  };

  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     // setApiError(null); // Clear action errors
  //     setFetchError(""); // Clear fetch errors
  //     if (!user) {
  //       return;
  //     }

  //     try {
  //       const res = await fetch(`/api/tasks`, {
  //         credentials: "include",
  //       });

  //       const contentType = res.headers.get("content-type");
  //       if (!contentType || !contentType.includes("application/json")) {
  //         // This usually indicates a redirect or proxy error
  //         const text = await res.text();
  //         console.error("Non-JSON response during fetch:", text);
  //         setFetchError(
  //           "Authentication failed or server error. Please log in again."
  //         );
  //         return;
  //       }

  //       const data = await res.json();

  //       if (!res.ok) {
  //         setFetchError(data.message || "Failed to fetch tasks");
  //       } else {
  //         setTasks(data.tasks);
  //         setCacheStatus(data.source || "LIVE");
  //       }
  //     } catch (err) {
  //       console.error(err);
  //       setFetchError("Something went wrong connecting to the server.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchTasks();
  // }, [user]);

  useEffect(() => {
    const fetchTasks = async () => {
      setFetchError("");
      if (!user) return;

      try {
        // SIMPLIFY: Just call the main tasks API
        const res = await fetch(`/api/tasks`, {
          credentials: "include",
        });

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          console.error("Non-JSON response:", text);
          setFetchError("Server error - please try again");
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          setFetchError(data.message || "Failed to fetch tasks");
        } else {
          setTasks(data.tasks);
          setCacheStatus(data.source || "LIVE");
        }
      } catch (err) {
        console.error(err);
        setFetchError("Network error connecting to server");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  // Clear cache and refresh tasks
  const handleClearCache = async () => {
    setIsRefreshing(true);
    try {
      const clearToast = toast.loading("Clearing cache...");

      // Call API to clear cache
      const res = await fetch("/api/tasks/clear-cache", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Cache cleared successfully!", { id: clearToast });

        // Refresh tasks (will fetch fresh from database)
        const refreshRes = await fetch(`/api/tasks`, {
          credentials: "include",
        });
        const data = await refreshRes.json();

        if (refreshRes.ok) {
          setTasks(data.tasks);
          setCacheStatus(data.source || "LIVE");
        }
      } else {
        toast.error("Failed to clear cache", { id: clearToast });
      }
    } catch (error) {
      console.error("Clear cache error:", error);
      toast.error("Error clearing cache");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Manual refresh (force fresh data)
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const refreshToast = toast.loading("Refreshing tasks...");

      // Force refresh by adding timestamp to bypass cache
      const res = await fetch(`/api/tasks?refresh=${Date.now()}`, {
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        setTasks(data.tasks);
        setCacheStatus(data.source || "LIVE");
        toast.success("Tasks refreshed!", { id: refreshToast });
      } else {
        toast.error("Failed to refresh tasks", { id: refreshToast });
      }
    } catch (error) {
      console.error("Refresh error:", error);
      toast.error("Error refreshing tasks");
    } finally {
      setIsRefreshing(false);
    }
  };

  // if (loading)
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
  //       <Loader2 className="animate-spin h-12 w-12 text-indigo-500" />
  //       <span className="ml-4 text-xl font-medium">Loading tasks...</span>
  //     </div>
  //   );

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          {/* <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold mb-6 spiral-text">
              Task Manager
            </h1>
            {user && (
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                Welcome back,{" "}
                <span className="font-bold text-indigo-700 dark:text-indigo-300">
                  {user.username}
                </span>
                ! Loading your tasks...
              </p>
            )}
          </div> */}
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold mb-6 spiral-text">
              Task Manager
            </h1>
            {user && (
              <div className="space-y-2">
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Welcome back,{" "}
                  <span className="font-bold text-indigo-700 dark:text-indigo-300">
                    {user.username}
                  </span>
                  ! You have {totalTasks} task{totalTasks !== 1 ? "s" : ""} to
                  manage.
                </p>

                {/* CACHE STATUS BADGE - ADD THIS SECTION */}
                {cacheStatus && (
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        cacheStatus.includes("CACHED")
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : cacheStatus.includes("Redis Down")
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      }`}
                    >
                      {cacheStatus.includes("CACHED") ? (
                        <Zap className="w-3 h-3 mr-1" />
                      ) : (
                        <Database className="w-3 h-3 mr-1" />
                      )}
                      Data: {cacheStatus}
                    </span>

                    {/* CACHE CONTROLS - ADD THESE BUTTONS */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-50"
                      >
                        <RefreshCw
                          className={`w-3 h-3 mr-1 ${
                            isRefreshing ? "animate-spin" : ""
                          }`}
                        />
                        Refresh
                      </button>

                      <button
                        onClick={handleClearCache}
                        disabled={isRefreshing}
                        className="inline-flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-full hover:bg-red-200 dark:hover:bg-red-800/50 transition disabled:opacity-50"
                      >
                        Clear Cache
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Skeleton for task form */}
          <div className="mb-8 flex gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 animate-pulse">
            <div className="flex-1">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
            <div className="h-12 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>

          {/* Skeleton task list */}
          <ul className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <TaskSkeleton key={index} />
            ))}
          </ul>
        </div>
      </div>
    );

  if (fetchError)
    return (
      <div className="text-red-500 text-center mt-10 p-4 bg-red-100 dark:bg-red-900/20 rounded-lg max-w-lg mx-auto border border-red-300">
        <p className="font-semibold">Error Loading Tasks:</p>
        <p>{fetchError}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-6 spiral-text">Task Manager</h1>
          {user && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              Welcome back,{" "}
              <span className="font-bold text-indigo-700 dark:text-indigo-300">
                {user.username}
              </span>
              ! You have {totalTasks} task{totalTasks !== 1 ? "s" : ""} to
              manage.
            </p>
          )}
        </div>

        {/* {apiError && (
          <div className="p-4 mb-6 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium">
            <p className="font-bold">Action Failed:</p>
            <p>{apiError}</p>
          </div>
        )} */}

        <form
          className="mb-8 flex gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700"
          onSubmit={handleTaskSubmit(handleAddTask)}
        >
          <div className="flex-1">
            <input
              type="text"
              placeholder="Add a new task (e.g., Deploy backend service)"
              {...taskRegister("content")}
              className={`w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition ${
                taskErrors.content
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
              }`}
            />
            <div className="min-h-5 mt-1 ml-1">
              {taskErrors.content && (
                <p className="text-red-500 text-sm font-medium">
                  {taskErrors.content.message}
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="h-12 px-6 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition duration-150 shadow-md transform hover:scale-[1.02]"
          >
            Add Task
          </button>
        </form>

        {/* Task List */}
        <ul className="space-y-4">
          {tasks.map((task, index) => {
            const isEditing = editingTaskId === task.tasks_id;
            const isCompleted = task.completed;
            const barWidth = isCompleted ? 100 : 30; // Mocking 30% progress for incomplete tasks
            const barColor = isCompleted ? "bg-emerald-500" : "bg-indigo-500";

            return (
              <li
                key={task.tasks_id}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col gap-4 transition duration-300 hover:shadow-xl"
              >
                {/* Top Section: Icon, Content, Status Badge */}
                <div className="flex items-start gap-4">
                  {/* Task Icon (Lucide Icons) */}
                  <div
                    className={`p-3 rounded-full shrink-0 ${
                      isCompleted
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-indigo-500/10 text-indigo-500"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </div>

                  {/* Task Content or Edit Input (CRITICAL FIX HERE) */}
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        onBlur={() => handleSaveEdit(task)}
                        onKeyDown={(e) => {
                          // Save on Enter, ignore other keys
                          if (e.key === "Enter") e.currentTarget.blur();
                        }}
                        className="w-full text-xl font-semibold border-b-2 border-indigo-400 dark:border-indigo-600 bg-transparent focus:outline-none p-1 -m-1"
                        autoFocus
                      />
                    ) : (
                      <p
                        className={`text-xl font-semibold wrap-break-word transition-colors pt-2 ${
                          isCompleted
                            ? "text-gray-400 dark:text-gray-600 line-through"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {task.content}
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0">
                    Progress
                  </p>
                  <div className="flex-1">
                    <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${barWidth}%` }}
                      ></div>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-bold w-10 text-right ${
                      isCompleted ? "text-emerald-500" : "text-indigo-500"
                    }`}
                  >
                    {barWidth}%
                  </span>
                </div>

                {/* Bottom Section: Action Buttons */}
                <div className="flex flex-wrap justify-end gap-2 border-t border-gray-100 dark:border-gray-700 pt-4 -mb-2">
                  {/* Move Up/Down Buttons */}
                  <button
                    onClick={() => handleMoveUp(task.tasks_id)}
                    disabled={index === 0}
                    title="Move Up"
                    className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMoveDown(task.tasks_id)}
                    disabled={index === totalTasks - 1}
                    title="Move Down"
                    className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Toggle Completed */}
                  <button
                    onClick={() => handleToggleCompleted(task)}
                    title={isCompleted ? "Mark Incomplete" : "Mark Complete"}
                    className={`p-2 rounded-lg text-sm font-medium transition shadow-md min-w-[90px] ${
                      isCompleted
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : "bg-emerald-500 hover:bg-emerald-600 text-white"
                    }`}
                  >
                    {isCompleted ? "Reopen" : "Complete"}
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleStartEdit(task)}
                    title="Edit Task"
                    disabled={isEditing}
                    className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition disabled:opacity-50"
                  >
                    <Edit className="w-5 h-5" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteClick(task.tasks_id)}
                    title="Delete Task"
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        {totalTasks === 0 && !loading && (
          <div className="mt-10 p-8 text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
              All caught up! Time to add a new task.
            </p>
          </div>
        )}
      </div>

      <Popup
        isOpen={showDeletePopup}
        title="Confirm Deletion"
        message="Are you sure you want to permanently delete this task?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
