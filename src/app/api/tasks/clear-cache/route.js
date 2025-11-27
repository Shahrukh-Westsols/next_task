import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import redis from "../../../lib/redis";
import { AuditEvents } from "../../../lib/audit";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.user_id;

    // Clear user's cache
    const cacheKey = `tasks:user:${user_id}`;
    await redis.del(cacheKey);

    console.log(`Manually cleared cache for user ${user_id}`);

    // Log cache invalidation in audit trail
    await AuditEvents.cacheInvalidation(user_id, cacheKey);

    return NextResponse.json({
      success: true,
      message: "Cache cleared successfully",
      cacheKey,
    });
  } catch (error) {
    console.error("Clear cache error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to clear cache" },
      { status: 500 }
    );
  }
}
