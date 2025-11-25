"use client";

import { useEffect, useState } from "react";
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
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ content: newTask }),
      });

      // Check if the response is JSON becouse we were having errors of getting https page when backend was not synced and next was sending https error page
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
        alert(data.message || "Failed to delete task");
      } else {
        setTasks(tasks.filter((task) => task.tasks_id !== taskToDelete));
      }
    } catch (err) {
      console.error(err);
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

  const handleDeleteTask = async (id) => {
    // const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          // Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to delete task");
      } else {
        setTasks(tasks.filter((task) => task.tasks_id !== id));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting task");
    }
  };

  const handleUpdateTask = async (task) => {
    // const token = localStorage.getItem("token");

    const newContent = prompt("Update task", task.content);
    if (!newContent) return;

    try {
      const res = await fetch(`/api/tasks/${task.tasks_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          content: newContent,
          completed: task.completed,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to update");
      } else {
        setTasks(
          tasks.map((t) => (t.tasks_id === task.tasks_id ? data.task : t))
        );
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

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
        const res = await fetch("/api/tasks", {
          headers: {
            // Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3">Loading tasks...</span>
      </div>
    );

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Your Tasks</h1>
        {user && (
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Welcome back,{" "}
            <span className="font-semibold text-blue-600">{user.username}</span>
            ! You have {tasks.length} task{tasks.length !== 1 ? "s" : ""}.
          </p>
        )}
      </div>

      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Add a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 p-3 border rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddTask}
          className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>

      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task.tasks_id}
            className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow flex justify-between items-center"
          >
            <span>
              {editingTaskId === task.tasks_id ? (
                <input
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  onBlur={async () => {
                    // const token = localStorage.getItem("token");
                    const res = await fetch(`/api/tasks/${task.tasks_id}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        // Authorization: `Bearer ${token}`,
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
                        tasks.map((t) =>
                          t.tasks_id === task.tasks_id ? data.task : t
                        )
                      );
                    }
                    setEditingTaskId(null);
                  }}
                  className="border rounded p-1"
                  autoFocus
                />
              ) : (
                <>
                  {task.content} {task.completed ? "(Completed)" : ""}
                </>
              )}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => handleMoveUp(task.tasks_id)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              >
                ↑
              </button>
              <button
                onClick={() => handleMoveDown(task.tasks_id)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              >
                ↓
              </button>
              <button
                onClick={() => {
                  setEditingTaskId(task.tasks_id);
                  setEditingContent(task.content);
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              >
                Update
              </button>
              <button
                // onClick={() => handleDeleteTask(task.tasks_id)}
                onClick={() => handleDeleteClick(task.tasks_id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <Popup
        isOpen={showDeletePopup}
        message="Are you sure you want to delete this task?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
