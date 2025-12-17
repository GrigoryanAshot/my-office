// Upstash Redis client for storing verification codes.
import { Redis } from '@upstash/redis';

let redis: Redis | undefined;

/**
 * Initializes and returns a singleton Redis client.
 * This function ensures that the client is only created once, at runtime,
 * when the environment variables are available.
 */
function getRedisClient(): Redis {
  if (!redis) {
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!redisUrl || !redisToken) {
      // This will now only run if the variables are missing at runtime.
      throw new Error('FATAL: Upstash Redis URL or Token is not set in environment variables.');
    }

    // Manually initialize the Redis client.
    redis = new Redis({
      url: redisUrl,
      token: redisToken,
    });
  }
  return redis;
}

// Track verified users for admin panel access
const verifiedUsers = new Map<string, { verifiedAt: number; expiresAt: number }>();

export const verificationStorage = {
  /**
   * Stores a verification code for a given email.
   * @param email The user's email.
   * @param code The verification code.
   * @param expiresAt The timestamp when the code expires.
   */
  set: async (email: string, code: string, expiresAt: number) => {
    const client = getRedisClient();
    const ttl = Math.ceil((expiresAt - Date.now()) / 1000);
    await client.set(`verification:${email}`, code, { ex: ttl });
  },
  
  /**
   * Retrieves a verification code for a given email.
   * @param email The user's email.
   * @returns The stored code or null if not found.
   */
  get: async (email: string) => {
    const client = getRedisClient();
    const code = await client.get<string>(`verification:${email}`);
    return code ? { code, expiresAt: 0 } : null; 
  },
  
  /**
   * Deletes a verification code for a given email.
   * @param email The user's email.
   */
  delete: async (email: string) => {
    const client = getRedisClient();
    await client.del(`verification:${email}`);
  },
  
  /**
   * Marks a user as verified for admin panel access.
   * @param email The user's email.
   */
  markVerified: async (email: string) => {
    const client = getRedisClient();
    const ttl = 24 * 60 * 60; // 24 hours in seconds.
    await client.set(`verified:${email}`, "true", { ex: ttl });
  },
  
  /**
   * Checks if a user is verified for admin panel access.
   * @param email The user's email.
   * @returns True if verified, false otherwise.
   */
  isVerified: async (email: string) => {
    const client = getRedisClient();
    const result = await client.get<string>(`verified:${email}`);
    return result === "true";
  },
  
  /**
   * Removes a user's verification status.
   * @param email The user's email.
   */
  removeVerification: async (email: string) => {
    const client = getRedisClient();
    await client.del(`verified:${email}`);
  },

  // The following functions are no longer needed as Redis handles cleanup,
  // but they are kept as no-op functions to avoid breaking other parts of the code.
  cleanup: () => { /* No-op */ },
  cleanupVerifications: () => { /* No-op */ },
  debug: () => { return Promise.resolve([]); },
}; 