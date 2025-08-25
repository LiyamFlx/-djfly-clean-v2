import jwt from 'jsonwebtoken';
import { redisClient } from '../database/connection.js';

export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Check if token is blacklisted
    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({
        error: 'Token has been revoked.',
        code: 'TOKEN_REVOKED'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Add user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role || 'user',
      permissions: decoded.permissions || []
    };

    // Check if user has required permissions (if specified)
    if (req.requiredPermissions) {
      const hasPermission = req.requiredPermissions.some(permission => 
        req.user.permissions.includes(permission)
      );
      
      if (!hasPermission) {
        return res.status(403).json({
          error: 'Insufficient permissions.',
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token has expired.',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token.',
        code: 'INVALID_TOKEN'
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: 'Internal server error during authentication.',
      code: 'AUTH_ERROR'
    });
  }
};

// Permission-based middleware
export const requirePermission = (permission) => {
  return (req, res, next) => {
    req.requiredPermissions = [permission];
    next();
  };
};

// Role-based middleware
export const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Insufficient role.',
        code: 'INSUFFICIENT_ROLE'
      });
    }
    next();
  };
};

// Optional authentication (for public routes that can show user-specific content)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role || 'user'
      };
    }
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};
