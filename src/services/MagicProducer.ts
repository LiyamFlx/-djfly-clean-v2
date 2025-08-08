import { Session, SessionEvent, SessionAnalytics } from '../types/session';
import { Track } from '../types/audio';

export interface ProducerReport {
  id: string;
  session_id: string;
  summary: SessionSummary;
  recommendations: TrackRecommendation[];
  crowdInsights: CrowdInsights;
  performanceMetrics: PerformanceMetrics;
  exports: ExportOptions;
  generated_at: string;
}

export interface SessionSummary {
  totalDuration: number;
  tracksPlayed: number;
  averageEnergy: number;
  peakEnergy: number;
  crowdSatisfaction: number;
  transitionCount: number;
  errorCount: number;
  keyHighlights: string[];
  energyFlow: 'excellent' | 'good' | 'fair' | 'poor';
  crowdEngagement: 'high' | 'medium' | 'low';
}

export interface TrackRecommendation {
  trackId: string;
  title: string;
  artist: string;
  reason: string;
  confidence: number;
  category: 'energy_boost' | 'crowd_pleaser' | 'transition' | 'closer' | 'opener';
  expectedImpact: {
    energy: number;
    crowdReaction: number;
    flowQuality: number;
  };
}

export interface CrowdInsights {
  demographics: {
    ageRange: [number, number];
    genderDistribution: { male: number; female: number; other: number };
    energyPreference: 'high' | 'medium' | 'low';
  };
  behavior: {
    dancing: number;
    singing: number;
    clapping: number;
    cheering: number;
    averageEngagement: number;
  };
  moodProgression: Array<{
    timestamp: number;
    mood: string;
    energy: number;
    engagement: number;
  }>;
  peakMoments: Array<{
    timestamp: number;
    trackId: string;
    energy: number;
    crowdReaction: string;
  }>;
  lowPoints: Array<{
    timestamp: number;
    trackId: string;
    energy: number;
    issue: string;
  }>;
}

export interface PerformanceMetrics {
  technical: {
    audioLatency: number;
    transitionQuality: number;
    beatMatching: number;
    energyConsistency: number;
  };
  artistic: {
    trackSelection: number;
    flowQuality: number;
    crowdReading: number;
    creativity: number;
  };
  overall: {
    score: number;
    grade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';
    strengths: string[];
    areasForImprovement: string[];
  };
}

export interface ExportOptions {
  formats: ('csv' | 'pdf' | 'json')[];
  includeWaveforms: boolean;
  includeAnalytics: boolean;
  includeCrowdData: boolean;
  customTimeRange?: {
    start: number;
    end: number;
  };
}

export class MagicProducer {
  private session: Session | null = null;
  private events: SessionEvent[] = [];
  private tracks: Track[] = [];

  // Report Generation
  async generateReport(sessionId: string, events: SessionEvent[], availableTracks: Track[]): Promise<ProducerReport> {
    this.events = events;
    this.tracks = availableTracks;
    
    // Load session data
    await this.loadSession(sessionId);
    
    if (!this.session) {
      throw new Error('Session not found');
    }

    const summary = this.generateSessionSummary();
    const recommendations = await this.generateTrackRecommendations();
    const crowdInsights = this.generateCrowdInsights();
    const performanceMetrics = this.calculatePerformanceMetrics();
    const exports = this.getExportOptions();

    const report: ProducerReport = {
      id: this.generateReportId(),
      session_id: sessionId,
      summary,
      recommendations,
      crowdInsights,
      performanceMetrics,
      exports,
      generated_at: new Date().toISOString()
    };

    // Save report to database
    await this.saveReport(report);

    return report;
  }

