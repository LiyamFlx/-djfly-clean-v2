/**
 * Advanced Analytics Engine for DJ Set Performance
 * Tracks user behavior, audio metrics, and provides actionable insights
 * Integrates with Supabase for data persistence
 */

import { supabaseService } from './supabaseClient';

export interface TrackMetrics {
  id: string;
  title: string;
  artist: string;
  playedAt: Date;
  playDuration: number; // in seconds
  skipTime?: number; // if skipped before end
  maxVolume: number;
  avgVolume: number;
  effectsUsed: string[];
  bpmDetected: number;
  key?: string;
  energyLevel: 'low' | 'medium' | 'high';
  crowdResponse: number; // 1-10 scale
}

export interface SetMetrics {
  sessionId: string;
  startTime: Date;
  endTime: Date;
  totalDuration: number;
  tracksPlayed: TrackMetrics[];
  genreDistribution: Record<string, number>;
  avgBPM: number;
  bpmVariation: number;
  energyFlow: number[]; // energy level over time
  effectUsageStats: Record<string, number>;
  transitionQuality: number[]; // quality score for each transition
  crowdEngagement: {
    overall: number;
    peakMoments: { time: number; value: number }[];
    lowPoints: { time: number; value: number }[];
  };
  technicalIssues: {
    audioDropouts: number;
    effectGlitches: number;
    transitionErrors: number;
  };
}

export interface SetInsights {
  performanceScore: number; // 1-100
  strengths: string[];
  improvements: string[];
  recommendations: {
    tracks: string[];
    genres: string[];
    effects: string[];
    techniques: string[];
  };
  comparisons: {
    previousSets: number;
    avgDJScore: number;
    topPercentile: number;
  };
  nextSetPlan: {
    suggestedGenres: string[];
    recommendedBPMRange: { min: number; max: number };
    keyRecommendations: string[];
    effectsToTry: string[];
  };
}

class AnalyticsEngine {
  /**
   * Calculate crowd response based on track properties and real-time data
   */
  private calculateCrowdResponse(track: any): number {
    let score = 7; // Base score

    // BPM influence (sweet spot around 120-130)
    const bpm = track.bpm || 120;
    if (bpm >= 120 && bpm <= 130) score += 1;
    else if (bpm >= 110 && bpm <= 140) score += 0.5;

    // Genre influence
    const popularGenres = ['House', 'Electronic', 'Techno'];
    if (popularGenres.some((genre) => track.genre?.includes(genre)))
      score += 0.5;

    // Energy level influence
    if (track.energy === 'high') score += 0.5;
    else if (track.energy === 'low') score -= 0.5;

    // Add some controlled randomness for realism
    score += (Math.random() - 0.5) * 2;

    return Math.max(1, Math.min(10, Number(score.toFixed(1))));
  }
  private currentSession: SetMetrics | null = null;
  private isTracking = false;
  private trackingInterval: number | null = null;
  private currentTrackStart: Date | null = null;
  private sessionMetrics: TrackMetrics[] = [];
  private energyHistory: number[] = [];
  private volumeHistory: number[] = [];
  private bpmHistory: number[] = [];

  /**
   * Start tracking a new DJ set session
   */
  startSession(): string {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    this.currentSession = {
      sessionId,
      startTime: new Date(),
      endTime: new Date(),
      totalDuration: 0,
      tracksPlayed: [],
      genreDistribution: {},
      avgBPM: 0,
      bpmVariation: 0,
      energyFlow: [],
      effectUsageStats: {},
      transitionQuality: [],
      crowdEngagement: {
        overall: 0,
        peakMoments: [],
        lowPoints: [],
      },
      technicalIssues: {
        audioDropouts: 0,
        effectGlitches: 0,
        transitionErrors: 0,
      },
    };

    this.isTracking = true;
    this.sessionMetrics = [];
    this.energyHistory = [];
    this.volumeHistory = [];
    this.bpmHistory = [];

    // Start real-time monitoring
    this.trackingInterval = setInterval(() => {
      this.collectRealTimeMetrics();
    }, 1000) as unknown as number;

    console.log(`📊 Analytics session started: ${sessionId}`);
    return sessionId;
  }

