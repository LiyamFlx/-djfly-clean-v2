import express from 'express';
import Joi from 'joi';
import { postgresPool, redisClient } from '../database/connection.js';

const router = express.Router();

// Validation schemas
const generatePlaylistSchema = Joi.object({
  prompt: Joi.string().min(10).max(500).required(),
  context: Joi.object({
    energy: Joi.number().min(0).max(100).optional(),
    mood: Joi.string().optional(),
    genre: Joi.string().optional(),
    bpm: Joi.number().min(60).max(200).optional(),
    duration: Joi.number().min(1).max(480).optional()
  }).optional()
});

const savePlaylistSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).optional(),
  tracks: Joi.array().items(Joi.object({
    title: Joi.string().required(),
    artist: Joi.string().required(),
    album: Joi.string().optional(),
    duration: Joi.number().required(),
    bpm: Joi.number().optional(),
    key: Joi.string().optional(),
    energy: Joi.number().min(0).max(100).optional(),
    genre: Joi.string().optional()
  })).min(1).required(),
  tags: Joi.array().items(Joi.string()).optional()
});

// Generate playlist based on prompt
router.post('/generate', async (req, res) => {
  try {
    // Validate input
    const { error, value } = generatePlaylistSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(d => d.message)
      });
    }

    const { prompt, context } = value;
    const userId = req.user.id;

    // TODO: Integrate with AI service for real playlist generation
    // For now, return mock data with user context
    const mockPlaylist = await generateMockPlaylist(prompt, context, userId);

    // Cache the generated playlist
    const cacheKey = `playlist:${userId}:${Date.now()}`;
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(mockPlaylist));

    res.json({
      message: 'Playlist generated successfully',
      playlist: mockPlaylist,
      cacheKey
    });

  } catch (error) {
    console.error('Playlist generation error:', error);
    res.status(500).json({
      error: 'Internal server error during playlist generation'
    });
  }
});

// Save playlist to user's library
router.post('/save', async (req, res) => {
  try {
    // Validate input
    const { error, value } = savePlaylistSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(d => d.message)
      });
    }

    const { name, description, tracks, tags } = value;
    const userId = req.user.id;

    // Save playlist to database
    const playlistResult = await postgresPool.query(
      `INSERT INTO playlists (user_id, name, description, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING id`,
      [userId, name, description || '']
    );

    const playlistId = playlistResult.rows[0].id;

    // Save tracks
    for (const track of tracks) {
      await postgresPool.query(
        `INSERT INTO playlist_tracks (playlist_id, title, artist, album, duration, bpm, key, energy, genre, track_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [playlistId, track.title, track.artist, track.album || '', track.duration, 
         track.bpm || null, track.key || null, track.energy || null, track.genre || '', tracks.indexOf(track)]
      );
    }

    // Save tags
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        await postgresPool.query(
          `INSERT INTO playlist_tags (playlist_id, tag)
           VALUES ($1, $2)`,
          [playlistId, tag]
        );
      }
    }

    res.status(201).json({
      message: 'Playlist saved successfully',
      playlistId,
      trackCount: tracks.length
    });

  } catch (error) {
    console.error('Playlist save error:', error);
    res.status(500).json({
      error: 'Internal server error during playlist save'
    });
  }
});

// Get user's playlists
router.get('/my-playlists', async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // Get playlists with track count
    const playlistsResult = await postgresPool.query(
      `SELECT p.id, p.name, p.description, p.created_at, p.updated_at,
              COUNT(pt.id) as track_count,
              ARRAY_AGG(DISTINCT pt2.tag) FILTER (WHERE pt2.tag IS NOT NULL) as tags
       FROM playlists p
       LEFT JOIN playlist_tracks pt ON p.id = pt.playlist_id
       LEFT JOIN playlist_tags pt2 ON p.id = pt2.playlist_id
       WHERE p.user_id = $1
       GROUP BY p.id, p.name, p.description, p.created_at, p.updated_at
       ORDER BY p.updated_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    // Get total count for pagination
    const countResult = await postgresPool.query(
      'SELECT COUNT(*) FROM playlists WHERE user_id = $1',
      [userId]
    );

    const totalPlaylists = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalPlaylists / limit);

    res.json({
      playlists: playlistsResult.rows.map(row => ({
        id: row.id,
        name: row.name,
        description: row.description,
        trackCount: parseInt(row.track_count),
        tags: row.tags || [],
        createdAt: row.created_at,
        updatedAt: row.updated_at
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalPlaylists,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get playlists error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching playlists'
    });
  }
});

// Get specific playlist with tracks
router.get('/:playlistId', async (req, res) => {
  try {
    const { playlistId } = req.params;
    const userId = req.user.id;

    // Check if user owns this playlist
    const playlistResult = await postgresPool.query(
      'SELECT id, name, description, created_at, updated_at FROM playlists WHERE id = $1 AND user_id = $2',
      [playlistId, userId]
    );

    if (playlistResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Playlist not found or access denied'
      });
    }

    const playlist = playlistResult.rows[0];

    // Get tracks
    const tracksResult = await postgresPool.query(
      `SELECT id, title, artist, album, duration, bpm, key, energy, genre, track_order
       FROM playlist_tracks
       WHERE playlist_id = $1
       ORDER BY track_order`,
      [playlistId]
    );

    // Get tags
    const tagsResult = await postgresPool.query(
      'SELECT tag FROM playlist_tags WHERE playlist_id = $1',
      [playlistId]
    );

    res.json({
      playlist: {
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        tracks: tracksResult.rows.map(track => ({
          id: track.id,
          title: track.title,
          artist: track.artist,
          album: track.album,
          duration: track.duration,
          bpm: track.bpm,
          key: track.key,
          energy: track.energy,
          genre: track.genre
        })),
        tags: tagsResult.rows.map(tag => tag.tag),
        createdAt: playlist.created_at,
        updatedAt: playlist.updated_at
      }
    });

  } catch (error) {
    console.error('Get playlist error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching playlist'
    });
  }
});

