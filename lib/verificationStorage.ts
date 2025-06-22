// Upstash Redis client for storing verification codes.
import { Redis } from '@upstash/redis';

// Initialize Redis client from environment variables.
// The '!' tells TypeScript that we are sure these variables will be present.
const redis = Redis.fromEnv();

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
    // Calculate the Time-To-Live (TTL) in seconds.
    const ttl = Math.ceil((expiresAt - Date.now()) / 1000);
    // Use a prefix to prevent key collisions.
    await redis.set(`verification:${email}`, code, { ex: ttl });
  },
  
  /**
   * Retrieves a verification code for a given email.
   * @param email The user's email.
   * @returns The stored code or null if not found.
   */
  get: async (email: string) => {
    const code = await redis.get<string>(`verification:${email}`);
    // The structure is simplified as Redis handles expiry.
    return code ? { code, expiresAt: 0 } : null; 
  },
  
  /**
   * Deletes a verification code for a given email.
   * @param email The user's email.
   */
  delete: async (email: string) => {
    await redis.del(`verification:${email}`);
  },
  
  /**
   * Marks a user as verified for admin panel access.
   * @param email The user's email.
   */
  markVerified: async (email: string) => {
    const ttl = 24 * 60 * 60; // 24 hours in seconds.
    await redis.set(`verified:${email}`, "true", { ex: ttl });
  },
  
  /**
   * Checks if a user is verified for admin panel access.
   * @param email The user's email.
   * @returns True if verified, false otherwise.
   */
  isVerified: async (email: string) => {
    const result = await redis.get<string>(`verified:${email}`);
    return result === "true";
  },
  
  /**
   * Removes a user's verification status.
   * @param email The user's email.
   */
  removeVerification: async (email: string) => {
    await redis.del(`verified:${email}`);
  },

  // The following functions are no longer needed as Redis handles cleanup,
  // but they are kept as no-op functions to avoid breaking other parts of the code.
  cleanup: () => { /* No-op */ },
  cleanupVerifications: () => { /* No-op */ },
  debug: () => { return Promise.resolve([]); },
}; 