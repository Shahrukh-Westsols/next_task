const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // our frontend URL
    credentials: true, // This allows cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());

const { authMiddleware } = require("./middleware");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  console.log("Connected to PostgreSQL database successfully!");
  release();
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.post("/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userQuery.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = userQuery.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // const isProduction = process.env.NODE_ENV === "production";
    // console.log("Setting cookie with token:", token.substring(0, 20) + "...");

    // Setting cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
      secure: false, // Changed this to false for development
      sameSite: "lax", // Changed from "strict" to "lax"
      // secure: isProduction, // true in production, false in development
      // sameSite: isProduction ? "strict" : "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      token: token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/auth/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
  });

  res.json({ message: "Logged out successfully" });
});

app.get("/tasks", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.user_id;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const tasksQuery = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY position ASC",
      [user_id]
    );

    res.json({ tasks: tasksQuery.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/tasks", authMiddleware, async (req, res) => {
  try {
    // const { user_id, content } = req.body;
    const user_id = req.user.user_id;
    const { content } = req.body;

    if (!user_id || !content) {
      return res.status(400).json({ message: "User ID and content required" });
    }

    // Find the current max position for this user
    const posResult = await pool.query(
      "SELECT COALESCE(MAX(position), 0) + 1 AS next_pos FROM tasks WHERE user_id = $1",
      [user_id]
    );

    const nextPosition = posResult.rows[0].next_pos;

    const newTask = await pool.query(
      "INSERT INTO tasks (user_id, content, position) VALUES ($1, $2, $3) RETURNING *",
      [user_id, content, nextPosition]
    );

    res.status(201).json({ task: newTask.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await pool.query(
      "DELETE FROM tasks WHERE tasks_id = $1 RETURNING *",
      [id]
    );

    if (deletedTask.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({
      message: "Task deleted successfully",
      task: deletedTask.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { content, completed } = req.body;

    const updatedTask = await pool.query(
      "UPDATE tasks SET content = $1, completed = $2 WHERE tasks_id = $3 RETURNING *",
      [content, completed, id]
    );

    if (updatedTask.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({
      message: "Task updated successfully",
      task: updatedTask.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/tasks/:id/move-up", authMiddleware, async (req, res) => {
  const { id } = req.params;

  // Get the current task
  const result = await pool.query("SELECT * FROM tasks WHERE tasks_id = $1", [
    id,
  ]);
  const task = result.rows[0];

  if (!task) return res.status(404).json({ message: "Task not found" });

  // Get the task above it (task with smaller position)
  const above = await pool.query(
    "SELECT * FROM tasks WHERE user_id = $1 AND position < $2 ORDER BY position DESC LIMIT 1",
    [task.user_id, task.position]
  );

  if (above.rows.length === 0) {
    return res.json({ message: "Already at top" });
  }

  const taskAbove = above.rows[0];

  // Swap their positions
  await pool.query("UPDATE tasks SET position = $1 WHERE tasks_id = $2", [
    taskAbove.position,
    task.tasks_id,
  ]);

  await pool.query("UPDATE tasks SET position = $1 WHERE tasks_id = $2", [
    task.position,
    taskAbove.tasks_id,
  ]);

  res.json({ message: "Moved up successfully" });
});

app.post("/tasks/:id/move-down", authMiddleware, async (req, res) => {
  const { id } = req.params;

  const result = await pool.query("SELECT * FROM tasks WHERE tasks_id = $1", [
    id,
  ]);
  const task = result.rows[0];

  if (!task) return res.status(404).json({ message: "Task not found" });

  // Find the task below (bigger position)
  const below = await pool.query(
    "SELECT * FROM tasks WHERE user_id = $1 AND position > $2 ORDER BY position ASC LIMIT 1",
    [task.user_id, task.position]
  );

  if (below.rows.length === 0) {
    return res.json({ message: "Already at bottom" });
  }

  const taskBelow = below.rows[0];

  // Swap
  await pool.query("UPDATE tasks SET position = $1 WHERE tasks_id = $2", [
    taskBelow.position,
    task.tasks_id,
  ]);

  await pool.query("UPDATE tasks SET position = $1 WHERE tasks_id = $2", [
    task.position,
    taskBelow.tasks_id,
  ]);

  res.json({ message: "Moved down successfully" });
});
