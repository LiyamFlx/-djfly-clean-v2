import { useState, useEffect, useCallback, useRef } from 'react';
import { SessionOrchestrator } from '../services/sessionOrchestrator';
import {
  Session,
  SessionStatus,
  SessionTransition,
  SessionContext,
  SessionUpdate,
  EnergyPoint,
} from '../types/session';

export interface UseSessionOrchestratorReturn {
  // Session state
  session: Session | null;
  isLoading: boolean;
  error: string | null;

  // Session management
  createSession: (userId: string, context: SessionContext) => Promise<Session>;
  loadSession: (sessionId: string) => Promise<Session>;
  transitionSession: (transition: SessionTransition) => Promise<Session>;

  // Session status
  isSessionActive: boolean;
  canTransition: (transition: SessionTransition) => boolean;
  getCurrentStatus: () => SessionStatus | null;

  // Energy management
  addEnergyPoint: (value: number) => void;
  getCurrentEnergy: () => number;
  getEnergyCurve: () => EnergyPoint[];

  // Recovery
  saveRecoveryData: () => Promise<void>;
  recoverSession: (sessionId: string) => Promise<Session>;

  // Real-time updates
  sessionUpdates: SessionUpdate[];
  latestUpdate: SessionUpdate | null;

  // Event handling
  addEventListener: (event: string, listener: Function) => void;
  removeEventListener: (event: string, listener: Function) => void;

  // Cleanup
  destroy: () => void;
}