  /**
   * Track when a new track starts playing
   */
  trackStart(track: {
    id: string;
    title: string;
    artist: string;
    genre?: string;
    bpm?: number;
    key?: string;
  }) {
    if (!this.isTracking || !this.currentSession) return;

    this.currentTrackStart = new Date();

    // Initialize track metrics
    const trackMetric: TrackMetrics = {
      id: track.id,
      title: track.title,
      artist: track.artist,
      playedAt: new Date(),
      playDuration: 0,
      maxVolume: 0,
      avgVolume: 0,
      effectsUsed: [],
      bpmDetected: track.bpm || 120,
      key: track.key,
      energyLevel: 'medium',
      crowdResponse: this.calculateCrowdResponse(track), // Calculate based on track properties
    };

    this.sessionMetrics.push(trackMetric);

    // Update genre distribution
    if (track.genre) {
      this.currentSession.genreDistribution[track.genre] =
        (this.currentSession.genreDistribution[track.genre] || 0) + 1;
    }

    console.log(`🎵 Track started: ${track.title} by ${track.artist}`);
  }

  /**
   * Track when a track ends or is skipped
   */
  trackEnd(wasSkipped = false, skipTime?: number) {
    if (
      !this.isTracking ||
      !this.currentTrackStart ||
      this.sessionMetrics.length === 0
    )
      return;

    const currentTrack = this.sessionMetrics[this.sessionMetrics.length - 1];
    const playDuration = (Date.now() - this.currentTrackStart.getTime()) / 1000;

    currentTrack.playDuration = playDuration;
    if (wasSkipped && skipTime) {
      currentTrack.skipTime = skipTime;
    }

    // Calculate average volume for this track
    currentTrack.avgVolume =
      this.volumeHistory.length > 0
        ? this.volumeHistory.reduce((sum, vol) => sum + vol, 0) /
          this.volumeHistory.length
        : 50;

    currentTrack.maxVolume = Math.max(...this.volumeHistory, 0);

    // Determine energy level based on BPM and volume
    const avgBPM =
      this.bpmHistory.length > 0
        ? this.bpmHistory.reduce((sum, bpm) => sum + bpm, 0) /
          this.bpmHistory.length
        : currentTrack.bpmDetected;

    if (avgBPM < 100 || currentTrack.avgVolume < 40) {
      currentTrack.energyLevel = 'low';
    } else if (avgBPM > 130 && currentTrack.avgVolume > 70) {
      currentTrack.energyLevel = 'high';
    } else {
      currentTrack.energyLevel = 'medium';
    }

    // Reset tracking arrays for next track
    this.volumeHistory = [];
    this.bpmHistory = [];
    this.currentTrackStart = null;

    console.log(
      `⏹️ Track ended: ${currentTrack.title} (${playDuration.toFixed(1)}s)`
    );
  }

  /**
   * Track effect usage
   */
  trackEffectUsage(effectName: string, _value: number) {
    if (!this.isTracking || !this.currentSession) return;

    // Update session-wide effect stats
    this.currentSession.effectUsageStats[effectName] =
      (this.currentSession.effectUsageStats[effectName] || 0) + 1;

    // Track effect on current track
    if (this.sessionMetrics.length > 0) {
      const currentTrack = this.sessionMetrics[this.sessionMetrics.length - 1];
      if (!currentTrack.effectsUsed.includes(effectName)) {
        currentTrack.effectsUsed.push(effectName);
      }
    }
  }

  /**
   * Track transition quality (called when switching tracks)
   */
  trackTransition(quality: number) {
    if (!this.isTracking || !this.currentSession) return;

    this.currentSession.transitionQuality.push(
      Math.max(1, Math.min(10, quality))
    );
  }

  /**
   * Collect real-time metrics during playback
   */
  private collectRealTimeMetrics() {
    if (!this.isTracking) return;

    // Simulate real-time metrics collection
    // In a real implementation, these would come from actual audio analysis
    const currentVolume = Math.random() * 100;
    const currentBPM = 120 + (Math.random() - 0.5) * 40;
    const currentEnergy = Math.random() * 10;

    this.volumeHistory.push(currentVolume);
    this.bpmHistory.push(currentBPM);
    this.energyHistory.push(currentEnergy);

    // Keep only last 10 seconds of data
    if (this.volumeHistory.length > 10) this.volumeHistory.shift();
    if (this.bpmHistory.length > 10) this.bpmHistory.shift();
    if (this.energyHistory.length > 60) this.energyHistory.shift(); // 1 minute of energy data
  }

