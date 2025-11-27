import { NextResponse } from "next/server";
import redis from "../../lib/redis";

export async function GET() {
  try {
    // Test Redis connection
    await redis.set("test-key", "Redis is working!", "EX", 10);
    const value = await redis.get("test-key");

    return NextResponse.json({
      success: true,
      message: "Redis connection test",
      data: value,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Redis connection failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
