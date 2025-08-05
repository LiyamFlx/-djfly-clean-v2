import { Track } from '@/types';
import { cache } from '@/utils/cache';

export interface CollaborativeSession {
  id: string;
  name: string;
  host: {
    id: string;
    name: string;
    avatar?: string;
  };
  participants: Participant[];
  currentTrack: Track | null;
  queue: Track[];
  settings: {
    allowParticipantQueue: boolean;
    votingEnabled: boolean;
    chatEnabled: boolean;
    maxParticipants: number;
  };
  status: 'waiting' | 'active' | 'ended';
  createdAt: Date;
  updatedAt: Date;
}

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role: 'host' | 'dj' | 'listener';
  isOnline: boolean;
  joinedAt: Date;
  permissions: {
    canControlPlayback: boolean;
    canAddTracks: boolean;
    canVote: boolean;
    canChat: boolean;
  };
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'system' | 'track_request' | 'vote';
}

export interface TrackVote {
  trackId: string;
  userId: string;
  vote: 'up' | 'down';
  timestamp: Date;
}

class CollaborationService {
  private websocket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private currentSession: CollaborativeSession | null = null;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
    
    try {
      this.websocket = new WebSocket(wsUrl);
      
      this.websocket.onopen = this.handleWebSocketOpen.bind(this);
      this.websocket.onmessage = this.handleWebSocketMessage.bind(this);
      this.websocket.onclose = this.handleWebSocketClose.bind(this);
      this.websocket.onerror = this.handleWebSocketError.bind(this);
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
    }
  }

  private handleWebSocketOpen() {
    console.log('WebSocket connected');
    this.reconnectAttempts = 0;
    this.emit('connected');
  }

  private handleWebSocketMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  private handleWebSocketClose() {
    console.log('WebSocket disconnected');
    this.emit('disconnected');
    this.attemptReconnect();
  }

  private handleWebSocketError(error: Event) {
    console.error('WebSocket error:', error);
    this.emit('error', error);
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.initializeWebSocket();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  private handleMessage(data: any) {
    switch (data.type) {
      case 'session_updated':
        this.currentSession = data.session;
        this.emit('sessionUpdated', data.session);
        break;
      
      case 'participant_joined':
        this.emit('participantJoined', data.participant);
        break;
      
      case 'participant_left':
        this.emit('participantLeft', data.participant);
        break;
      
      case 'track_changed':
        this.emit('trackChanged', data.track);
        break;
      
      case 'queue_updated':
        this.emit('queueUpdated', data.queue);
        break;
      
      case 'chat_message':
        this.emit('chatMessage', data.message);
        break;
      
      case 'vote_cast':
        this.emit('voteCast', data.vote);
        break;
      
      case 'playback_state_changed':
        this.emit('playbackStateChanged', data.state);
        break;
      
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  private emit(event: string, data?: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(data));
    }
  }

  /**
   * Add event listener
   */
  on(event: string, listener: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  /**
   * Remove event listener
   */
  off(event: string, listener: Function) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Create a new collaborative session
   */
  async createSession(sessionData: {
    name: string;
    settings: Partial<CollaborativeSession['settings']>;
  }): Promise<CollaborativeSession> {
    const defaultSettings = {
      allowParticipantQueue: true,
      votingEnabled: true,
      chatEnabled: true,
      maxParticipants: 50,
    };

    const session: Partial<CollaborativeSession> = {
      id: this.generateSessionId(),
      name: sessionData.name,
      settings: { ...defaultSettings, ...sessionData.settings },
      participants: [],
      currentTrack: null,
      queue: [],
      status: 'waiting',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // In a real implementation, this would create the session on the server
    this.sendMessage({
      type: 'create_session',
      session,
    });

    // For demo purposes, simulate session creation
    const mockSession: CollaborativeSession = {
      ...session,
      host: {
        id: 'current-user',
        name: 'Current User',
      },
    } as CollaborativeSession;

    this.currentSession = mockSession;
    return mockSession;
  }

  /**
   * Join an existing session
   */
  async joinSession(sessionId: string): Promise<CollaborativeSession> {
    this.sendMessage({
      type: 'join_session',
      sessionId,
    });

    // For demo purposes, return a mock session
    // In reality, this would wait for the server response
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockSession: CollaborativeSession = {
      id: sessionId,
      name: 'DJ Session',
      host: {
        id: 'host-user',
        name: 'Host User',
      },
      participants: [
        {
          id: 'current-user',
          name: 'Current User',
          role: 'listener',
          isOnline: true,
          joinedAt: new Date(),
          permissions: {
            canControlPlayback: false,
            canAddTracks: true,
            canVote: true,
            canChat: true,
          },
        },
      ],
      currentTrack: null,
      queue: [],
      settings: {
        allowParticipantQueue: true,
        votingEnabled: true,
        chatEnabled: true,
        maxParticipants: 50,
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.currentSession = mockSession;
    return mockSession;
  }

  /**
   * Leave current session
   */
  async leaveSession(): Promise<void> {
    if (this.currentSession) {
      this.sendMessage({
        type: 'leave_session',
        sessionId: this.currentSession.id,
      });
    }
    this.currentSession = null;
  }

  /**
   * Add track to session queue
   */
  async addTrackToQueue(track: Track): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    this.sendMessage({
      type: 'add_track',
      sessionId: this.currentSession.id,
      track,
    });
  }

  /**
   * Vote on a track
   */
  async voteOnTrack(trackId: string, vote: 'up' | 'down'): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    this.sendMessage({
      type: 'vote_track',
      sessionId: this.currentSession.id,
      trackId,
      vote,
    });
  }

  /**
   * Send chat message
   */
  async sendChatMessage(message: string): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    this.sendMessage({
      type: 'chat_message',
      sessionId: this.currentSession.id,
      message,
    });
  }

  /**
   * Control playback (host/DJ only)
   */
  async controlPlayback(action: 'play' | 'pause' | 'skip' | 'previous'): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    this.sendMessage({
      type: 'playback_control',
      sessionId: this.currentSession.id,
      action,
    });
  }

  /**
   * Update session settings (host only)
   */
  async updateSessionSettings(settings: Partial<CollaborativeSession['settings']>): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    this.sendMessage({
      type: 'update_settings',
      sessionId: this.currentSession.id,
      settings,
    });
  }

  /**
   * Promote participant to DJ
   */
  async promoteParticipant(userId: string): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    this.sendMessage({
      type: 'promote_participant',
      sessionId: this.currentSession.id,
      userId,
      role: 'dj',
    });
  }

  /**
   * Get active sessions (public sessions)
   */
  async getActiveSessions(): Promise<CollaborativeSession[]> {
    // In a real implementation, this would fetch from the server
    const cachedSessions = cache.get<CollaborativeSession[]>('active_sessions');
    if (cachedSessions) {
      return cachedSessions;
    }

    // Mock data for demo
    const mockSessions: CollaborativeSession[] = [
      {
        id: 'session-1',
        name: 'House Music Night',
        host: { id: 'host-1', name: 'DJ Mike' },
        participants: [],
        currentTrack: null,
        queue: [],
        settings: {
          allowParticipantQueue: true,
          votingEnabled: true,
          chatEnabled: true,
          maxParticipants: 100,
        },
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'session-2',
        name: 'Chill Vibes Session',
        host: { id: 'host-2', name: 'DJ Sarah' },
        participants: [],
        currentTrack: null,
        queue: [],
        settings: {
          allowParticipantQueue: true,
          votingEnabled: false,
          chatEnabled: true,
          maxParticipants: 25,
        },
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    cache.set('active_sessions', mockSessions, 30000); // Cache for 30 seconds
    return mockSessions;
  }

  /**
   * Get current session
   */
  getCurrentSession(): CollaborativeSession | null {
    return this.currentSession;
  }

  /**
   * Check if user is host of current session
   */
  isHost(): boolean {
    if (!this.currentSession) return false;
    return this.currentSession.host.id === 'current-user'; // Replace with actual user ID
  }

  /**
   * Check if user has DJ permissions
   */
  isDJ(): boolean {
    if (!this.currentSession) return false;
    
    const currentUser = this.currentSession.participants.find(p => p.id === 'current-user');
    return currentUser?.role === 'dj' || this.isHost();
  }

  /**
   * Send message via WebSocket
   */
  private sendMessage(message: any) {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, message not sent:', message);
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return 'session-' + Math.random().toString(36).substring(2) + '-' + Date.now();
  }

  /**
   * Cleanup resources
   */
  dispose() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    this.eventListeners.clear();
    this.currentSession = null;
  }
}

export const collaborationService = new CollaborationService();
export default collaborationService;