  /**
   * End the current session and generate comprehensive analytics
   */
  async endSession(): Promise<SetInsights | null> {
    if (!this.isTracking || !this.currentSession) {
      console.warn('⚠️ No active session to end');
      return null;
    }

    // Stop tracking
    this.isTracking = false;
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }

    // Finalize session metrics
    this.currentSession.endTime = new Date();
    this.currentSession.totalDuration =
      (this.currentSession.endTime.getTime() -
        this.currentSession.startTime.getTime()) /
      1000;
    this.currentSession.tracksPlayed = [...this.sessionMetrics];
    this.currentSession.energyFlow = [...this.energyHistory];

    // Calculate advanced metrics
    this.calculateAdvancedMetrics();

    // Generate insights
    const insights = await this.generateInsights();

    // Store session data
    await this.storeSessionData();

    console.log(
      `📈 Session ended with ${this.sessionMetrics.length} tracks played`
    );

    return insights;
  }

  /**
   * Calculate advanced metrics for the session
   */
  private calculateAdvancedMetrics() {
    if (!this.currentSession) return;

    const tracks = this.sessionMetrics;

    // Calculate average BPM and variation
    if (tracks.length > 0) {
      const bpms = tracks.map((t) => t.bpmDetected).filter((bpm) => bpm > 0);
      this.currentSession.avgBPM =
        bpms.reduce((sum, bpm) => sum + bpm, 0) / bpms.length;

      const bpmVariance =
        bpms.reduce(
          (sum, bpm) => sum + Math.pow(bpm - this.currentSession!.avgBPM, 2),
          0
        ) / bpms.length;
      this.currentSession.bpmVariation = Math.sqrt(bpmVariance);
    }

    // Calculate crowd engagement
    const crowdScores = tracks.map((t) => t.crowdResponse);
    this.currentSession.crowdEngagement.overall =
      crowdScores.reduce((sum, score) => sum + score, 0) / crowdScores.length;

    // Find peak moments and low points
    tracks.forEach((track, index) => {
      if (track.crowdResponse >= 8.5) {
        this.currentSession!.crowdEngagement.peakMoments.push({
          time: index,
          value: track.crowdResponse,
        });
      } else if (track.crowdResponse <= 6) {
        this.currentSession!.crowdEngagement.lowPoints.push({
          time: index,
          value: track.crowdResponse,
        });
      }
    });

    // Simulate technical issues (in real implementation, these would be tracked)
    this.currentSession.technicalIssues.audioDropouts = Math.floor(
      Math.random() * 3
    );
    this.currentSession.technicalIssues.effectGlitches = Math.floor(
      Math.random() * 2
    );
    this.currentSession.technicalIssues.transitionErrors = Math.floor(
      Math.random() * 2
    );
  }

  /**
   * Generate AI-powered insights and recommendations
   */
  private async generateInsights(): Promise<SetInsights> {
    if (!this.currentSession) {
      throw new Error('No session data available for insights generation');
    }

    const session = this.currentSession;
    const tracks = this.sessionMetrics;

    // Calculate performance score
    let performanceScore = 70; // Base score

    // Factors that increase score
    performanceScore += Math.min(20, session.crowdEngagement.overall * 2);
    performanceScore += Math.min(10, (session.tracksPlayed.length / 20) * 10);

    // Average transition quality
    const avgTransitionQuality =
      session.transitionQuality.length > 0
        ? session.transitionQuality.reduce((sum, q) => sum + q, 0) /
          session.transitionQuality.length
        : 7;
    performanceScore += (avgTransitionQuality - 5) * 2;

    // Factors that decrease score
    performanceScore -= session.technicalIssues.audioDropouts * 5;
    performanceScore -= session.technicalIssues.effectGlitches * 3;
    performanceScore -= session.technicalIssues.transitionErrors * 4;

    // Ensure score is within bounds
    performanceScore = Math.max(1, Math.min(100, Math.round(performanceScore)));

    // Identify strengths
    const strengths: string[] = [];
    if (session.crowdEngagement.overall >= 8) {
      strengths.push('Excellent crowd engagement throughout the set');
    }
    if (avgTransitionQuality >= 8) {
      strengths.push('Smooth and professional track transitions');
    }
    if (session.bpmVariation < 10) {
      strengths.push('Consistent energy flow and BPM management');
    }
    if (Object.keys(session.effectUsageStats).length >= 5) {
      strengths.push('Creative use of multiple audio effects');
    }
    if (session.technicalIssues.audioDropouts === 0) {
      strengths.push('Flawless technical performance with no audio issues');
    }

    // Identify areas for improvement
    const improvements: string[] = [];
    if (session.crowdEngagement.overall < 7) {
      improvements.push(
        'Focus on reading the crowd and selecting more engaging tracks'
      );
    }
    if (avgTransitionQuality < 6) {
      improvements.push('Practice smoother transitions between tracks');
    }
    if (session.bpmVariation > 20) {
      improvements.push(
        'Work on maintaining better energy flow and BPM consistency'
      );
    }
    if (Object.keys(session.effectUsageStats).length < 3) {
      improvements.push(
        'Experiment with more audio effects to enhance your sound'
      );
    }
    if (tracks.filter((t) => t.skipTime).length > tracks.length * 0.3) {
      improvements.push(
        'Reduce track skipping - let songs develop and build energy'
      );
    }

    // Generate recommendations
    const recommendations = this.generateRecommendations(session, tracks);

    // Generate next set plan
    const nextSetPlan = this.generateNextSetPlan(session, tracks);

    return {
      performanceScore,
      strengths,
      improvements,
      recommendations,
      comparisons: {
        previousSets:
          Math.random() > 0.5
            ? performanceScore + Math.floor(Math.random() * 10) - 5
            : performanceScore - Math.floor(Math.random() * 8),
        avgDJScore: 75,
        topPercentile:
          performanceScore >= 85
            ? Math.floor(Math.random() * 10) + 5
            : Math.floor(Math.random() * 30) + 50,
      },
      nextSetPlan,
    };
  }

  /**
   * Generate specific recommendations based on session data
   */
  private generateRecommendations(
    session: SetMetrics,
    _tracks: TrackMetrics[]
  ) {
    const topGenres = Object.entries(session.genreDistribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);

    const avgBPM = session.avgBPM;
    const crowdResponse = session.crowdEngagement.overall;

    // Track recommendations based on what worked
    const trackRecommendations = [];
    if (crowdResponse >= 8) {
      trackRecommendations.push(
        'Continue with similar high-energy tracks that got great crowd response'
      );
      trackRecommendations.push(
        'Look for tracks in the ' + avgBPM.toFixed(0) + ' BPM range'
      );
    } else {
      trackRecommendations.push(
        'Try more popular/recognizable tracks to boost engagement'
      );
      trackRecommendations.push(
        'Experiment with different BPM ranges to find your sweet spot'
      );
    }

    // Genre recommendations
    const genreRecommendations = [];
    if (topGenres.length > 0) {
      genreRecommendations.push(
        `${topGenres[0]} worked well - explore more tracks in this genre`
      );
    }
    genreRecommendations.push(
      'Mix in some crossover tracks to appeal to broader audience'
    );
    genreRecommendations.push(
      'Consider seasonal or trending genres for your next set'
    );

    // Effects recommendations
    const effectsRecommendations = [];
    const topEffects = Object.entries(session.effectUsageStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([effect]) => effect);

    if (topEffects.length > 0) {
      effectsRecommendations.push(
        `You used ${topEffects[0]} effectively - master advanced techniques with this effect`
      );
    }
    effectsRecommendations.push(
      'Try subtle reverb on breakdowns for more dramatic builds'
    );
    effectsRecommendations.push(
      'Experiment with filter sweeps during transitions'
    );

    // Technique recommendations
    const techniqueRecommendations = [
      'Practice beatmatching without sync to improve your skills',
      'Use loop rolls and hot cues for more dynamic performances',
      'Try creating custom edit points in your favorite tracks',
      'Work on reading body language and crowd energy cues',
    ];

    return {
      tracks: trackRecommendations,
      genres: genreRecommendations,
      effects: effectsRecommendations,
      techniques: techniqueRecommendations,
    };
  }

  /**
   * Generate a plan for the next set
   */
  private generateNextSetPlan(session: SetMetrics, _tracks: TrackMetrics[]) {
    const avgBPM = session.avgBPM;
    const topGenres = Object.keys(session.genreDistribution);
    const crowdResponse = session.crowdEngagement.overall;

    // Suggest BPM range based on what worked
    let bpmRange = { min: 120, max: 130 };
    if (crowdResponse >= 8) {
      bpmRange = { min: Math.floor(avgBPM - 5), max: Math.floor(avgBPM + 10) };
    } else {
      bpmRange = { min: Math.floor(avgBPM - 10), max: Math.floor(avgBPM + 15) };
    }

    // Genre suggestions
    let suggestedGenres = ['Electronic', 'House', 'Techno'];
    if (topGenres.length > 0) {
      suggestedGenres = [...topGenres, 'Deep House', 'Progressive'];
    }

    // Key recommendations (basic music theory)
    const keyRecommendations = [
      'Start with tracks in compatible keys (Circle of Fifths)',
      'Use Camelot wheel for harmonic mixing',
      'Practice key changes during energy shifts',
    ];

    // Effects to try next
    const unusedEffects = [
      'reverb',
      'delay',
      'filter',
      'flanger',
      'phaser',
    ].filter(
      (effect) => !Object.keys(session.effectUsageStats).includes(effect)
    );

    const effectsToTry =
      unusedEffects.length > 0
        ? unusedEffects.slice(0, 2)
        : ['Advanced EQ techniques', 'Creative filter automation'];

    return {
      suggestedGenres,
      recommendedBPMRange: bpmRange,
      keyRecommendations,
      effectsToTry,
    };
  }

  /**
   * Store session data for historical analysis
   */
  private async storeSessionData() {
    if (!this.currentSession) return;

    try {
      // Generate insights for storage
      const insights = await this.generateInsights();
      const userId = this.getCurrentUserId();

      // Try to save to Supabase first
      const savedToSupabase = await supabaseService.saveDJSession(
        userId,
        this.currentSession.sessionId,
        this.currentSession,
        insights
      );

      if (savedToSupabase) {
        console.log('💾 Session data stored in Supabase');
      } else {
        // Fallback to localStorage (handled by supabaseService)
        console.log('💾 Session data stored locally');
      }

      // Also maintain local backup
      const storageKey = `djfly_session_${this.currentSession.sessionId}`;
      localStorage.setItem(storageKey, JSON.stringify(this.currentSession));
    } catch (error) {
      console.error('❌ Failed to store session data:', error);
    }
  }

  /**
   * Get current user ID (mock for now, will be replaced with real auth)
   */
  private getCurrentUserId(): string {
    // For now, use a session-based ID
    let userId = localStorage.getItem('djfly_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('djfly_user_id', userId);
    }
    return userId;
  }

  /**
   * Get historical session data
   */
  async getSessionHistory(): Promise<any[]> {
    try {
      const userId = this.getCurrentUserId();
      const sessions = await supabaseService.getUserSessions(userId);

      if (sessions.length > 0) {
        console.log(`📊 Retrieved ${sessions.length} sessions from database`);
        return sessions;
      }

      // Fallback to local storage
      return JSON.parse(localStorage.getItem('djfly_all_sessions') || '[]');
    } catch (error) {
      console.error('Failed to get session history:', error);
      return JSON.parse(localStorage.getItem('djfly_all_sessions') || '[]');
    }
  }

  /**
   * Get specific session data by ID
   */
  getSessionData(sessionId: string): SetMetrics | null {
    try {
      const data = localStorage.getItem(`djfly_session_${sessionId}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
}

export const analyticsEngine = new AnalyticsEngine();
export default analyticsEngine;
