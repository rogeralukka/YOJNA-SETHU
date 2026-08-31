import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { prisma } from '../db/prisma.js';
import { sendError } from '../utils/response.js';

export const generateToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
};

export const authenticate = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return sendError(res, 'Authentication token required. Please log in.', 401);
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        mobile: true,
        role: true,
        category: true,
        state: true,
        annualIncome: true,
        age: true,
        gender: true,
        accountHolderName: true,
        accountNumber: true,
        ifscCode: true,
        bankName: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return sendError(res, 'User session expired or user not found.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Session expired. Please log in again.', 401);
    }
    return sendError(res, 'Invalid authentication token.', 401);
  }
};

export const optionalAuthenticate = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }

    if (token) {
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          fullName: true,
          email: true,
          mobile: true,
          role: true,
          category: true,
          state: true,
          annualIncome: true,
          age: true,
          gender: true
        }
      });
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // Ignore invalid token for optional auth
  }
  next();
};

export const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]`, 403);
    }

    next();
  };
};

export const requireAdmin = requireRoles('admin', 'super_admin');
export const requireSuperAdmin = requireRoles('super_admin');