  private async loadSession(sessionId: string): Promise<void> {
    // In real implementation, load from database
    // For now, simulate session data
    this.session = {
      id: sessionId,
      user_id: 'user_123',
      status: 'ANALYTICS_READY',
      context: {
        venue: 'Club XYZ',
        crowdSize: 500,
        vibe: 'high energy',
        bpmTarget: [120, 140],
        genres: ['house', 'techno']
      },
      energy_curve: this.generateEnergyCurve(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  private generateSessionSummary(): SessionSummary {
    const totalDuration = this.calculateTotalDuration();
    const tracksPlayed = this.countTracksPlayed();
    const averageEnergy = this.calculateAverageEnergy();
    const peakEnergy = this.calculatePeakEnergy();
    const crowdSatisfaction = this.calculateCrowdSatisfaction();
    const transitionCount = this.countTransitions();
    const errorCount = this.countErrors();
    const keyHighlights = this.generateKeyHighlights();
    const energyFlow = this.assessEnergyFlow();
    const crowdEngagement = this.assessCrowdEngagement();

    return {
      totalDuration,
      tracksPlayed,
      averageEnergy,
      peakEnergy,
      crowdSatisfaction,
      transitionCount,
      errorCount,
      keyHighlights,
      energyFlow,
      crowdEngagement
    };
  }

  private async generateTrackRecommendations(): Promise<TrackRecommendation[]> {
    const recommendations: TrackRecommendation[] = [];
    
    // Analyze session patterns
    const energyPattern = this.analyzeEnergyPattern();
    const crowdPreferences = this.analyzeCrowdPreferences();
    const transitionQuality = this.analyzeTransitionQuality();

    // Generate recommendations based on analysis
    const highEnergyTracks = this.tracks.filter(t => (t.energy || 0) > 0.8);
    const crowdPleasers = this.tracks.filter(t => (t.popularity || 0) > 0.7);
    const transitionTracks = this.tracks.filter(t => (t.bpm || 0) >= 120 && (t.bpm || 0) <= 140);

    // Energy boost recommendations
    if (energyPattern.needsBoost) {
      const energyTrack = this.selectBestTrack(highEnergyTracks, 'energy');
      if (energyTrack) {
        recommendations.push({
          trackId: energyTrack.id,
          title: energyTrack.title,
          artist: energyTrack.artist,
          reason: 'High energy track to boost crowd energy',
          confidence: 0.85,
          category: 'energy_boost',
          expectedImpact: {
            energy: 0.9,
            crowdReaction: 0.8,
            flowQuality: 0.7
          }
        });
      }
    }

    // Crowd pleaser recommendations
    const crowdTrack = this.selectBestTrack(crowdPleasers, 'popularity');
    if (crowdTrack) {
      recommendations.push({
        trackId: crowdTrack.id,
        title: crowdTrack.title,
        artist: crowdTrack.artist,
        reason: 'Popular track with high crowd appeal',
        confidence: 0.9,
        category: 'crowd_pleaser',
        expectedImpact: {
          energy: 0.7,
          crowdReaction: 0.9,
          flowQuality: 0.8
        }
      });
    }

    // Transition recommendations
    const transitionTrack = this.selectBestTrack(transitionTracks, 'bpm');
    if (transitionTrack) {
      recommendations.push({
        trackId: transitionTrack.id,
        title: transitionTrack.title,
        artist: transitionTrack.artist,
        reason: 'Smooth BPM transition track',
        confidence: 0.75,
        category: 'transition',
        expectedImpact: {
          energy: 0.6,
          crowdReaction: 0.6,
          flowQuality: 0.9
        }
      });
    }

    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }

  private generateCrowdInsights(): CrowdInsights {
    const demographics = this.analyzeDemographics();
    const behavior = this.analyzeCrowdBehavior();
    const moodProgression = this.analyzeMoodProgression();
    const peakMoments = this.identifyPeakMoments();
    const lowPoints = this.identifyLowPoints();

    return {
      demographics,
      behavior,
      moodProgression,
      peakMoments,
      lowPoints
    };
  }

  private calculatePerformanceMetrics(): PerformanceMetrics {
    const technical = this.calculateTechnicalMetrics();
    const artistic = this.calculateArtisticMetrics();
    const overall = this.calculateOverallScore(technical, artistic);

    return {
      technical,
      artistic,
      overall
    };
  }

  private getExportOptions(): ExportOptions {
    return {
      formats: ['csv', 'pdf', 'json'],
      includeWaveforms: true,
      includeAnalytics: true,
      includeCrowdData: true
    };
  }

  // Analysis Methods
  private calculateTotalDuration(): number {
    const playEvents = this.events.filter(e => e.type === 'TRACK_PLAYED');
    return playEvents.reduce((total, event) => {
      const track = this.tracks.find(t => t.id === event.payload.track_id);
      return total + (track?.duration || 0);
    }, 0);
  }

  private countTracksPlayed(): number {
    return this.events.filter(e => e.type === 'TRACK_PLAYED').length;
  }

  private calculateAverageEnergy(): number {
    const energyEvents = this.events.filter(e => e.payload.energy_level !== undefined);
    if (energyEvents.length === 0) return 0.5;
    
    const totalEnergy = energyEvents.reduce((sum, event) => sum + (event.payload.energy_level || 0), 0);
    return totalEnergy / energyEvents.length;
  }

  private calculatePeakEnergy(): number {
    const energyEvents = this.events.filter(e => e.payload.energy_level !== undefined);
    if (energyEvents.length === 0) return 0.5;
    
    return Math.max(...energyEvents.map(e => e.payload.energy_level || 0));
  }

  private calculateCrowdSatisfaction(): number {
    const crowdEvents = this.events.filter(e => e.type === 'CROWD_REACT');
    if (crowdEvents.length === 0) return 0.7;
    
    const totalEngagement = crowdEvents.reduce((sum, event) => {
      const engagement = event.payload.crowd_response?.engagement || 0;
      return sum + engagement;
    }, 0);
    
    return totalEngagement / crowdEvents.length;
  }

  private countTransitions(): number {
    return this.events.filter(e => e.type === 'TRANSITION').length;
  }

  private countErrors(): number {
    return this.events.filter(e => e.type === 'ERROR').length;
  }

  private generateKeyHighlights(): string[] {
    const highlights: string[] = [];
    
    const peakEnergy = this.calculatePeakEnergy();
    if (peakEnergy > 0.9) {
      highlights.push('Exceptional peak energy moments');
    }
    
    const crowdSatisfaction = this.calculateCrowdSatisfaction();
    if (crowdSatisfaction > 0.8) {
      highlights.push('Excellent crowd engagement throughout');
    }
    
    const transitionCount = this.countTransitions();
    if (transitionCount > 10) {
      highlights.push('Smooth and frequent transitions');
    }
    
    return highlights;
  }

  private assessEnergyFlow(): 'excellent' | 'good' | 'fair' | 'poor' {
    const energyVariance = this.calculateEnergyVariance();
    const averageEnergy = this.calculateAverageEnergy();
    
    if (energyVariance < 0.1 && averageEnergy > 0.7) return 'excellent';
    if (energyVariance < 0.2 && averageEnergy > 0.6) return 'good';
    if (energyVariance < 0.3) return 'fair';
    return 'poor';
  }

  private assessCrowdEngagement(): 'high' | 'medium' | 'low' {
    const crowdSatisfaction = this.calculateCrowdSatisfaction();
    
    if (crowdSatisfaction > 0.8) return 'high';
    if (crowdSatisfaction > 0.6) return 'medium';
    return 'low';
  }

  private analyzeEnergyPattern(): { needsBoost: boolean; pattern: string } {
    const energyEvents = this.events.filter(e => e.payload.energy_level !== undefined);
    const energies = energyEvents.map(e => e.payload.energy_level || 0);
    
    const averageEnergy = energies.reduce((sum, e) => sum + e, 0) / energies.length;
    const energyVariance = energies.reduce((sum, e) => sum + Math.pow(e - averageEnergy, 2), 0) / energies.length;
    
    return {
      needsBoost: averageEnergy < 0.6,
      pattern: energyVariance < 0.1 ? 'stable' : energyVariance < 0.2 ? 'moderate' : 'volatile'
    };
  }

  private analyzeCrowdPreferences(): { preferredGenres: string[]; energyPreference: string } {
    const crowdEvents = this.events.filter(e => e.type === 'CROWD_REACT');
    const highEngagementEvents = crowdEvents.filter(e => (e.payload.crowd_response?.engagement || 0) > 0.8);
    
    // Analyze which tracks got the best crowd response
    const trackIds = highEngagementEvents.map(e => e.payload.track_id).filter(Boolean);
    const popularTracks = this.tracks.filter(t => trackIds.includes(t.id));
    
    const genres = popularTracks.map(t => t.genre).filter(Boolean);
    const genreCounts: { [key: string]: number } = {};
    genres.forEach(genre => {
      genreCounts[genre!] = (genreCounts[genre!] || 0) + 1;
    });
    
    const preferredGenres = Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);
    
    const averageEnergy = this.calculateAverageEnergy();
    const energyPreference = averageEnergy > 0.7 ? 'high' : averageEnergy > 0.5 ? 'medium' : 'low';
    
    return { preferredGenres, energyPreference };
  }

  private analyzeTransitionQuality(): { averageQuality: number; issues: string[] } {
    const transitionEvents = this.events.filter(e => e.type === 'TRANSITION');
    const qualities = transitionEvents.map(e => e.payload.transition_quality || 0);
    
    const averageQuality = qualities.length > 0 
      ? qualities.reduce((sum, q) => sum + q, 0) / qualities.length 
      : 0.7;
    
    const issues: string[] = [];
    if (averageQuality < 0.6) issues.push('Rough transitions detected');
    if (qualities.some(q => q < 0.3)) issues.push('Some very poor transitions');
    
    return { averageQuality, issues };
  }

  private selectBestTrack(tracks: Track[], criteria: 'energy' | 'popularity' | 'bpm'): Track | null {
    if (tracks.length === 0) return null;
    
    return tracks.reduce((best, track) => {
      const bestValue = best[criteria] || 0;
      const trackValue = track[criteria] || 0;
      return trackValue > bestValue ? track : best;
    });
  }

  private analyzeDemographics(): CrowdInsights['demographics'] {
    // Simulate demographic analysis based on session context
    return {
      ageRange: [21, 35] as [number, number],
      genderDistribution: { male: 0.55, female: 0.42, other: 0.03 },
      energyPreference: 'high'
    };
  }

  private analyzeCrowdBehavior(): CrowdInsights['behavior'] {
    const crowdEvents = this.events.filter(e => e.type === 'CROWD_REACT');
    
    const behaviors = crowdEvents.map(e => ({
      dancing: e.payload.crowd_response?.energy || 0,
      singing: Math.random() * 0.3, // Simulated
      clapping: Math.random() * 0.5, // Simulated
      cheering: e.payload.crowd_response?.engagement || 0
    }));
    
    const averageBehavior = behaviors.reduce((sum, b) => ({
      dancing: sum.dancing + b.dancing,
      singing: sum.singing + b.singing,
      clapping: sum.clapping + b.clapping,
      cheering: sum.cheering + b.cheering
    }), { dancing: 0, singing: 0, clapping: 0, cheering: 0 });
    
    const count = behaviors.length || 1;
    
    return {
      dancing: averageBehavior.dancing / count,
      singing: averageBehavior.singing / count,
      clapping: averageBehavior.clapping / count,
      cheering: averageBehavior.cheering / count,
      averageEngagement: this.calculateCrowdSatisfaction()
    };
  }

  private analyzeMoodProgression(): CrowdInsights['moodProgression'] {
    const crowdEvents = this.events.filter(e => e.type === 'CROWD_REACT');
    
    return crowdEvents.map((event, index) => ({
      timestamp: event.payload.timestamp,
      mood: event.payload.crowd_response?.mood || 'neutral',
      energy: event.payload.crowd_response?.energy || 0,
      engagement: event.payload.crowd_response?.engagement || 0
    }));
  }

  private identifyPeakMoments(): CrowdInsights['peakMoments'] {
    const crowdEvents = this.events.filter(e => e.type === 'CROWD_REACT');
    const highEnergyEvents = crowdEvents.filter(e => (e.payload.crowd_response?.energy || 0) > 0.8);
    
    return highEnergyEvents.map(event => ({
      timestamp: event.payload.timestamp,
      trackId: event.payload.track_id || '',
      energy: event.payload.crowd_response?.energy || 0,
      crowdReaction: 'excited'
    }));
  }

  private identifyLowPoints(): CrowdInsights['lowPoints'] {
    const crowdEvents = this.events.filter(e => e.type === 'CROWD_REACT');
    const lowEnergyEvents = crowdEvents.filter(e => (e.payload.crowd_response?.energy || 0) < 0.4);
    
    return lowEnergyEvents.map(event => ({
      timestamp: event.payload.timestamp,
      trackId: event.payload.track_id || '',
      energy: event.payload.crowd_response?.energy || 0,
      issue: 'Low crowd energy'
    }));
  }

  private calculateTechnicalMetrics(): PerformanceMetrics['technical'] {
    const transitionEvents = this.events.filter(e => e.type === 'TRANSITION');
    const errorEvents = this.events.filter(e => e.type === 'ERROR');
    
    const transitionQuality = transitionEvents.length > 0
      ? transitionEvents.reduce((sum, e) => sum + (e.payload.transition_quality || 0), 0) / transitionEvents.length
      : 0.8;
    
    return {
      audioLatency: 0.95, // Simulated
      transitionQuality,
      beatMatching: 0.9, // Simulated
      energyConsistency: this.calculateEnergyConsistency()
    };
  }

  private calculateArtisticMetrics(): PerformanceMetrics['artistic'] {
    const crowdSatisfaction = this.calculateCrowdSatisfaction();
    const energyFlow = this.assessEnergyFlow();
    const trackVariety = this.calculateTrackVariety();
    
    return {
      trackSelection: 0.85, // Simulated
      flowQuality: energyFlow === 'excellent' ? 0.95 : energyFlow === 'good' ? 0.8 : 0.6,
      crowdReading: crowdSatisfaction,
      creativity: 0.8 // Simulated
    };
  }

  private calculateOverallScore(technical: PerformanceMetrics['technical'], artistic: PerformanceMetrics['artistic']): PerformanceMetrics['overall'] {
    const technicalScore = (technical.audioLatency + technical.transitionQuality + technical.beatMatching + technical.energyConsistency) / 4;
    const artisticScore = (artistic.trackSelection + artistic.flowQuality + artistic.crowdReading + artistic.creativity) / 4;
    
    const overallScore = (technicalScore * 0.4) + (artisticScore * 0.6);
    
    const grade = this.calculateGrade(overallScore);
    const strengths = this.identifyStrengths(technical, artistic);
    const areasForImprovement = this.identifyAreasForImprovement(technical, artistic);
    
    return {
      score: overallScore,
      grade,
      strengths,
      areasForImprovement
    };
  }

  private calculateGrade(score: number): PerformanceMetrics['overall']['grade'] {
    if (score >= 0.95) return 'A+';
    if (score >= 0.9) return 'A';
    if (score >= 0.85) return 'A-';
    if (score >= 0.8) return 'B+';
    if (score >= 0.75) return 'B';
    if (score >= 0.7) return 'B-';
    if (score >= 0.65) return 'C+';
    if (score >= 0.6) return 'C';
    if (score >= 0.55) return 'C-';
    if (score >= 0.5) return 'D';
    return 'F';
  }

  private identifyStrengths(technical: PerformanceMetrics['technical'], artistic: PerformanceMetrics['artistic']): string[] {
    const strengths: string[] = [];
    
    if (technical.transitionQuality > 0.8) strengths.push('Excellent transitions');
    if (artistic.crowdReading > 0.8) strengths.push('Great crowd reading');
    if (artistic.flowQuality > 0.8) strengths.push('Smooth energy flow');
    if (technical.beatMatching > 0.8) strengths.push('Precise beat matching');
    
    return strengths;
  }

  private identifyAreasForImprovement(technical: PerformanceMetrics['technical'], artistic: PerformanceMetrics['artistic']): string[] {
    const areas: string[] = [];
    
    if (technical.transitionQuality < 0.7) areas.push('Improve transition quality');
    if (artistic.crowdReading < 0.7) areas.push('Better crowd reading');
    if (artistic.flowQuality < 0.7) areas.push('Work on energy flow');
    if (technical.beatMatching < 0.7) areas.push('Practice beat matching');
    
    return areas;
  }

  // Utility Methods
  private calculateEnergyVariance(): number {
    const energyEvents = this.events.filter(e => e.payload.energy_level !== undefined);
    const energies = energyEvents.map(e => e.payload.energy_level || 0);
    
    if (energies.length === 0) return 0;
    
    const averageEnergy = energies.reduce((sum, e) => sum + e, 0) / energies.length;
    const variance = energies.reduce((sum, e) => sum + Math.pow(e - averageEnergy, 2), 0) / energies.length;
    
    return variance;
  }

  private calculateEnergyConsistency(): number {
    const variance = this.calculateEnergyVariance();
    return Math.max(0, 1 - variance);
  }

  private calculateTrackVariety(): number {
    const playedTracks = this.events
      .filter(e => e.type === 'TRACK_PLAYED')
      .map(e => e.payload.track_id)
      .filter(Boolean);
    
    const uniqueTracks = new Set(playedTracks);
    const uniqueArtists = new Set(
      this.tracks
        .filter(t => playedTracks.includes(t.id))
        .map(t => t.artist)
    );
    
    return (uniqueArtists.size / uniqueTracks.size) * 0.5 + 0.5;
  }

  private generateEnergyCurve(): Array<{ t: number; value: number }> {
    const curve: Array<{ t: number; value: number }> = [];
    for (let i = 0; i < 60; i++) {
      curve.push({
        t: i * 30,
        value: Math.random() * 0.4 + 0.6
      });
    }
    return curve;
  }

  private generateReportId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async saveReport(report: ProducerReport): Promise<void> {
    // In real implementation, save to database
    console.log('Saving report:', report.id);
  }

  // Public Methods
  async exportReport(reportId: string, format: 'csv' | 'pdf' | 'json'): Promise<string> {
    // In real implementation, generate and return export
    return `export_${reportId}.${format}`;
  }

  getReport(reportId: string): ProducerReport | null {
    // In real implementation, load from database
    return null;
  }
}
