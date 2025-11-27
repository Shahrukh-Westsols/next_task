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

    // Verify token and check if user is admin
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Clear the specific user's cache
    const cacheKey = `tasks:user:${userId}`;
    await redis.del(cacheKey);

    console.log(`Admin cleared cache for user ${userId}`);

    // Log admin action in audit trail
    await AuditEvents.cacheInvalidation(decoded.user_id, cacheKey, {
      clearedByAdmin: true,
      targetUser: userId,
    });

    return NextResponse.json({
      success: true,
      message: `Cache cleared for user ${userId}`,
      cacheKey,
    });
  } catch (error) {
    console.error("Admin cache clearance error:", error);

    if (error.name === "JsonWebTokenError") {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Failed to clear cache" },
      { status: 500 }
    );
  }
}
