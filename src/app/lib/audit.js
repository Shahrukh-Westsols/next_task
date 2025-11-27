import pool from "./db";

export async function logAuditEvent(userId, action, metadata = {}) {
  try {
    const result = await pool.query(
      "INSERT INTO audit_logs (user_id, action, metadata) VALUES ($1, $2, $3) RETURNING id",
      [userId, action, JSON.stringify(metadata)]
    );
    console.log(`Audit logged: ${action} for user ${userId}`);
    return result.rows[0];
  } catch (error) {
    console.error("Audit log error:", error);
    // Don't throw error - we don't want audit failures to break main functionality
  }
}

// Convenience functions for common audit events
export const AuditEvents = {
  async loginSuccess(userId, email) {
    return await logAuditEvent(userId, "login_success", { email });
  },

  async loginFailure(email, reason) {
    // Use 0 for user_id when login fails (no user identified)
    return await logAuditEvent(0, "login_failure", { email, reason });
  },

  async logout(userId) {
    return await logAuditEvent(userId, "logout", {});
  },

  async taskCreated(userId, taskId, content) {
    return await logAuditEvent(userId, "task_created", { taskId, content });
  },

  async taskUpdated(userId, taskId, changes) {
    return await logAuditEvent(userId, "task_updated", { taskId, changes });
  },

  async taskDeleted(userId, taskId) {
    return await logAuditEvent(userId, "task_deleted", { taskId });
  },

  async cacheHit(userId, cacheKey) {
    return await logAuditEvent(userId, "cache_hit", { cacheKey });
  },

  async cacheWrite(userId, cacheKey, ttl) {
    return await logAuditEvent(userId, "cache_write", { cacheKey, ttl });
  },

  async cacheInvalidation(userId, cacheKey) {
    return await logAuditEvent(userId, "cache_invalidation", { cacheKey });
  },
  // Add to AuditEvents object
  async adminCacheClearance(adminUserId, targetUserId, cacheKey) {
    return await logAuditEvent(adminUserId, "admin_cache_clearance", {
      targetUserId,
      cacheKey,
      clearedByAdmin: true,
    });
  },
};
