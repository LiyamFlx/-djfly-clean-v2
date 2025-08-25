import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { postgresPool, redisClient } from '../database/connection.js';

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  username: Joi.string().min(3).max(30).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// User registration
router.post('/register', async (req, res) => {
  try {
    // Validate input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(d => d.message)
      });
    }

    const { email, password, username, firstName, lastName } = value;

    // Check if user already exists
    const existingUser = await postgresPool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: 'User with this email or username already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await postgresPool.query(
      `INSERT INTO users (email, password_hash, username, first_name, last_name, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, email, username, first_name, last_name, created_at`,
      [email, hashedPassword, username, firstName, lastName]
    );

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser.rows[0].id,
        email: newUser.rows[0].email,
        role: 'user',
        permissions: ['read:own', 'write:own']
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Store token in Redis for session management
    await redisClient.setEx(`session:${newUser.rows[0].id}`, 86400, token);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.rows[0].id,
        email: newUser.rows[0].email,
        username: newUser.rows[0].username,
        firstName: newUser.rows[0].first_name,
        lastName: newUser.rows[0].last_name,
        createdAt: newUser.rows[0].created_at
      },
      token,
      expiresIn: '24h'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal server error during registration'
    });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(d => d.message)
      });
    }

    const { email, password } = value;

    // Find user
    const user = await postgresPool.query(
      'SELECT id, email, password_hash, username, first_name, last_name, role FROM users WHERE email = $1',
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const userData = user.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, userData.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: userData.id,
        email: userData.email,
        role: userData.role || 'user',
        permissions: ['read:own', 'write:own']
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Store token in Redis for session management
    await redisClient.setEx(`session:${userData.id}`, 86400, token);

    // Update last login
    await postgresPool.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [userData.id]
    );

    res.json({
      message: 'Login successful',
      user: {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        firstName: userData.first_name,
        lastName: userData.last_name,
        role: userData.role
      },
      token,
      expiresIn: '24h'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error during login'
    });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      // Decode token to get user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Remove session from Redis
      await redisClient.del(`session:${decoded.userId}`);
      
      // Add token to blacklist
      await redisClient.setEx(`blacklist:${token}`, 86400, 'revoked');
    }

    res.json({
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Internal server error during logout'
    });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'No token provided'
      });
    }

    const token = authHeader.substring(7);
    
    // Verify current token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if session exists
    const sessionExists = await redisClient.get(`session:${decoded.userId}`);
    if (!sessionExists) {
      return res.status(401).json({
        error: 'Session expired'
      });
    }

    // Generate new token
    const newToken = jwt.sign(
      {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        permissions: decoded.permissions
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Update session in Redis
    await redisClient.setEx(`session:${decoded.userId}`, 86400, newToken);

    res.json({
      message: 'Token refreshed successfully',
      token: newToken,
      expiresIn: '24h'
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      error: 'Invalid or expired token'
    });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'No token provided'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    const user = await postgresPool.query(
      'SELECT id, email, username, first_name, last_name, role, created_at, last_login FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        username: user.rows[0].username,
        firstName: user.rows[0].first_name,
        lastName: user.rows[0].last_name,
        role: user.rows[0].role,
        createdAt: user.rows[0].created_at,
        lastLogin: user.rows[0].last_login
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export { router as authRouter };
