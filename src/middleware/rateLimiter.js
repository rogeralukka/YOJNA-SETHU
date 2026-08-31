import { sendError } from '../utils/response.js';

/**
 * In-memory sliding window rate limiter
 * @param {Object} options - { windowMs: number, maxRequests: number, message: string }
 */
export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000, // 15 minutes
  maxRequests = 100,
  message = 'Too many requests. Please try again later.'
} = {}) => {
  const requestHistory = new Map();

  // Periodic cleanup every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of requestHistory.entries()) {
      const validTimestamps = timestamps.filter(time => now - time < windowMs);
      if (validTimestamps.length === 0) {
        requestHistory.delete(ip);
      } else {
        requestHistory.set(ip, validTimestamps);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req, res, next) => {
    // Disable rate limiting in test environment unless explicitly requested
    if (process.env.NODE_ENV === 'test' && !req.headers['x-test-rate-limit']) {
      return next();
    }

    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    const clientRequests = requestHistory.get(clientIp) || [];
    const validRequests = clientRequests.filter(time => now - time < windowMs);

    if (validRequests.length >= maxRequests) {
      const oldestRequest = validRequests[0];
      const resetTimeMs = windowMs - (now - oldestRequest);
      const retryAfterSec = Math.ceil(resetTimeMs / 1000);

      res.setHeader('Retry-After', retryAfterSec);
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', 0);

      return sendError(res, message, 429, { retryAfterSeconds: retryAfterSec });
    }

    validRequests.push(now);
    requestHistory.set(clientIp, validRequests);

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - validRequests.length));

    next();
  };
};

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 30, // 30 login/register attempts per 15 minutes per IP
  message: 'Too many authentication attempts from this IP. Please wait before trying again.'
});

export const apiRateLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000,
  maxRequests: 180, // 180 requests per minute for general API routes
  message: 'API rate limit exceeded. Please throttle your requests.'
});