export function useSessionOrchestrator(): UseSessionOrchestratorReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionUpdates, setSessionUpdates] = useState<SessionUpdate[]>([]);
  const [latestUpdate, setLatestUpdate] = useState<SessionUpdate | null>(null);

  const orchestratorRef = useRef<SessionOrchestrator | null>(null);
  const eventListenersRef = useRef<Map<string, Function[]>>(new Map());

  // Initialize orchestrator
  useEffect(() => {
    if (!orchestratorRef.current) {
      orchestratorRef.current = new SessionOrchestrator();
      setupEventListeners();
    }

    return () => {
      if (orchestratorRef.current) {
        orchestratorRef.current.destroy();
        orchestratorRef.current = null;
      }
    };
  }, []);

  const setupEventListeners = useCallback(() => {
    if (!orchestratorRef.current) return;

    const events = [
      'session_created',
      'session_loaded',
      'session_transitioned',
      'session_updated',
      'session_recovered',
      'energy_updated',
      'player_error',
    ];

    events.forEach((event) => {
      orchestratorRef.current!.addEventListener(event, (data: any) => {
        handleOrchestratorEvent(event, data);
      });
    });
  }, []);

  const handleOrchestratorEvent = useCallback((event: string, data: any) => {
    switch (event) {
      case 'session_created':
      case 'session_loaded':
      case 'session_transitioned':
      case 'session_recovered':
        setSession(data);
        setError(null);
        break;

      case 'session_updated':
        setSession(data);
        break;

      case 'energy_updated':
        // Energy updates are handled by the orchestrator internally
        break;

      case 'player_error':
        setError(data.error);
        break;
    }

    // Notify custom event listeners
    const listeners = eventListenersRef.current.get(event);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(data);
        } catch (err) {
          console.error(`Error in event listener for ${event}:`, err);
        }
      });
    }
  }, []);

  // Session management methods
  const createSession = useCallback(
    async (userId: string, context: SessionContext): Promise<Session> => {
      if (!orchestratorRef.current) {
        throw new Error('Session orchestrator not initialized');
      }

      setIsLoading(true);
      setError(null);

      try {
        const newSession = await orchestratorRef.current.createSession(
          userId,
          context
        );
        setSession(newSession);
        return newSession;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create session';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const loadSession = useCallback(
    async (sessionId: string): Promise<Session> => {
      if (!orchestratorRef.current) {
        throw new Error('Session orchestrator not initialized');
      }

      setIsLoading(true);
      setError(null);

      try {
        const loadedSession =
          await orchestratorRef.current.loadSession(sessionId);
        setSession(loadedSession);
        return loadedSession;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load session';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const transitionSession = useCallback(
    async (transition: SessionTransition): Promise<Session> => {
      if (!orchestratorRef.current) {
        throw new Error('Session orchestrator not initialized');
      }

      setIsLoading(true);
      setError(null);

      try {
        const updatedSession =
          await orchestratorRef.current.transitionSession(transition);
        setSession(updatedSession);
        return updatedSession;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to transition session';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Session status methods
  const isSessionActive = useCallback((): boolean => {
    return orchestratorRef.current?.isSessionActive() || false;
  }, []);

  const canTransition = useCallback(
    (transition: SessionTransition): boolean => {
      return orchestratorRef.current?.canTransition(transition) || false;
    },
    []
  );

  const getCurrentStatus = useCallback((): SessionStatus | null => {
    return session?.status || null;
  }, [session]);

  // Energy management methods
  const addEnergyPoint = useCallback((value: number): void => {
    orchestratorRef.current?.addEnergyPoint(value);
  }, []);

  const getCurrentEnergy = useCallback((): number => {
    if (!session?.energy_curve.length) return 0;

    const recentPoints = session.energy_curve.slice(-10);
    return (
      recentPoints.reduce((sum, point) => sum + point.value, 0) /
      recentPoints.length
    );
  }, [session]);

  const getEnergyCurve = useCallback((): EnergyPoint[] => {
    return session?.energy_curve || [];
  }, [session]);

  // Recovery methods
  const saveRecoveryData = useCallback(async (): Promise<void> => {
    if (!orchestratorRef.current) {
      throw new Error('Session orchestrator not initialized');
    }

    await orchestratorRef.current.saveRecoveryData();
  }, []);

  const recoverSession = useCallback(
    async (sessionId: string): Promise<Session> => {
      if (!orchestratorRef.current) {
        throw new Error('Session orchestrator not initialized');
      }

      setIsLoading(true);
      setError(null);

      try {
        const recoveredSession =
          await orchestratorRef.current.recoverSession(sessionId);
        setSession(recoveredSession);
        return recoveredSession;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to recover session';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Event handling methods
  const addEventListener = useCallback(
    (event: string, listener: Function): void => {
      if (!eventListenersRef.current.has(event)) {
        eventListenersRef.current.set(event, []);
      }
      eventListenersRef.current.get(event)!.push(listener);
    },
    []
  );

  const removeEventListener = useCallback(
    (event: string, listener: Function): void => {
      const listeners = eventListenersRef.current.get(event);
      if (listeners) {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    },
    []
  );

  // Cleanup method
  const destroy = useCallback((): void => {
    if (orchestratorRef.current) {
      orchestratorRef.current.destroy();
      orchestratorRef.current = null;
    }
    eventListenersRef.current.clear();
    setSession(null);
    setError(null);
    setSessionUpdates([]);
    setLatestUpdate(null);
  }, []);

  // Auto-save recovery data when session changes
  useEffect(() => {
    if (session && session.status === 'LIVE') {
      const autoSaveInterval = setInterval(() => {
        saveRecoveryData().catch(console.error);
      }, 60000); // Every minute

      return () => clearInterval(autoSaveInterval);
    }
  }, [session, saveRecoveryData]);

  // Handle session updates
  useEffect(() => {
    if (session) {
      const update: SessionUpdate = {
        session_id: session.id,
        status: session.status,
        active_track_id: session.active_track_id,
        energy_level: getCurrentEnergy(),
        timestamp: new Date().toISOString(),
      };

      setLatestUpdate(update);
      setSessionUpdates((prev) => [...prev, update].slice(-50)); // Keep last 50 updates
    }
  }, [session, getCurrentEnergy]);

  return {
    // Session state
    session,
    isLoading,
    error,

    // Session management
    createSession,
    loadSession,
    transitionSession,

    // Session status
    isSessionActive: isSessionActive(),
    canTransition,
    getCurrentStatus,

    // Energy management
    addEnergyPoint,
    getCurrentEnergy,
    getEnergyCurve,

    // Recovery
    saveRecoveryData,
    recoverSession,

    // Real-time updates
    sessionUpdates,
    latestUpdate,

    // Event handling
    addEventListener,
    removeEventListener,

    // Cleanup
    destroy,
  };
}
