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

export async function PUT(req, { params }) {
  try {
    console.log("PUT - params:", params);
    console.log("PUT - id from params:", params.id);
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.user_id;

    const { content, completed } = await req.json();
    const { id } = await params;

    const updateRes = await pool.query(
      "UPDATE tasks SET content=$1, completed=$2 WHERE tasks_id=$3 AND user_id=$4 RETURNING *",
      [content, completed, id, user_id]
    );

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({
      task: updateRes.rows[0],
      message: "Task updated successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    console.log("DELETE - params:", params);
    console.log("DELETE - id from params:", params.id);
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.user_id;

    const { id } = await params;

    const deleteRes = await pool.query(
      "DELETE FROM tasks WHERE tasks_id=$1 AND user_id=$2 RETURNING *",
      [id, user_id]
    );

    if (deleteRes.rows.length === 0) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({
      task: deleteRes.rows[0],
      message: "Task deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
