// In-memory storage for verification codes (in production, use Redis or database)
const verificationCodes = new Map<string, { code: string; expiresAt: number }>();

// Track verified users for admin panel access
const verifiedUsers = new Map<string, { verifiedAt: number; expiresAt: number }>();

export const verificationStorage = {
  set: (email: string, code: string, expiresAt: number) => {
    verificationCodes.set(email, { code, expiresAt });
  },
  
  get: (email: string) => {
    return verificationCodes.get(email);
  },
  
  delete: (email: string) => {
    verificationCodes.delete(email);
  },
  
  // Clean up expired codes
  cleanup: () => {
    const now = Date.now();
    Array.from(verificationCodes.entries()).forEach(([email, data]) => {
      if (now > data.expiresAt) {
        verificationCodes.delete(email);
      }
    });
  },
  
  // Debug method to get all stored codes
  debug: () => {
    return Array.from(verificationCodes.entries());
  },
  
  // Mark user as verified for admin panel access
  markVerified: (email: string) => {
    const verifiedAt = Date.now();
    const expiresAt = verifiedAt + 24 * 60 * 60 * 1000; // 24 hours
    verifiedUsers.set(email, { verifiedAt, expiresAt });
  },
  
  // Check if user is verified for admin panel access
  isVerified: (email: string) => {
    const userData = verifiedUsers.get(email);
    if (!userData) return false;
    
    // Check if verification has expired
    if (Date.now() > userData.expiresAt) {
      verifiedUsers.delete(email);
      return false;
    }
    
    return true;
  },
  
  // Remove user verification
  removeVerification: (email: string) => {
    verifiedUsers.delete(email);
  },
  
  // Clean up expired verifications
  cleanupVerifications: () => {
    const now = Date.now();
    Array.from(verifiedUsers.entries()).forEach(([email, data]) => {
      if (now > data.expiresAt) {
        verifiedUsers.delete(email);
      }
    });
  }
}; 