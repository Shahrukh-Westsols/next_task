import { NextResponse } from "next/server";
import { Pool } from "pg";
import jwt from "jsonwebtoken";
import redis from "../../lib/redis";
import { AuditEvents } from "../../lib/audit";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// GET /api/tasks - With Redis caching
export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.user_id;

    // Redis cache key per user
    const cacheKey = `tasks:user:${user_id}`;

    console.log(`🔍 Checking Redis cache for key: ${cacheKey}`);

    // Try to get from cache first
    const cachedTasks = await redis.get(cacheKey);

    if (cachedTasks) {
      console.log(`✅ Cache HIT for user ${user_id}`);

      // Log cache hit in audit trail
      await AuditEvents.cacheHit(user_id, cacheKey);

      return NextResponse.json({
        tasks: JSON.parse(cachedTasks),
        source: "CACHED", // This will show in UI
      });
    }

    console.log(`❌ Cache MISS for user ${user_id}, fetching from database`);

    // Cache miss - fetch from database
    const tasksQuery = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY position ASC",
      [user_id]
    );

    // Store in Redis with 30-second expiration
    await redis.setex(cacheKey, 30, JSON.stringify(tasksQuery.rows));

    console.log(`💾 Cached tasks for user ${user_id} for 30 seconds`);

    // Log cache write in audit trail
    await AuditEvents.cacheWrite(user_id, cacheKey, 30);

    return NextResponse.json({
      tasks: tasksQuery.rows,
      source: "LIVE", // This will show in UI
    });
  } catch (err) {
    console.error("Tasks API Error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST /api/tasks - With cache invalidation
export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.user_id;

    const { content } = await req.json();
    if (!content || !content.trim()) {
      return NextResponse.json(
        { message: "Task content is required" },
        { status: 400 }
      );
    }

    // Determine next position
    const posRes = await pool.query(
      "SELECT COALESCE(MAX(position), 0) + 1 AS next_pos FROM tasks WHERE user_id = $1",
      [user_id]
    );
    const position = posRes.rows[0].next_pos;

    const insertRes = await pool.query(
      "INSERT INTO tasks (user_id, content, completed, position) VALUES ($1, $2, false, $3) RETURNING *",
      [user_id, content, position]
    );

    const newTask = insertRes.rows[0];

    // Invalidate cache when task is created
    const cacheKey = `tasks:user:${user_id}`;
    await redis.del(cacheKey);

    console.log(`🗑️ Invalidated cache for user ${user_id} after task creation`);

    // Log task creation and cache invalidation
    await AuditEvents.taskCreated(user_id, newTask.tasks_id, content);
    await AuditEvents.cacheInvalidation(user_id, cacheKey);

    return NextResponse.json({
      task: newTask,
      message: "Task created successfully",
    });
  } catch (err) {
    console.error("Create Task Error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
