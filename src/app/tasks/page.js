"use client";

import { useEffect, useState, useCallback } from "react";
import Popup from "../components/Popup";

export default function TasksPage() {
  // const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [user] = useState(() => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  });

  const handleAddTask = async () => {
    // const token = localStorage.getItem("token");

    if (!newTask.trim()) return;

    try {
      const res = await fetch(`/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ content: newTask }),
      });

      // Check if the response is JSON becouse we were having errors of getting https page
      // when backend was not synced and next was sending https error page
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server did not return JSON");
      }

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to add task");
      } else {
        setTasks([...tasks, data.task]); // append new task
        setNewTask(""); // clear input
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const handleDeleteClick = (id) => {
    setTaskToDelete(id);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;

    // const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/tasks/${taskToDelete}`, {
        method: "DELETE",
        headers: {
          // Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.message || "Failed to delete task");
        alert(data.message || "Failed to delete task");
      } else {
        setTasks(tasks.filter((task) => task.tasks_id !== taskToDelete));
      }
    } catch (err) {
      console.error("Error confirming deletion:", err);
      alert("Something went wrong while deleting task");
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

    try {
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
      } else {
        setTasks(
          tasks.map((t) => (t.tasks_id === task.tasks_id ? data.task : t))
        );
      }
    } catch (err) {
      console.error("Error toggling completion:", err);
    }
  };

  const handleUpdateTask = async (task) => {
    // This function is still defined but the UI will use the inline editing logic below
    // However, for API/backend consistency, we keep the function body.
    console.log("Starting inline edit for task:", task.tasks_id);
    setEditingTaskId(task.tasks_id);
    setEditingContent(task.content);
  };

  const handleSaveEdit = useCallback(
    async (task) => {
      if (!editingContent.trim() || editingContent === task.content) {
        setEditingTaskId(null);
        return;
      }

      try {
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
        } else {
          console.error(data.message || "Failed to save update");
        }
      } catch (err) {
        console.error("Error saving task:", err);
      } finally {
        setEditingTaskId(null);
      }
    },
    [editingContent, tasks]
  );

  // const handleDeleteTask = async (id) => {
  //   // const token = localStorage.getItem("token");

  //   try {
  //     const res = await fetch(`/api/tasks/${id}`, {
  //       method: "DELETE",
  //       headers: {
  //         // Authorization: `Bearer ${token}`,
  //       },
  //       credentials: "include",
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       console.error(data.message || "Failed to delete task");
  //       alert(data.message || "Failed to delete task");
  //     } else {
  //       setTasks(tasks.filter((task) => task.tasks_id !== id));
  //     }
  //   } catch (err) {
  //     console.error("Error deleting task:", err);
  //     alert("Something went wrong while deleting task");
  //   }
  // };

  // const handleUpdateTask = async (task) => {
  //   // const token = localStorage.getItem("token");

  //   const newContent = prompt("Update task", task.content);
  //   if (!newContent) return;

  //   try {
  //     const res = await fetch(`/api/tasks/${task.tasks_id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         // Authorization: `Bearer ${token}`,
  //       },
  //       credentials: "include",
  //       body: JSON.stringify({
  //         task_id: task.tasks_id,
  //         content: newContent,
  //         completed: task.completed,
  //       }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       alert(data.message || "Failed to update");
  //     } else {
  //       setTasks(
  //         tasks.map((t) => (t.tasks_id === task.tasks_id ? data.task : t))
  //       );
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     alert("Something went wrong");
  //   }
  // };

  const handleMoveUp = async (id) => {
    // const token = localStorage.getItem("token");

    // Update backend
    await fetch(`/api/tasks/${id}/move-up`, {
      method: "POST",
      credentials: "include",
      // headers: {
      //   // Authorization: `Bearer ${token}`,
      // },
    });

    // Update UI locally
    setTasks((prev) => {
      const index = prev.findIndex((t) => t.tasks_id === id);
      if (index === 0) return prev; // Already at top

      const newArr = [...prev];
      [newArr[index], newArr[index - 1]] = [newArr[index - 1], newArr[index]];
      return newArr;
    });
  };

  const handleMoveDown = async (id) => {
    // const token = localStorage.getItem("token");

    // Update backend
    await fetch(`/api/tasks/${id}/move-down`, {
      method: "POST",
      credentials: "include",
      // headers: {
      //   // Authorization: `Bearer ${token}`,
      // },
    });

    // Update UI locally
    setTasks((prev) => {
      const index = prev.findIndex((t) => t.tasks_id === id);
      if (index === prev.length - 1) return prev; // Already at bottom

      const newArr = [...prev];
      [newArr[index], newArr[index + 1]] = [newArr[index + 1], newArr[index]];
      return newArr;
    });
  };

  useEffect(() => {
    const fetchTasks = async () => {
      // const token = localStorage.getItem("token");

      // if (!user || !token) {
      //   window.location.href = "/login"; // redirect if not logged in
      //   return;
      // }
      // no need now we have middleware on frontent as well
      // if (!user) {
      //   window.location.href = "/login";
      //   return;
      // }

      try {
        // const res = await fetch(`${API_URL}/tasks?user_id=${user.user_id}`, {
        const res = await fetch(`/api/tasks`, {
          headers: {
            // Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          console.error("Non-JSON response during fetch:", text);
          throw new Error(
            "Server did not return JSON or authentication failed"
          );
        }

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch tasks");
        } else {
          setTasks(data.tasks);
        }
      } catch (err) {
        console.error(err);
        if (err.message.includes("JSON")) {
          setError("Server error - please try again later");
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
        <span className="ml-4 text-xl font-medium">Loading tasks...</span>
      </div>
    );

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  const totalTasks = tasks.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-6 spiral-text">
            Your Task List
          </h1>
          {user && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              Welcome back,{" "}
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {user.username}
              </span>
              ! You have {totalTasks} task{totalTasks !== 1 ? "s" : ""} to
              manage.
            </p>
          )}
        </div>

        <div className="mb-8 flex gap-3 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <input
            type="text"
            placeholder="Add a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            className="flex-1 p-3 border-none rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0"
          />
          <button
            onClick={handleAddTask}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-150 shadow-md"
            disabled={!newTask.trim()}
          >
            Add Task
          </button>
        </div>

        <ul className="space-y-4">
          {tasks.map((task, index) => {
            const isEditing = editingTaskId === task.tasks_id;
            const isCompleted = task.completed;
            const completionStatus = isCompleted ? "Completed" : "In Progress";
            const statusColor = isCompleted
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            const barWidth = isCompleted ? 100 : 30; // Mocking 30% progress for incomplete tasks
            const barColor = isCompleted ? "bg-emerald-500" : "bg-indigo-500";

            return (
              <li
                key={task.tasks_id}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col gap-4 transition duration-300 hover:shadow-xl"
              >
                {/* Top Section: Icon, Content, Status Badge */}
                <div className="flex items-start gap-4">
                  {/* Task Icon (Placeholder for the profile circle) */}
                  <div
                    className={`p-3 rounded-full ${
                      isCompleted
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-indigo-500/10 text-indigo-500"
                    } shrink-0`}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6.253v13m0-13C10.832 5.466 9.597 5 8 5c-3.14 0-5 1.55-5 4.5 0 2.455 1.766 4.47 4.5 5.25v2.75"
                        ></path>
                      </svg>
                    )}
                  </div>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <input
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        onBlur={() => handleSaveEdit(task)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.currentTarget.blur();
                        }}
                        className="w-full text-xl font-semibold border-b border-indigo-400 dark:border-indigo-600 bg-transparent focus:outline-none"
                        autoFocus
                      />
                    ) : (
                      <p
                        className={`text-xl font-semibold mb-1 truncate ${
                          isCompleted
                            ? "line-through text-gray-500 dark:text-gray-400"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {task.content}
                      </p>
                    )}

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
                    >
                      {completionStatus}
                    </span>
                  </div>
                </div>

                {/* Middle Section: Progress Bar */}
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
                    className={`text-sm font-bold ${
                      isCompleted ? "text-emerald-500" : "text-indigo-500"
                    }`}
                  >
                    {barWidth}%
                  </span>
                </div>

                {/* Bottom Section: Action Buttons */}
                <div className="flex flex-wrap justify-end gap-2 border-t border-gray-100 dark:border-gray-700 pt-4">
                  {/* Move Up/Down Buttons */}
                  <button
                    onClick={() => handleMoveUp(task.tasks_id)}
                    disabled={index === 0}
                    title="Move Up"
                    className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      ></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleMoveDown(task.tasks_id)}
                    disabled={index === totalTasks - 1}
                    title="Move Down"
                    className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      ></path>
                    </svg>
                  </button>

                  {/* Toggle Completed */}
                  <button
                    onClick={() => handleToggleCompleted(task)}
                    title={isCompleted ? "Mark Incomplete" : "Mark Complete"}
                    className={`p-2 rounded-lg text-sm font-medium transition ${
                      isCompleted
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : "bg-emerald-500 hover:bg-emerald-600 text-white"
                    }`}
                  >
                    {isCompleted ? "Reopen" : "Complete"}
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleUpdateTask(task)}
                    title="Edit Task"
                    disabled={isEditing}
                    className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition disabled:opacity-50"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-7-3L19 3m-2 2l-2-2"
                      ></path>
                    </svg>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteClick(task.tasks_id)}
                    title="Delete Task"
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        {totalTasks === 0 && !loading && (
          <div className="mt-10 p-8 text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
              All caught up! Time to add a new task.
            </p>
          </div>
        )}
      </div>
      <Popup
        isOpen={showDeletePopup}
        message="Are you sure you want to delete this task?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
