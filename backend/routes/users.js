import express from 'express';
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import { postgresPool } from '../database/connection.js';

const router = express.Router();

// Validation schemas
const updateProfileSchema = Joi.object({
  username: Joi.string().min(3).max(30).optional(),
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  bio: Joi.string().max(500).optional(),
  preferences: Joi.object({
    favoriteGenres: Joi.array().items(Joi.string()).optional(),
    preferredBPM: Joi.object({
      min: Joi.number().min(60).max(200).optional(),
      max: Joi.number().min(60).max(200).optional()
    }).optional(),
    energyLevel: Joi.number().min(0).max(100).optional()
  }).optional()
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required()
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user.id;

    const userResult = await postgresPool.query(
      `SELECT id, email, username, first_name, last_name, bio, role, created_at, last_login,
              preferences
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const user = userResult.rows[0];

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        bio: user.bio,
        role: user.role,
        preferences: user.preferences || {},
        createdAt: user.created_at,
        lastLogin: user.last_login
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching profile'
    });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    // Validate input
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(d => d.message)
      });
    }

    const userId = req.user.id;
    const { username, firstName, lastName, bio, preferences } = value;

    // Check if username is already taken
    if (username) {
      const existingUser = await postgresPool.query(
        'SELECT id FROM users WHERE username = $1 AND id != $2',
        [username, userId]
      );

      if (existingUser.rows.length > 0) {
        return res.status(409).json({
          error: 'Username already taken'
        });
      }
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;

    if (username) {
      updateFields.push(`username = $${paramCount++}`);
      updateValues.push(username);
    }

    if (firstName) {
      updateFields.push(`first_name = $${paramCount++}`);
      updateValues.push(firstName);
    }

    if (lastName) {
      updateFields.push(`last_name = $${paramCount++}`);
      updateValues.push(lastName);
    }

    if (bio !== undefined) {
      updateFields.push(`bio = $${paramCount++}`);
      updateValues.push(bio);
    }

    if (preferences) {
      updateFields.push(`preferences = $${paramCount++}`);
      updateValues.push(JSON.stringify(preferences));
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'No fields to update'
      });
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(userId);

    const updateQuery = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, username, first_name, last_name, bio, preferences, updated_at
    `;

    const updateResult = await postgresPool.query(updateQuery, updateValues);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updateResult.rows[0].id,
        username: updateResult.rows[0].username,
        firstName: updateResult.rows[0].first_name,
        lastName: updateResult.rows[0].last_name,
        bio: updateResult.rows[0].bio,
        preferences: updateResult.rows[0].preferences || {},
        updatedAt: updateResult.rows[0].updated_at
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Internal server error while updating profile'
    });
  }
});

// Change password
router.put('/change-password', async (req, res) => {
  try {
    // Validate input
    const { error, value } = changePasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(d => d.message)
      });
    }

    const userId = req.user.id;
    const { currentPassword, newPassword } = value;

    // Get current password hash
    const userResult = await postgresPool.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await postgresPool.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [newPasswordHash, userId]
    );

    res.json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      error: 'Internal server error while changing password'
    });
  }
});

// Get user statistics
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id;

    // Get playlist count
    const playlistCountResult = await postgresPool.query(
      'SELECT COUNT(*) FROM playlists WHERE user_id = $1',
      [userId]
    );

    // Get total tracks
    const trackCountResult = await postgresPool.query(
      `SELECT COUNT(*) 
       FROM playlist_tracks pt
       JOIN playlists p ON pt.playlist_id = p.id
       WHERE p.user_id = $1`,
      [userId]
    );

    // Get favorite genres
    const genreResult = await postgresPool.query(
      `SELECT pt.genre, COUNT(*) as count
       FROM playlist_tracks pt
       JOIN playlists p ON pt.playlist_id = p.id
       WHERE p.user_id = $1 AND pt.genre IS NOT NULL
       GROUP BY pt.genre
       ORDER BY count DESC
       LIMIT 5`,
      [userId]
    );

    // Get average BPM
    const bpmResult = await postgresPool.query(
      `SELECT AVG(pt.bpm) as avg_bpm
       FROM playlist_tracks pt
       JOIN playlists p ON pt.playlist_id = p.id
       WHERE p.user_id = $1 AND pt.bpm IS NOT NULL`,
      [userId]
    );

    res.json({
      stats: {
        playlistCount: parseInt(playlistCountResult.rows[0].count),
        totalTracks: parseInt(trackCountResult.rows[0].count),
        favoriteGenres: genreResult.rows.map(row => ({
          genre: row.genre,
          count: parseInt(row.count)
        })),
        averageBPM: bpmResult.rows[0].avg_bpm ? Math.round(parseFloat(bpmResult.rows[0].avg_bpm)) : null
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching statistics'
    });
  }
});

// Delete user account
router.delete('/account', async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete user (cascading will handle playlists, tracks, etc.)
    await postgresPool.query('DELETE FROM users WHERE id = $1', [userId]);

    res.json({
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      error: 'Internal server error while deleting account'
    });
  }
});

export { router as userRouter };