// Update playlist
router.put('/:playlistId', async (req, res) => {
  try {
    const { playlistId } = req.params;
    const userId = req.user.id;
    const { name, description, tracks, tags } = req.body;

    // Check ownership
    const ownershipResult = await postgresPool.query(
      'SELECT id FROM playlists WHERE id = $1 AND user_id = $2',
      [playlistId, userId]
    );

    if (ownershipResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Playlist not found or access denied'
      });
    }

    // Update playlist details
    if (name || description !== undefined) {
      await postgresPool.query(
        'UPDATE playlists SET name = COALESCE($1, name), description = COALESCE($2, description), updated_at = NOW() WHERE id = $3',
        [name, description, playlistId]
      );
    }

    // Update tracks if provided
    if (tracks) {
      // Delete existing tracks
      await postgresPool.query('DELETE FROM playlist_tracks WHERE playlist_id = $1', [playlistId]);

      // Insert new tracks
      for (const track of tracks) {
        await postgresPool.query(
          `INSERT INTO playlist_tracks (playlist_id, title, artist, album, duration, bpm, key, energy, genre, track_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [playlistId, track.title, track.artist, track.album || '', track.duration,
           track.bpm || null, track.key || null, track.energy || null, track.genre || '', tracks.indexOf(track)]
        );
      }
    }

    // Update tags if provided
    if (tags) {
      // Delete existing tags
      await postgresPool.query('DELETE FROM playlist_tags WHERE playlist_id = $1', [playlistId]);

      // Insert new tags
      for (const tag of tags) {
        await postgresPool.query(
          'INSERT INTO playlist_tags (playlist_id, tag) VALUES ($1, $2)',
          [playlistId, tag]
        );
      }
    }

    res.json({
      message: 'Playlist updated successfully',
      playlistId
    });

  } catch (error) {
    console.error('Update playlist error:', error);
    res.status(500).json({
      error: 'Internal server error while updating playlist'
    });
  }
});

// Delete playlist
router.delete('/:playlistId', async (req, res) => {
  try {
    const { playlistId } = req.params;
    const userId = req.user.id;

    // Check ownership
    const ownershipResult = await postgresPool.query(
      'SELECT id FROM playlists WHERE id = $1 AND user_id = $2',
      [playlistId, userId]
    );

    if (ownershipResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Playlist not found or access denied'
      });
    }

    // Delete playlist (cascading will handle tracks and tags)
    await postgresPool.query('DELETE FROM playlists WHERE id = $1', [playlistId]);

    res.json({
      message: 'Playlist deleted successfully'
    });

  } catch (error) {
    console.error('Delete playlist error:', error);
    res.status(500).json({
      error: 'Internal server error while deleting playlist'
    });
  }
});

// Mock playlist generation (temporary until AI integration)
async function generateMockPlaylist(prompt, context, userId) {
  const mockTracks = [
    {
      title: 'Midnight Groove',
      artist: 'DJ Pulse',
      album: 'Night Vibes',
      duration: 180,
      bpm: 128,
      key: 'C#m',
      energy: 85,
      genre: 'House'
    },
    {
      title: 'Electric Dreams',
      artist: 'Synthwave Collective',
      album: 'Digital Sunset',
      duration: 195,
      bpm: 120,
      key: 'Am',
      energy: 78,
      genre: 'Synthwave'
    },
    {
      title: 'Bass Drop',
      artist: 'Subwoofer',
      album: 'Heavy Bass',
      duration: 165,
      bpm: 140,
      key: 'F#m',
      energy: 92,
      genre: 'Dubstep'
    }
  ];

  // Analyze prompt to determine genre and energy
  const promptLower = prompt.toLowerCase();
  let genre = 'Electronic';
  let energy = 75;

  if (promptLower.includes('house') || promptLower.includes('groove')) {
    genre = 'House';
    energy = 85;
  } else if (promptLower.includes('chill') || promptLower.includes('ambient')) {
    genre = 'Ambient';
    energy = 45;
  } else if (promptLower.includes('rock') || promptLower.includes('guitar')) {
    genre = 'Rock';
    energy = 90;
  }

  return {
    name: `${genre} Mix`,
    description: `AI-generated playlist based on: ${prompt}`,
    tracks: mockTracks,
    energy,
    genre,
    bpm: 128,
    duration: mockTracks.reduce((sum, track) => sum + track.duration, 0),
    tags: [genre.toLowerCase(), 'ai-generated', 'custom']
  };
}

export { router as playlistRouter };
