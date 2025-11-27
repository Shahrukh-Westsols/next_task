import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || "",
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
});

redis.on("connect", () => {
  console.log("Connected to Redis successfully");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redis.on("ready", () => {
  console.log("Redis client is ready to use");
});

// Test connection on startup
(async () => {
  try {
    await redis.ping();
    console.log("Redis ping successful");
  } catch (error) {
    console.error("Redis ping failed:", error);
  }
})();

export default redis;
