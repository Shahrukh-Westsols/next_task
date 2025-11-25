import { NextResponse } from "next/server";
import { Pool } from "pg";
import jwt from "jsonwebtoken";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export async function POST(req, { params }) {
  try {
    // Getting token from cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verifying token
    // const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { id } = await params;
    const user_id = decoded.user_id;

    // Get the current task
    const result = await pool.query(
      "SELECT * FROM tasks WHERE tasks_id = $1 AND user_id = $2",
      [id, user_id]
    );

    const task = result.rows[0];

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    // Find the task below (bigger position)
    const below = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1 AND position > $2 ORDER BY position ASC LIMIT 1",
      [user_id, task.position]
    );

    if (below.rows.length === 0) {
      return NextResponse.json({ message: "Already at bottom" });
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

    return NextResponse.json({ message: "Moved down successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
