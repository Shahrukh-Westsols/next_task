"use client";

import { useEffect, useState } from "react";

export default function TasksPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const handleAddTask = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!newTask.trim()) return;

    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: user.user_id, content: newTask }),
      });

      // Check if the response is JSON
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

  const handleDeleteTask = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    const token = localStorage.getItem("token");

    const newContent = prompt("Update task", task.content);
    if (!newContent) return;

    try {
      const res = await fetch(`${API_URL}/tasks/${task.tasks_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
    const token = localStorage.getItem("token");

    // Update backend
    await fetch(`${API_URL}/tasks/${id}/move-up`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
    const token = localStorage.getItem("token");

    // Update backend
    await fetch(`${API_URL}/tasks/${id}/move-down`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user || !token) {
        window.location.href = "/login"; // redirect if not logged in
        return;
      }

      try {
        const res = await fetch(`${API_URL}/tasks?user_id=${user.user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch tasks");
        } else {
          setTasks(data.tasks);
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Your Tasks</h1>
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
                    const token = localStorage.getItem("token");
                    const res = await fetch(
                      `${API_URL}/tasks/${task.tasks_id}`,
                      {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          content: editingContent,
                          completed: task.completed,
                        }),
                      }
                    );
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
                onClick={() => handleDeleteTask(task.tasks_id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// export default function TasksPage() {
//   // Sample tasks for now
//   const tasks = [
//     { id: 1, title: "Learn Next.js Basics" },
//     { id: 2, title: "Set up TailwindCSS" },
//     { id: 3, title: "Create Login and Register Pages" },
//   ];

//   return (
//     <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white p-8">
//       <h1 className="text-3xl font-bold mb-6">Your Tasks</h1>
//       <ul className="space-y-4">
//         {tasks.map((task) => (
//           <li
//             key={task.id}
//             className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow hover:shadow-md transition"
//           >
//             {task.title}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

//seperate

// "use client";

// import { useState } from "react";

// export default function TasksPage() {
//   // Initial tasks
//   const [tasks, setTasks] = useState([
//     { id: 1, title: "Learn Next.js Basics" },
//     { id: 2, title: "Set up TailwindCSS" },
//     { id: 3, title: "Create Login and Register Pages" },
//   ]);

//   // Move task up
//   const moveUp = (index) => {
//     if (index === 0) return; // first item cannot move up
//     const newTasks = [...tasks];
//     [newTasks[index - 1], newTasks[index]] = [
//       newTasks[index],
//       newTasks[index - 1],
//     ];
//     setTasks(newTasks);
//   };

//   // Move task down
//   const moveDown = (index) => {
//     if (index === tasks.length - 1) return; // last item cannot move down
//     const newTasks = [...tasks];
//     [newTasks[index], newTasks[index + 1]] = [
//       newTasks[index + 1],
//       newTasks[index],
//     ];
//     setTasks(newTasks);
//   };

//   // Update task
//   const updateTask = (index) => {
//     const newTitle = prompt("Enter new task title:", tasks[index].title);
//     if (newTitle) {
//       const newTasks = [...tasks];
//       newTasks[index].title = newTitle;
//       setTasks(newTasks);
//     }
//   };

//   // Delete task
//   const deleteTask = (index) => {
//     const newTasks = tasks.filter((_, i) => i !== index);
//     setTasks(newTasks);
//   };

//   return (
//     <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white p-8">
//       <h1 className="text-3xl font-bold mb-6">Your Tasks</h1>
//       <ul className="space-y-4">
//         {tasks.map((task, index) => (
//           <li
//             key={task.id}
//             className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow flex justify-between items-center"
//           >
//             <span>{task.title}</span>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => moveUp(index)}
//                 className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
//               >
//                 ↑
//               </button>
//               <button
//                 onClick={() => moveDown(index)}
//                 className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
//               >
//                 ↓
//               </button>
//               <button
//                 onClick={() => updateTask(index)}
//                 className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
//               >
//                 Update
//               </button>
//               <button
//                 onClick={() => deleteTask(index)}
//                 className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
//               >
//                 Delete
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
