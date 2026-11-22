import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redisClient = createClient({
  url: redisUrl,
});

redisClient.on("error", (error) => {
  console.error("Redis Client Error:", error);
});

let connectionPromise: Promise<void> | undefined;

export async function connectRedis(): Promise<void> {
  if (redisClient.isOpen) return;

  if (!connectionPromise) {
    connectionPromise = redisClient
      .connect()
      .then(() => undefined)
      .catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
  }

  await connectionPromise;
}
