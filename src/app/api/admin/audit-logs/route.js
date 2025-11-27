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

// GET /api/admin/audit-logs - Fetch audit logs with filtering
export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify token and check if user is admin
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user is admin
    if (decoded.role !== "admin") {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "";
    const action = searchParams.get("action") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const offset = (page - 1) * limit;

    // Build WHERE clause for filtering
    let whereConditions = [];
    let queryParams = [];
    let paramCount = 0;

    if (userId) {
      paramCount++;
      whereConditions.push(`user_id = $${paramCount}`);
      queryParams.push(userId);
    }

    if (action) {
      paramCount++;
      whereConditions.push(`action = $${paramCount}`);
      queryParams.push(action);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Add pagination parameters
    queryParams.push(limit, offset);

    // Get total count for pagination
    const countQuery = await pool.query(
      `SELECT COUNT(*) FROM audit_logs ${whereClause}`,
      queryParams.slice(0, -2) // Remove limit and offset for count
    );
    const totalCount = parseInt(countQuery.rows[0].count);

    // Get paginated logs
    const logsQuery = await pool.query(
      `SELECT * FROM audit_logs 
       ${whereClause} 
       ORDER BY created_at DESC 
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      queryParams
    );

    return NextResponse.json({
      logs: logsQuery.rows,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Audit logs fetch error:", error);

    if (error.name === "JsonWebTokenError") {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}
