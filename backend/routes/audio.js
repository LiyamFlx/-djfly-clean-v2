import express from 'express';
import multer from 'multer';
import { postgresPool, redisClient } from '../database/connection.js';

const router = express.Router();

// Configure multer for audio file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'), false);
    }
  },
});

// Analyze audio file
router.post('/analyze', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No audio file provided'
      });
    }

    const userId = req.user.id;
    const { filename, mimetype, size } = req.file;

    // TODO: Implement real audio analysis
    // For now, return mock analysis
    const analysis = await analyzeAudioMock(req.file.buffer);

    // Cache analysis results
    const cacheKey = `analysis:${userId}:${Date.now()}`;
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(analysis));

    res.json({
      message: 'Audio analysis completed',
      filename,
      analysis,
      cacheKey
    });

  } catch (error) {
    console.error('Audio analysis error:', error);
    res.status(500).json({
      error: 'Internal server error during audio analysis'
    });
  }
});

// Get audio analysis history
router.get('/analysis-history', async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // Get analysis history from database
    const historyResult = await postgresPool.query(
      `SELECT id, filename, analysis_result, created_at
       FROM audio_analyses
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    // Get total count
    const countResult = await postgresPool.query(
      'SELECT COUNT(*) FROM audio_analyses WHERE user_id = $1',
      [userId]
    );

    const totalAnalyses = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalAnalyses / limit);

    res.json({
      analyses: historyResult.rows.map(row => ({
        id: row.id,
        filename: row.filename,
        analysis: JSON.parse(row.analysis_result),
        createdAt: row.created_at
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalAnalyses,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get analysis history error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching analysis history'
    });
  }
});

// Mock audio analysis function
async function analyzeAudioMock(audioBuffer) {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    bpm: Math.floor(Math.random() * 60) + 80, // 80-140 BPM
    key: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][Math.floor(Math.random() * 12)] + ['maj', 'min'][Math.floor(Math.random() * 2)],
    energy: Math.floor(Math.random() * 40) + 60, // 60-100 energy
    mood: ['Energetic', 'Chill', 'Dark', 'Bright', 'Melancholic'][Math.floor(Math.random() * 5)],
    genre: ['House', 'Techno', 'Trance', 'Dubstep', 'Ambient'][Math.floor(Math.random() * 5)],
    duration: Math.floor(Math.random() * 300) + 120, // 2-7 minutes
    waveform: {
      peaks: Array.from({ length: 100 }, () => Math.random()),
      average: 0.5
    },
    spectral: {
      bass: Math.random(),
      mid: Math.random(),
      treble: Math.random()
    }
  };
}

export { router as audioRouter };
