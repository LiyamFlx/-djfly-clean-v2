// Voice command service for hands-free DJ control
// Only available in browser environments

interface VoiceCommand {
  id: string;
  phrase: string;
  action: string;
  parameters: Record<string, unknown>;
  confidence: number;
  category: 'playback' | 'mixing' | 'effects' | 'navigation' | 'analytics';
}

interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  commands: VoiceCommand[];
  timestamp: Date;
}

class VoiceCommandService {
  private isListening = false;
  private recognition: any = null;
  private commands: VoiceCommand[] = [];
  private onCommandCallback: ((command: VoiceCommand) => void) | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeVoiceRecognition();
      this.setupCommands();
    }
  }

  private initializeVoiceRecognition() {
    try {
      // Check for browser support
      if (
        'webkitSpeechRecognition' in window ||
        'SpeechRecognition' in window
      ) {
        const SpeechRecognition =
          (window as any).SpeechRecognition ||
          (window as any).webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();

        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.setupRecognitionHandlers();
        this.isInitialized = true;
        console.log('🎤 Voice Command Service initialized');
      } else {
        console.warn('Speech recognition not supported in this browser');
      }
    } catch (error) {
      console.error('Failed to initialize voice recognition:', error);
    }
  }

  private setupRecognitionHandlers() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      console.log('🎤 Voice recognition started');
      this.isListening = true;
    };

    this.recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join(' ')
        .toLowerCase();

      if (event.results[event.results.length - 1].isFinal) {
        this.processTranscript(transcript);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Voice recognition error:', event.error);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      console.log('🎤 Voice recognition ended');
      this.isListening = false;
    };
  }

  private setupCommands() {
    this.commands = [
      // Playback Commands
      {
        id: 'play-deck-a',
        phrase: 'play deck a',
        action: 'playDeck',
        parameters: { deck: 'A' },
        confidence: 0.9,
        category: 'playback',
      },
      {
        id: 'play-deck-b',
        phrase: 'play deck b',
        action: 'playDeck',
        parameters: { deck: 'B' },
        confidence: 0.9,
        category: 'playback',
      },
      {
        id: 'pause',
        phrase: 'pause',
        action: 'pause',
        parameters: {},
        confidence: 0.95,
        category: 'playback',
      },
      {
        id: 'stop',
        phrase: 'stop',
        action: 'stop',
        parameters: {},
        confidence: 0.95,
        category: 'playback',
      },
      {
        id: 'next-track',
        phrase: 'next track',
        action: 'nextTrack',
        parameters: {},
        confidence: 0.9,
        category: 'playback',
      },
      {
        id: 'previous-track',
        phrase: 'previous track',
        action: 'previousTrack',
        parameters: {},
        confidence: 0.9,
        category: 'playback',
      },

      // Mixing Commands
      {
        id: 'crossfade',
        phrase: 'crossfade',
        action: 'crossfade',
        parameters: {},
        confidence: 0.85,
        category: 'mixing',
      },
      {
        id: 'beat-match',
        phrase: 'beat match',
        action: 'beatMatch',
        parameters: {},
        confidence: 0.8,
        category: 'mixing',
      },
      {
        id: 'sync-bpm',
        phrase: 'sync bpm',
        action: 'syncBPM',
        parameters: {},
        confidence: 0.8,
        category: 'mixing',
      },

      // Effects Commands
      {
        id: 'add-reverb',
        phrase: 'add reverb',
        action: 'addEffect',
        parameters: { effect: 'reverb' },
        confidence: 0.85,
        category: 'effects',
      },
      {
        id: 'add-delay',
        phrase: 'add delay',
        action: 'addEffect',
        parameters: { effect: 'delay' },
        confidence: 0.85,
        category: 'effects',
      },
      {
        id: 'add-filter',
        phrase: 'add filter',
        action: 'addEffect',
        parameters: { effect: 'filter' },
        confidence: 0.85,
        category: 'effects',
      },
      {
        id: 'remove-effects',
        phrase: 'remove effects',
        action: 'removeEffects',
        parameters: {},
        confidence: 0.9,
        category: 'effects',
      },

      // Navigation Commands
      {
        id: 'go-to-studio',
        phrase: 'go to studio',
        action: 'navigate',
        parameters: { page: 'studio' },
        confidence: 0.9,
        category: 'navigation',
      },
      {
        id: 'go-to-player',
        phrase: 'go to player',
        action: 'navigate',
        parameters: { page: 'player' },
        confidence: 0.9,
        category: 'navigation',
      },
      {
        id: 'go-to-analytics',
        phrase: 'go to analytics',
        action: 'navigate',
        parameters: { page: 'analytics' },
        confidence: 0.9,
        category: 'navigation',
      },

      // Analytics Commands
      {
        id: 'show-energy',
        phrase: 'show energy',
        action: 'showAnalytics',
        parameters: { metric: 'energy' },
        confidence: 0.85,
        category: 'analytics',
      },
      {
        id: 'show-crowd',
        phrase: 'show crowd',
        action: 'showAnalytics',
        parameters: { metric: 'crowd' },
        confidence: 0.85,
        category: 'analytics',
      },
      {
        id: 'show-performance',
        phrase: 'show performance',
        action: 'showAnalytics',
        parameters: { metric: 'performance' },
        confidence: 0.85,
        category: 'analytics',
      },
    ];
  }

  private processTranscript(transcript: string): VoiceRecognitionResult {
    const matchedCommands: VoiceCommand[] = [];
    let highestConfidence = 0;

    for (const command of this.commands) {
      const confidence = this.calculateMatchConfidence(
        transcript,
        command.phrase
      );
      if (confidence > 0.7) {
        matchedCommands.push({
          ...command,
          confidence: Math.max(command.confidence, confidence),
        });
        highestConfidence = Math.max(highestConfidence, confidence);
      }
    }

    const result: VoiceRecognitionResult = {
      transcript,
      confidence: highestConfidence,
      commands: matchedCommands.sort((a, b) => b.confidence - a.confidence),
      timestamp: new Date(),
    };

    // Execute the best matching command
    if (matchedCommands.length > 0) {
      const bestCommand = matchedCommands[0];
      console.log(`🎤 Voice command executed: ${bestCommand.phrase}`);

      if (this.onCommandCallback) {
        this.onCommandCallback(bestCommand);
      }
    }

    return result;
  }

  private calculateMatchConfidence(transcript: string, phrase: string): number {
    const transcriptWords = transcript.toLowerCase().split(' ');
    const phraseWords = phrase.toLowerCase().split(' ');

    let matches = 0;
    for (const word of phraseWords) {
      if (transcriptWords.includes(word)) {
        matches++;
      }
    }

    return matches / phraseWords.length;
  }

  startListening(): void {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
      } catch (error) {
        console.error('Failed to start voice recognition:', error);
      }
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Failed to stop voice recognition:', error);
      }
    }
  }

  onCommand(callback: (command: VoiceCommand) => void): void {
    this.onCommandCallback = callback;
  }

  getCommands(): VoiceCommand[] {
    return [...this.commands];
  }

  getCommandsByCategory(category: string): VoiceCommand[] {
    return this.commands.filter((cmd) => cmd.category === category);
  }

  addCommand(command: VoiceCommand): void {
    this.commands.push(command);
  }

  removeCommand(commandId: string): void {
    this.commands = this.commands.filter((cmd) => cmd.id !== commandId);
  }

  isListeningForCommands(): boolean {
    return this.isListening;
  }

  isServiceInitialized(): boolean {
    return this.isInitialized;
  }

  getStatus(): {
    isInitialized: boolean;
    isListening: boolean;
    commandsCount: number;
    supported: boolean;
  } {
    return {
      isInitialized: this.isInitialized,
      isListening: this.isListening,
      commandsCount: this.commands.length,
      supported:
        typeof window !== 'undefined' &&
        ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window),
    };
  }

  dispose(): void {
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
    this.isListening = false;
    this.isInitialized = false;
  }
}

// Export singleton instance
export const voiceCommandService = new VoiceCommandService();
