import { createClient } from '@supabase/supabase-js';
import { 
  Session, 
  SessionStatus, 
  SessionTransition, 
  SessionContext, 
  SessionEvent, 
  SessionUpdate,
  SessionRecovery,
  EnergyPoint 
} from '../types/session';
import { Track } from '../types/audio';

// Session State Machine Configuration
const STATE_TRANSITIONS: Record<SessionStatus, SessionTransition[]> = {
  IDLE: ['CREATE'],
  SETUP: ['START_SETUP', 'SETUP_COMPLETE'],
  STUDIO_SET_READY: ['ENTER_STUDIO', 'START_MATCHING'],
  STUDIO_MATCHING: ['START_MATCHING', 'MATCHING_COMPLETE'],
  STUDIO_EDITING: ['START_EDITING', 'EDITING_COMPLETE'],
  LIVE: ['GO_LIVE', 'PAUSE_LIVE', 'END_SESSION'],
  LIVE_PAUSED: ['RESUME_LIVE', 'END_SESSION'],
  LIVE_RECOVERING: ['RECOVER_LIVE', 'END_SESSION'],
  ANALYTICS_READY: ['GENERATE_ANALYTICS', 'ARCHIVE'],
  ARCHIVED: []
};

export class SessionOrchestrator {
  private supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
  );
  
  private currentSession: Session | null = null;
  private autoSaveInterval: NodeJS.Timeout | null = null;
  private realtimeChannel: any = null;
  private eventListeners: Map<string, Function[]> = new Map();

  // Session Lifecycle Management
  async createSession(userId: string, context: SessionContext): Promise<Session> {
    const session: Session = {
      id: this.generateSessionId(),
      user_id: userId,
      status: 'SETUP',
      context,
      energy_curve: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      realtime_channel: `session:${this.generateSessionId()}`
    };

    // Save to database
    const { data, error } = await this.supabase
      .from('sessions')
      .insert(session)
      .select()
      .single();

    if (error) throw new Error(`Failed to create session: ${error.message}`);

    this.currentSession = data;
    this.startAutoSave();
    this.initializeRealtime();
    this.emitEvent('session_created', data);

    return data;
  }

  async loadSession(sessionId: string): Promise<Session> {
    const { data, error } = await this.supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) throw new Error(`Failed to load session: ${error.message}`);

    this.currentSession = data;
    this.startAutoSave();
    this.initializeRealtime();
    this.emitEvent('session_loaded', data);

    return data;
  }

  async transitionSession(transition: SessionTransition): Promise<Session> {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    const currentStatus = this.currentSession.status;
    const allowedTransitions = STATE_TRANSITIONS[currentStatus];

    if (!allowedTransitions.includes(transition)) {
      throw new Error(`Invalid transition ${transition} for status ${currentStatus}`);
    }

    const newStatus = this.getNewStatus(currentStatus, transition);
    const updatedSession = {
      ...this.currentSession,
      status: newStatus,
      updated_at: new Date().toISOString()
    };

    // Handle status-specific logic
    switch (newStatus) {
      case 'LIVE':
        updatedSession.started_at = new Date().toISOString();
        break;
      case 'ANALYTICS_READY':
        updatedSession.ended_at = new Date().toISOString();
        break;
    }

    // Save to database
    const { data, error } = await this.supabase
      .from('sessions')
      .update(updatedSession)
      .eq('id', updatedSession.id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update session: ${error.message}`);

    this.currentSession = data;
    this.broadcastSessionUpdate(data);
    this.emitEvent('session_transitioned', { from: currentStatus, to: newStatus, session: data });

    return data;
  }

  // Real-time Updates
  private initializeRealtime(): void {
    if (!this.currentSession?.realtime_channel) return;

    this.realtimeChannel = this.supabase
      .channel(this.currentSession.realtime_channel)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'sessions',
        filter: `id=eq.${this.currentSession.id}`
      }, (payload) => {
        this.currentSession = payload.new as Session;
        this.emitEvent('session_updated', payload.new);
      })
      .subscribe();
  }

  private broadcastSessionUpdate(session: Session): void {
    if (!this.realtimeChannel) return;

    const update: SessionUpdate = {
      session_id: session.id,
      status: session.status,
      active_track_id: session.active_track_id,
      energy_level: this.calculateCurrentEnergy(),
      timestamp: new Date().toISOString()
    };

    this.realtimeChannel.send({
      type: 'broadcast',
      event: 'session_update',
      payload: update
    });
  }

  // Energy Curve Management
  addEnergyPoint(value: number): void {
    if (!this.currentSession) return;

    const energyPoint: EnergyPoint = {
      t: Date.now(),
      value
    };

    this.currentSession.energy_curve.push(energyPoint);
    this.emitEvent('energy_updated', energyPoint);
  }

  private calculateCurrentEnergy(): number {
    if (!this.currentSession?.energy_curve.length) return 0;
    
    const recentPoints = this.currentSession.energy_curve
      .slice(-10) // Last 10 points
      .map(p => p.value);
    
    return recentPoints.reduce((sum, val) => sum + val, 0) / recentPoints.length;
  }

  // Session Recovery
  async saveRecoveryData(): Promise<void> {
    if (!this.currentSession) return;

    const recovery: SessionRecovery = {
      session_id: this.currentSession.id,
      last_status: this.currentSession.status,
      last_track_id: this.currentSession.active_track_id,
      energy_curve: this.currentSession.energy_curve,
      context: this.currentSession.context,
      recovery_timestamp: new Date().toISOString()
    };

    // Save to recovery table
    await this.supabase
      .from('session_recoveries')
      .upsert(recovery);
  }

  async recoverSession(sessionId: string): Promise<Session> {
    const { data: recovery, error } = await this.supabase
      .from('session_recoveries')
      .select('*')
      .eq('session_id', sessionId)
      .order('recovery_timestamp', { ascending: false })
      .limit(1)
      .single();

    if (error || !recovery) {
      throw new Error('No recovery data found');
    }

    // Restore session to last known state
    const { data: session, error: sessionError } = await this.supabase
      .from('sessions')
      .update({
        status: recovery.last_status,
        active_track_id: recovery.last_track_id,
        energy_curve: recovery.energy_curve,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (sessionError) throw new Error(`Failed to recover session: ${sessionError.message}`);

    this.currentSession = session;
    this.emitEvent('session_recovered', session);

    return session;
  }

  // Event Management
  addEventListener(event: string, listener: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  removeEventListener(event: string, listener: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emitEvent(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(data));
    }
  }

  // Auto-save functionality
  private startAutoSave(): void {
    this.stopAutoSave();
    this.autoSaveInterval = setInterval(() => {
      this.saveSession();
    }, 30000); // Every 30 seconds
  }

  private stopAutoSave(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  private async saveSession(): Promise<void> {
    if (!this.currentSession) return;

    try {
      await this.supabase
        .from('sessions')
        .update({
          ...this.currentSession,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.currentSession.id);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }

  // Utility methods
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getNewStatus(currentStatus: SessionStatus, transition: SessionTransition): SessionStatus {
    const transitionMap: Record<SessionTransition, SessionStatus> = {
      CREATE: 'SETUP',
      START_SETUP: 'SETUP',
      SETUP_COMPLETE: 'STUDIO_SET_READY',
      ENTER_STUDIO: 'STUDIO_SET_READY',
      START_MATCHING: 'STUDIO_MATCHING',
      MATCHING_COMPLETE: 'STUDIO_EDITING',
      START_EDITING: 'STUDIO_EDITING',
      EDITING_COMPLETE: 'LIVE',
      GO_LIVE: 'LIVE',
      PAUSE_LIVE: 'LIVE_PAUSED',
      RESUME_LIVE: 'LIVE',
      RECOVER_LIVE: 'LIVE',
      END_SESSION: 'ANALYTICS_READY',
      GENERATE_ANALYTICS: 'ANALYTICS_READY',
      ARCHIVE: 'ARCHIVED'
    };

    return transitionMap[transition] || currentStatus;
  }

  // Cleanup
  destroy(): void {
    this.stopAutoSave();
    if (this.realtimeChannel) {
      this.realtimeChannel.unsubscribe();
    }
    this.eventListeners.clear();
    this.currentSession = null;
  }

  // Getters
  getCurrentSession(): Session | null {
    return this.currentSession;
  }

  isSessionActive(): boolean {
    return this.currentSession?.status === 'LIVE';
  }

  canTransition(transition: SessionTransition): boolean {
    if (!this.currentSession) return false;
    return STATE_TRANSITIONS[this.currentSession.status].includes(transition);
  }
}
